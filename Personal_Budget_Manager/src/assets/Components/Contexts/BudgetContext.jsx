import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import API from "../../../axiosInstance"
const BudgetContext = createContext();
import { useEffect } from "react";
export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [budgets, setBudgets] = useState([]);
  const [incomes,setIncomes]=useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const body={userId:user.id}
      try {
        const budgetRes = await API.post("/budgets/all",body);
        const transactionRes = await API.post("/transactions/all",body);
        const incomeRes = await API.post("/incomes/all",body);
        // console.log(budgetRes)
        // console.log(transactionRes)
        // console.log(incomeRes)
        
        setBudgets(budgetRes.data);
        setTransactions(transactionRes.data);
        setIncomes(incomeRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const addTransaction = async (transaction) => {
    try {
      const res = await API.post("/transactions/add", transaction);
      console.log(res.data)
      setTransactions((prev) => [...prev, res.data]);

      // Update the spent amount in budgets
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

  // Function to add a new budget
  const addBudget = async (newBudget) => {
    try {
      const res = await API.post("/budgets/add", newBudget);
      setBudgets((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

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
      setIncomes((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  const delIncome=async(incomeId)=>{
    try{
      await API.delete(`/incomes/del/${incomeId}`);
      setIncomes(budgets.filter((bud) => bud._id !== incomeId));
    }catch(error){
      console.log("Error Deleting Income:",error);
    }
  }
  return (
    <BudgetContext.Provider value={{ budgets,delBudget,delIncome, setBudgets,setTransactions,delTransaction,setIncomes,setUser ,transactions,incomes, addTransaction, addBudget, addIncome,user }}>
      {children}
    </BudgetContext.Provider>
  );
};
