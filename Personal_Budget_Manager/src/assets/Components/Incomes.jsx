import React, { useState } from "react";
import { useRef } from "react";
import Navbar from "./Navbar";
import "../Styles/Incomes.css";
import { useBudget } from "./Contexts/BudgetContext";
import { List, ListItem, ListItemText, IconButton, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, isWithinInterval, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

const Incomes = () => {
  const pValues=useRef({});
  const { incomes,addIncome,delIncome} = useBudget();
  const user=JSON.parse(localStorage.getItem("user"))
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState("monthly");
    const today=new Date();
    const enddate=subDays(today,7);
    const [customRange, setCustomRange] = useState({ start: format(enddate, "yyyy-MM-dd"),
  end: format(today, "yyyy-MM-dd"), });
  const [newIncome, setNewIncome] = useState({
        name: "",
        money: "",
        payment_method:"",
        date: new Date().toISOString().split("T")[0],});
  const handleChange = (e) => {
    setNewIncome({ ...newIncome, [e.target.name]: e.target.value });
  };

    const filteredIncomes = incomes.filter((Income) => {
      const IncomeDate = new Date(Income.date);
      const today = new Date();
  
      if (filter === "monthly") {
        return isWithinInterval(IncomeDate, {
          start: startOfMonth(today),
          end: endOfMonth(today),
        });
      } else if (filter === "weekly") {
        return isWithinInterval(IncomeDate, {
          start: startOfWeek(today),
          end: endOfWeek(today),
        });
      } else if (filter === "custom" && customRange.start && customRange.end) {
        return isWithinInterval(IncomeDate, {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newIncome.name || !newIncome.money || !newIncome.payment_method || !newIncome.date) {
      alert("Please fill all fields!");
      return;
    }
    addIncome({
      userId:user.id,
      source:newIncome.name,
      amount:newIncome.money,
      payment_method:newIncome.payment_method,
      date:new Date(newIncome.date)
    });
    setNewIncome({ name: "", money: "",payment_method:"", date: new Date().toISOString().split("T")[0] });
    setIsModalOpen(false);
  };
  return (
    <div>
      <Navbar />
      <main className="incomes-main">
         <div className="income">
        <div className="income-header">
          <h2 className="income-title">Incomes</h2>
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
          <AddIcon className="add-income-btn" onClick={() => setIsModalOpen(true)} />
        </div>
        <div className="income-table-container">
                <table className="income-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source</th>
                      <th>Method</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncomes.map((income, index) => (
                      <tr key={index}>
                        <td>{format(new Date(income.date), "dd/MM/yyyy")}</td>
                        <td>{income.source}</td>
                        <td>{income.payment_method}</td>
                        <td>
                          ₹{income.amount}
                        </td>
                        <td>
                        <IconButton edge="end" color="error" onClick={() => delIncome(income._id)}>
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
              <h3>Add Income</h3>
              <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Source" value={newIncome.name} onChange={handleChange}/>
                <select name="payment_method" value={newIncome.payment_method} onChange={handleChange}>
                  <option value="">Select Method</option>
                  <option value="Bank">Bank</option>
                  <option value="Cash">Cash</option>
                </select>
                <input type="date" name="date" value={newIncome.date} onChange={handleChange} />
                <input type="number" name="money" placeholder="Amount" value={newIncome.money} onChange={handleChange} />
                <button type="submit">Add Income</button>
              </form>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default Incomes;
