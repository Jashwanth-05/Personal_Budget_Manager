import React, { useState } from "react";
import Navbar from "./Navbar";
import { useBudget } from "./Contexts/BudgetContext";
import "../Styles/Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { format, isWithinInterval, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
const Dashboard = () => {
  const { budgets, transactions,incomes,addIncome } = useBudget();
  const [timeRange, setTimeRange] = useState("monthly");
  const [pietimeRange,setPieTimeRange]=useState("Monthly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [newIncome, setNewIncome] = useState({
      name: "",
      money: "",
      date: new Date().toISOString().split("T")[0], // Default to today
    });
  const totalIncome = incomes.reduce((sum, money) => sum +money.money, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.Spent, 0);
  const remainingBalance = totalIncome - totalSpent;

  

  const groupedBudgets = budgets.reduce((acc, budget) => {
    if (!acc[budget.category]) acc[budget.category] = [];
    acc[budget.category].push(budget);
    return acc;
  }, {});

  const pieData = groupedBudgets[pietimeRange].map((budget) => ({
    name: budget.name,
    value: budget.Spent,
  }));


  const handleChange = (e) => {
    setNewIncome({ ...newIncome, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newIncome.name || !newIncome.money || !newIncome.date) {
      alert("Please fill all fields!");
      return;
    }
    addIncome({
      ...newIncome,
      money: Number(newIncome.money),
      date: newIncome.date,
    });
    setNewIncome({ name: "", money: "", date: new Date().toISOString().split("T")[0] });
    setIsModalOpen(false);
  };

  // 🟢 Group Transactions Based on Time Filter
  const groupTransactions = () => {
    const grouped = {};
    const filteredTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      if (timeRange === "custom" && customStartDate && customEndDate) {
        return transactionDate >= new Date(customStartDate) && transactionDate <= new Date(customEndDate);
      }
      return true;
    });

    filteredTransactions.forEach((t) => {
      const date = new Date(t.date);
      let key;
      if (timeRange === "monthly") {
        key = date.toLocaleString("default", { month: "short" }); // Ex: Jan, Feb
      } else if (timeRange === "daily") {
        key = date.toLocaleDateString(); // Ex: 02/27/2025
      } else {
        key = date.toISOString().split("T")[0]; // Ex: 2025-02-27 (Custom Date Format)
      }
      if (!grouped[key]) grouped[key] = {};
      if (!grouped[key][t.description]) grouped[key][t.description] = 0;
      grouped[key][t.description] += t.amount;
    });

    return Object.keys(grouped)
      .sort((a, b) => new Date(a) - new Date(b)) // Sort X-axis by Date
      .map((key) => ({
        name: key,
        ...grouped[key],
      }));
  };

  const getRandomLightColor = () => {
    const r = Math.floor(Math.random() * 156) + 100; // 100-255
    const g = Math.floor(Math.random() * 156) + 100; // 100-255
    const b = Math.floor(Math.random() * 156) + 100; // 100-255
    return `rgb(${r}, ${g}, ${b})`;
  };
  

  const getRandomDarkColor = () => {
    const r = Math.floor(Math.random() * 156); // Limit max to 155 for dark shades
    const g = Math.floor(Math.random() * 156);
    const b = Math.floor(Math.random() * 156);
    return `rgb(${r},${g},${b})`;
  };

  const barData = groupTransactions();
  const allDescriptions = [...new Set(transactions.map((t) => t.description))];

  return (
    <div>
      <Navbar />
      <main className="dashboard-grid">
      <div className="dashboard-card income-card">
      <div className="income-section">
        <h3 style={{color:"black"}}>Total Income</h3>
        <p>₹{totalIncome}</p>
      </div>

      <div className="remaining-section">
        <h3>What's Left in Pocket</h3>
        <p>₹{remainingBalance}</p>
      </div>

      {/* Spending Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(totalSpent / totalIncome) * 100}%` }}
        ></div>
      </div>

        <p className="spending-info">
          You've spent <b>₹{totalSpent}</b> out of ₹{totalIncome}.
        </p>
      </div>


        <div className="dashboard-card income">
        <div className="income-header">
          <h2 className="income-title">Incomes</h2>
          <AddIcon className="add-income-btn" onClick={() => setIsModalOpen(true)} />
        </div>
        <div className="income-table-container">
                <table className="income-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((income, index) => (
                      <tr key={index}>
                        <td>{format(new Date(income.date), "dd/MM/yyyy")}</td>
                        <td>{income.name}</td>
                        <td>
                          ₹{income.money}
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
                <input type="date" name="date" value={newIncome.date} onChange={handleChange} />
                <input type="number" name="money" placeholder="Amount" value={newIncome.money} onChange={handleChange} />
                <button type="submit">Add Income</button>
              </form>
            </div>
          </div>
        )}
        </div>

        <div className="dashboard-card chart-card">
          <h3>Budget Spending Overview</h3>
          <select value={pietimeRange} onChange={(e) => setPieTimeRange(e.target.value)}>
        <option value="">Select Budget</option>
        {Object.keys(groupedBudgets).map((budgetName) => (
          <option key={budgetName} value={budgetName}>
            {budgetName}
          </option>
        ))}
      </select>
          <PieChart width={300} height={300}>
            <Pie data={pieData} cx="50%" cy="40%" outerRadius={80} fill="#8884d8" dataKey="value" label={false} labelLine={false}>
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getRandomLightColor()} />
              ))}
            </Pie>
            <Tooltip   cursor={{ stroke: "blue", strokeWidth: 2 }}
  wrapperStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)",border:"0", borderRadius: "5px", padding: "10px" }}
  itemStyle={{ color: "black", fontWeight: "bold" }}
  formatter={(value) => `₹${value.toFixed(2)}`} />
      <Legend 
        layout="horizontal" 
        align="center" 
        verticalAlign="bottom" 
        wrapperStyle={{ 
          padding: "10px 0px 10px 10px", 
          borderRadius: "5px", 
          maxHeight: "50px", 
          overflowY: "auto", 
          backgroundColor: "#222", 
          fontWeight: "bold",
          textAlign: "center",
          scrollbarWidth: "none",
          msOverflowStyle:"none"
        }} 
      />
          </PieChart>
        </div>

        <div className="dashboard-card bar-chart-card">
          <h3>Transactions Overview</h3>
          <div className="filter-container">
            <button onClick={() => setTimeRange("monthly")}>Monthly</button>
            <button onClick={() => setTimeRange("daily")}>Daily</button>
            <button onClick={() => setTimeRange("custom")}>Custom</button>
          </div>

          {timeRange === "custom" && (
            <div className="date-filter">
              <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
              <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
            </div>
          )}

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" stroke="white" angle={-15} textAnchor="end" />
              <YAxis stroke="white" />
              <Tooltip />
              {allDescriptions.map((desc, index) => (
                <Bar key={desc} dataKey={desc} stackId="a" fill={getRandomDarkColor()} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
