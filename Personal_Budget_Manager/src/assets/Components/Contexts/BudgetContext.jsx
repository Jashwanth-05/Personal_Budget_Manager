import React, { createContext, useContext, useState } from "react";

import API from "../../../axiosInstance"
const BudgetContext = createContext();
import { useEffect } from "react";
import { endOfMonth, startOfMonth } from "date-fns";
import dayjs from "dayjs";
export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [budgets, setBudgets] = useState([]);
  const [incomes,setIncomes]=useState([]);
  const [transactions, setTransactions] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [remainders, setRemainders] = useState([]);
  const [amounts,setAmounts]= useState([]);
  useEffect(() => {
    let mounted = true;

  const fetchData = async () => {
    if (!mounted) return;
    const body = { userId: user.id };
    try {
      const budgetRes = await API.post("/budgets/all", body);
      const transactionRes = await API.post("/transactions/all", body);
      const incomeRes = await API.post("/incomes/all", body);
      const taxRes = await API.get(`/tax/all/${user.id}`);
      const RemainderRes = await API.post("/remainders/all", body);
      const amountsRes = await API.post("amounts/all", body);

      setAmounts(amountsRes.data);

      setBudgets(
        budgetRes.data.filter((budget) => {
          if (!budget.valid) return false;
          const today = new Date();
          const validDate = new Date(budget.valid);
          return !isNaN(validDate) && validDate >= today;
        })
      );

      setTransactions(
        transactionRes.data.sort((a, b) => new Date(b.date) - new Date(a.date))
      );

      const today = new Date();
      const svalidDate = startOfMonth(today);
      const evalidDate = endOfMonth(today);

      let monthlyIncomes = incomeRes.data
        .filter((income) => {
          if (!income.date) return false;
          const indate = new Date(income.date);
          return !isNaN(indate) && indate <= evalidDate && indate >= svalidDate;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (monthlyIncomes.length === 0) {
        console.log("working");
        const totalBalance = amountsRes.data.reduce(
          (acc, curr) => acc + curr.total,
          0
        );

        const carryForwardIncome = {
          userId: user.id,
          source: "Remaining Balance Carry Forward",
          amount: totalBalance,
          date: today.toISOString(),
          payment_method: "carry-forward",
        };

        try {
          const res = await API.post("/incomes/add", carryForwardIncome);
          monthlyIncomes = [res.data.income];
          setAmounts(res.data.amounts);
        } catch (err) {
          console.error("Error adding carry-forward income:", err);
        }
      }

      setIncomes(monthlyIncomes);

      setRemainders(
        RemainderRes.data
          .filter((bill) => {
            if (!bill.dueDate) return false;
            const today = dayjs();
            const dueDate = dayjs(bill.dueDate);

            return (
              dueDate.month() === today.month() &&
              dueDate.year() === today.year()
            );
          })
          .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())
      );

      setCalculations(
        taxRes.data.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
   return () => {
    mounted = false;
  };
  }, [user]);


  const transferAmount = async (transfer) => {
    const {from,to,amount} =transfer;
  try {
    const response = await API.post("/amounts/transfer", {
      userId:user.id,
      from:from,
      to:to,
      amount:Number(amount)
    });


    setAmounts((prevAmounts) =>
      prevAmounts.map((acc) => {
        if (acc.type === from) {
          return { ...acc, total: acc.total - Number(amount) };
        }
        if (acc.type === to) {
          return { ...acc, total: acc.total + Number(amount) };
        }
        return acc;
      })
    );

    console.log("Transfer successful:", response.data);
  } catch (error) {
    console.error("Error transferring amount:", error);
  }
};


  const addTransaction = async (transaction) => {
  try {
    console.log(transaction);
    const res = await API.post("/transactions/add", transaction);

    // Update transactions
    setTransactions((prev) =>
      [...prev, res.data.transaction].sort((a, b) => new Date(b.date) - new Date(a.date))
    );

    // Update budgets
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget._id === transaction.budgetId
          ? {
              ...budget,
              Spent: budget.Spent + transaction.amount,
              savings: Math.max(0,budget.savings - transaction.amount)
            }
          : budget
      )
    );


    setAmounts(res.data.amounts);
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
};


const delTransaction = async (transactionId) => {
  try {
    const res = await API.delete(`/transactions/del/${transactionId}`);
    console.log(res.data.updatedBudget);
    const {_id,savings,Spent,overflow}=res.data.updatedBudget;
    // remove transaction from list
    setTransactions((prev) => prev.filter((txn) => txn._id !== res.data.deletedId));

    // sync amounts
    setAmounts(res.data.amounts);

    // sync budgets (optional, if you want savings/Spent updated instantly)
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget._id === _id
          ? { ...budget, savings: savings, Spent: Spent,overflow:overflow}
          : budget
      )
    );

  } catch (error) {
    console.log("Error Deleting Transaction:", error);
  }
};



  const addRemainder = async (newRemainder) => {
    try {
      const res = await API.post("/remainders/add", newRemainder);
      setRemainders((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding remainder:", error);
    }
  };
  const upRemainder=async(updRemainderID,body)=>{
    const {isPaid,isRepeated}=body;
    try{
      const res=await API.put(`/remainders/edit/${updRemainderID}`,body);
      console.log(res.data);
      setRemainders((old) => {
        const updated = old.map((value) =>
          value._id === updRemainderID
            ? { ...value, isPaid: isPaid, isRepeated: isRepeated }
            : value
        );

        let newList = res.data.newRemainder ? [...updated, res.data.newRemainder] : updated;

        // ✅ Keep only bills in current month (including overdue)
        const today = dayjs();
        newList = newList.filter((bill) => {
          if (!bill.dueDate) return false;
          const dueDate = dayjs(bill.dueDate);
          return dueDate.month() === today.month() && dueDate.year() === today.year();
        });

        // ✅ Sort by dueDate
        newList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        return newList;
      });

    }catch(error){
      console.log("Error Updating Remainder",error);
    }
  }
  const delRemainder=async(remainderId)=>{
    try{
      await API.delete(`/remainders/del/${remainderId}`);
      setRemainders(remainders.filter((bud) => bud._id !== remainderId));
    }catch(error){
      console.log("Error Deleting Remainder:",error);
    }
  }

  const addBudget = async (newBudget) => {
    try {
      const res = await API.post("/budgets/add", newBudget);
      setBudgets((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };
  const upBudget=async(updBudget)=>{
    try{
      const res=await API.put(`/budgets/edit/${updBudget.id}`,{overflow:true})
      setBudgets((old)=>{
        return old.map((value)=>value._id===updBudget.id?{...value,overflow:true}:value)
      })
    }catch(error){
      console.log("Error Updating Budget",error);
    }
  }
  const delBudget=async(budgetId)=>{
    try{
      await API.delete(`/budgets/del/${budgetId}`);
      setBudgets(budgets.filter((bud) => bud._id !== budgetId));
    }catch(error){
      console.log("Error Deleting Budget:",error);
    }
  }

  const createFromPresets = async (body) => {
    try {
      const res = await API.post("/budgets/createFromPresets", body);
      // setBudgets((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding budget presets:", error);
    }
  };

  const addIncome = async (newIncome) => {
    try {
      console.log(newIncome)
      const res = await API.post("/incomes/add", newIncome);
      setIncomes((prev) => [...prev, res.data.income].sort((a,b)=>new Date(b.date)-new Date(a.date)));
      setAmounts(res.data.amounts);
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  const delIncome=async(incomeId)=>{
    try{
      const res=await API.delete(`/incomes/del/${incomeId}`);
      setIncomes(incomes.filter((bud) => bud._id !== incomeId));
      setAmounts(res.data.amounts);
    }catch(error){
      console.log("Error Deleting Income:",error);
    }
  }

  const addTax=async (newTax)=>{
    try{
      const res=await API.post("/tax/add",newTax)
      setCalculations((prev)=>([...prev,res.data].sort((a,b)=>new Date(b.date)-new Date(a.date))))
    }
    catch(error){
      console.log("Error Adding Tax Calculaton",error);
    }
  }
  const delTax=async(taxId)=>{
    try{
      await API.delete(`tax/del/${taxId}`);
      setCalculations(calculations.filter((tax) => tax._id !== taxId));
    }catch(error){
      console.log("Error Deleting Tax Calculation",error);
    }
    
  }
  return (
    <BudgetContext.Provider value={{ amounts,budgets,createFromPresets,transferAmount,delBudget,delIncome,addRemainder,upRemainder,delRemainder,remainders,delTax,upBudget,calculations,addTax, setBudgets,setTransactions,delTransaction,setIncomes,setUser ,transactions,incomes, addTransaction, addBudget, addIncome,user }}>
      {children}
    </BudgetContext.Provider>
  );
};
