import React, { createContext, useContext, useState } from "react";

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([
    { category: "Monthly", name: "Groceries", Budget: 1000, Spent: 500 },
    { category: "Weekly", name: "Transport", Budget: 250, Spent: 100 },
    { category: "Custom", name: "Vacation", Budget: 400, Spent: 150 },
  ]);
  const [incomes,setIncomes]=useState([{name:"Salary",money:20000,date:"2025-02-01"}])
  const [transactions, setTransactions] = useState([
    { budgetName: "Groceries", description: "Bought vegetables", amount: 500, date: "2025-02-15" },   
  ]);

  // Function to add a new transaction and update the budget
  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);

    // Update the budget's spent amount if the transaction matches a budget name
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.name === transaction.budgetName
          ? { ...budget, Spent: budget.Spent + transaction.amount }
          : budget
      )
    );
  };

  // Function to add a new budget
  const addBudget = (newBudget) => {
    setBudgets((prevBudgets) => [...prevBudgets, { ...newBudget, Budget: Number(newBudget.Budget), Spent: 0 }]);
  };

  const addIncome=(newIncome)=>{
    setIncomes((prev)=>[...prev,{...newIncome,money:Number(newIncome.money)}])
  }
  return (
    <BudgetContext.Provider value={{ budgets, setBudgets, transactions,incomes, addTransaction, addBudget, addIncome }}>
      {children}
    </BudgetContext.Provider>
  );
};
