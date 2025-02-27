import React, { createContext, useContext, useState } from "react";
import axios from "axios";
const BudgetContext = createContext();
import { useEffect } from "react";
export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [incomes,setIncomes]=useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const budgetRes = await axios.get("http://localhost:5556/budgets/all");
        const transactionRes = await axios.get("http://localhost:5556/transactions/all");
        const incomeRes = await axios.get("http://localhost:5556/incomes/all");
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
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const res = await axios.post("http://localhost:5556/transactions/add", transaction);
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
  // Function to add a new budget
  const addBudget = async (newBudget) => {
    try {
      const res = await axios.post("http://localhost:5556/budgets/add", newBudget);
      setBudgets((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const addIncome = async (newIncome) => {
    try {
      const res = await axios.post("http://localhost:5556/incomes/add", newIncome);
      setIncomes((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };
  return (
    <BudgetContext.Provider value={{ budgets, setBudgets, transactions,incomes, addTransaction, addBudget, addIncome }}>
      {children}
    </BudgetContext.Provider>
  );
};
