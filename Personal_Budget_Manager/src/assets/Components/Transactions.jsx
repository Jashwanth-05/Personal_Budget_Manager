import React, { useState } from "react";
import Navbar from "./Navbar";
import "../Styles/Transactions.css";
import { useBudget } from "./Contexts/BudgetContext";
import { List, ListItem, ListItemText, IconButton, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, isWithinInterval, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

const Transactions = () => {
  const { transactions, addTransaction, delTransaction,budgets,upBudget} = useBudget();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("monthly");
  const user=JSON.parse(localStorage.getItem("user"));
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [newTransaction, setNewTransaction] = useState({
    budgetId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0], 
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const today = new Date();

    if (filter === "monthly") {
      return isWithinInterval(transactionDate, {
        start: startOfMonth(today),
        end: endOfMonth(today),
      });
    } else if (filter === "weekly") {
      return isWithinInterval(transactionDate, {
        start: startOfWeek(today),
        end: endOfWeek(today),
      });
    } else if (filter === "custom" && customRange.start && customRange.end) {
      return isWithinInterval(transactionDate, {
        start: new Date(customRange.start),
        end: new Date(customRange.end),
      });
    }
    return true;
  });


  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleCustomRangeChange = (e) => {
    setCustomRange({ ...customRange, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTransaction.budgetId || !newTransaction.amount || !newTransaction.description || !newTransaction.date) {
      alert("Please fill all fields!");
      return;
    }
    const curBudget=budgets.find(bud=>bud._id===newTransaction.budgetId);
    if(curBudget.Spent+Number(newTransaction.amount)>curBudget.budget){
      alert("Transaction exceeds the budget limit!");
      upBudget({id:newTransaction.budgetId})
    }
    console.log(newTransaction)
    addTransaction({
      userId:user.id,
      budgetId: newTransaction.budgetId,
      description: newTransaction.description,
      amount: Number(newTransaction.amount),
      date: newTransaction.date, 
    });
    setNewTransaction({ budgetName: "", amount: "", description: "", date: new Date().toISOString().split("T")[0] });
    setIsModalOpen(false);
  };

  return (
    <div>
      <Navbar />
      <main className="transactions-main">
        <div className="transactions-header">
          <h2 className="transactions-title">Transactions</h2>

         <div className="filter-container">
            <label>Filter:</label>
            <select value={filter} onChange={handleFilterChange}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom Range</option>
            </select>
            {filter === "custom" && (
              <div className="custom-date-inputs">
                <input type="date" name="start" value={customRange.start} onChange={handleCustomRangeChange} />
                <input type="date" name="end" value={customRange.end} onChange={handleCustomRangeChange} />
              </div>
            )}
          </div>
          <AddIcon className="add-transaction-btn" onClick={() => setIsModalOpen(true)} />
        </div>
        <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Budget Name</th>
              <th>Description</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{format(new Date(transaction.date), "dd/MM/yyyy")}</td>
                <td>{transaction.budgetName}</td>
                <td>{transaction.description}</td>
                <td className="amount">
                  ₹{transaction.amount}
                </td>
                <td>
                <IconButton edge="end" color="error" onClick={() => delTransaction(transaction._id)}>
                <DeleteIcon />
                </IconButton>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {isModalOpen && (
          <div className="overlay">
            <div className="modal">
              <CloseIcon className="close-icon" onClick={() => setIsModalOpen(false)} />
              <h3>Add Transaction</h3>
              <form onSubmit={handleSubmit}>
                <select name="budgetId" value={newTransaction.budgetName} onChange={handleChange}>
                  <option value="">Select Budget</option>
                  {budgets.map((budget, index) => (
                    <option key={index} value={budget._id}>
                      {budget.name}
                    </option>
                  ))}
                </select>
                <input type="date" name="date" value={newTransaction.date} onChange={handleChange} />
                <input type="number" name="amount" placeholder="Amount" value={newTransaction.amount} onChange={handleChange} />
                <input type="text" name="description" placeholder="Description" value={newTransaction.description} maxLength={25} onChange={handleChange} />
                <button type="submit">Add Transaction</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Transactions;
