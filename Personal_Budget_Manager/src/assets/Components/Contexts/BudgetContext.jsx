import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import API from "../../../axiosInstance"
const BudgetContext = createContext();
import { useEffect } from "react";
import { endOfMonth, startOfMonth } from "date-fns";
export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [budgets, setBudgets] = useState([]);
  const [incomes,setIncomes]=useState([]);
  const [transactions, setTransactions] = useState([]);
  const [calculations, setCalculations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const body={userId:user.id}
      try {
        const budgetRes = await API.post("/budgets/all",body);
        const transactionRes = await API.post("/transactions/all",body);
        const incomeRes = await API.post("/incomes/all",body);
        const taxRes=await API.get(`/tax/all/${user.id}`);
        // console.log(budgetRes)
        // console.log(transactionRes)
        // console.log(incomeRes)
        
        setBudgets(
          budgetRes.data
            .filter((budget) => {
              if (!budget.valid) return false; 
              const today = new Date();
              const validDate = new Date(budget.valid);
              return !isNaN(validDate) && validDate >= today;
            })
        );
        
        setTransactions(
          transactionRes.data
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        
        setIncomes(
          incomeRes.data
            .filter((income) => {
              if (!income.date) return false; 
              const today = new Date();
              const svalidDate=startOfMonth(today);
              const evalidDate = endOfMonth(today);
              const indate = new Date(income.date);
              return !isNaN(indate) && indate <= evalidDate && indate>=svalidDate;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        
        setCalculations(
          taxRes.data
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        );        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const addTransaction = async (transaction) => {
    try {
      const res = await API.post("/transactions/add", transaction);
      setTransactions((prev) => [...prev, res.data].sort((a,b)=>new Date(b.date)-new Date(a.date)));
      setBudgets((prevBudgets) =>
        prevBudgets.map((budget) =>
          budget._id === transaction.budgetId
            ? { ...budget, Spent: budget.Spent + transaction.amount }
            : budget
        )
      );
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const delTransaction=async(transactionId)=>{
    try{
      await API.delete(`/transactions/del/${transactionId}`);
      setTransactions(transactions.filter((txn) => txn._id !== transactionId));
    }catch(error){
      console.log("Error Deleting Transaction:",error);
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
      const res=await API.put(`/budgets/edit/${updBudget.id}`,{budget:updBudget.budget})
      setBudgets((old)=>{
        return old.map((value)=>value._id===updBudget.id?{...value,budget:updBudget.budget}:value)
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

  const addIncome = async (newIncome) => {
    try {
      console.log(newIncome)
      const res = await API.post("/incomes/add", newIncome);
      setIncomes((prev) => [...prev, res.data].sort((a,b)=>new Date(b.date)-new Date(a.date)));
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  const delIncome=async(incomeId)=>{
    try{
      await API.delete(`/incomes/del/${incomeId}`);
      setIncomes(incomes.filter((bud) => bud._id !== incomeId));
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
    <BudgetContext.Provider value={{ budgets,delBudget,delIncome,delTax,upBudget,calculations,addTax, setBudgets,setTransactions,delTransaction,setIncomes,setUser ,transactions,incomes, addTransaction, addBudget, addIncome,user }}>
      {children}
    </BudgetContext.Provider>
  );
};
