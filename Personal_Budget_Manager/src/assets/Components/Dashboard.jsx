import React, { useState,useEffect } from "react";
import Navbar from "./Navbar";
import { useBudget } from "./Contexts/BudgetContext";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Grid2
} from "@mui/material";
import { CheckCircle, AccessTime } from "@mui/icons-material";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import "../Styles/Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { budgets, transactions,incomes,remainders,addRemainder,upRemainder,delRemainder } = useBudget();
  const [timeRange, setTimeRange] = useState("Monthly");
  const [pietimeRange,setPieTimeRange]=useState("Monthly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const user=JSON.parse(localStorage.getItem("user"))
  const [Remainders,setRemainders] = useState({
    title:"",
    dueDate:new Date().toISOString().split("T")[0]
  });
  console.log(remainders)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalIncome = incomes.reduce((sum, money) => sum +money.amount, 0);
  const getTotalByMethod = (arr, method,amount) => 
  arr.reduce((sum, item) => 
    item.payment_method === method ? sum + item[amount] : sum
  , 0);

  const bankIncome = getTotalByMethod(incomes, "Bank","amount");
  const cashIncome = getTotalByMethod(incomes, "Cash","amount");
  const bankSpent  = getTotalByMethod(transactions, "Bank","amount")+getTotalByMethod(transactions, "BC","Bamount");
  const cashSpent  = getTotalByMethod(transactions, "Cash","amount")+getTotalByMethod(transactions, "BC","Camount");
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.Spent, 0);
  const remainingBalance = totalIncome - totalSpent;
  const bankRem=bankIncome - bankSpent;
  const cashRem=cashIncome - cashSpent;

  const groupedBudgets = budgets.reduce((acc, budget) => {
    if (!acc[budget.category]) acc[budget.category] = [];
    acc[budget.category].push(budget);
    return acc;
  }, {});

  // Place this inside your Dashboard component
useEffect(() => {
  const updateOverflowAnimation = () => {
    document.querySelectorAll('.remainder-card h3').forEach(h3 => {
      if (h3.scrollWidth > h3.clientWidth) {
        h3.classList.add('animate-overflow');
      } else {
        h3.classList.remove('animate-overflow');
      }
    });
  };
  updateOverflowAnimation();
}, [remainders]); // re-run on remainders change

  const pieData =(groupedBudgets[pietimeRange]||[] ).map((budget) => ({
    name: budget.name,
    value: budget.Spent,
  }));

 const calculateTotals = (transactions) => {
  const today = new Date();

  // Find Monday of this week
  const startOfWeek = new Date(today);
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0); // reset to start of the day

  let weekTotal = 0;
  let todayTotal = 0;

  transactions.forEach((t) => {
    const transactionDate = new Date(t.date);
    transactionDate.setHours(0, 0, 0, 0); // normalize date

    // Check if transaction is in this week
    if (transactionDate >= startOfWeek && transactionDate <= today) {
      weekTotal += t.amount;
    }

    // Check if transaction is today
    if (transactionDate.toDateString() === today.toDateString()) {
      todayTotal += t.amount;
    }
  });

  return { weekTotal, todayTotal };
};

// Usage
const { weekTotal, todayTotal } = calculateTotals(transactions);

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
        key = date.toLocaleString("default", { month: "short" }); 
      } else if (timeRange === "daily") {
        key = date.toLocaleDateString(); 
      } else {
        key = date.toISOString().split("T")[0]; 
      }
      if (!grouped[key]) grouped[key] = {};
      if (!grouped[key][t.description]) grouped[key][t.description] = 0;
      grouped[key][t.description] += t.amount;
    });

    return Object.keys(grouped)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((key) => ({
        name: key,
        ...grouped[key],
      }));
  };

  const getRandomLightColor = () => {
    const r = Math.floor(Math.random() * 156) + 100; 
    const g = Math.floor(Math.random() * 156) + 100; 
    const b = Math.floor(Math.random() * 156) + 100; 
    return `rgb(${r}, ${g}, ${b})`;
  };
  

  const getRandomDarkColor = () => {
    const r = Math.floor(Math.random() * 156); 
    const g = Math.floor(Math.random() * 156);
    const b = Math.floor(Math.random() * 156);
    return `rgb(${r},${g},${b})`;
  };

  const barData = groupTransactions();
  const allDescriptions = [...new Set(transactions.map((t) => t.description))];

  const handleChange = (e) => {
    setRemainders({ ...Remainders, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (!Remainders.title || !Remainders.dueDate) {
      alert("Please fill all fields!");
      return;
    }
    addRemainder({
      userId:user.id,
      title:Remainders.title,
      dueDate:new Date(Remainders.dueDate)
    });
    setRemainders({ title: "",dueDate:""});
    setIsModalOpen(false);
  };
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
        <p>💵₹{bankRem} | 🏦₹{cashRem}</p>
      </div>


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


        <div className="dashboard-card outcome">
          <div className="outcome-main1">
              <div className="outcome-header">
            <h3 className="outcome-title">Total Spent</h3>
          </div>

          <div className="outcome-split">
            <div className="outcome-item">
              <span className="outcome-icon">📅</span>
              <div>
                <p className="outcome-label">This Week</p>
                <p className="outcome-amount">₹{weekTotal}</p>
              </div>
            </div>

            <div className="outcome-item">
              <span className="outcome-icon">🛒</span>
              <div>
                <p className="outcome-label">Today</p>
                <p className="outcome-amount">₹{todayTotal}</p>
              </div>
            </div>
          </div>
          </div>
          <div className="outcome-main2">
            <div className="outcome-header1">
            <h3 className="outcome-title">Bill Remainder</h3>
            <AddIcon className="add-remainder-btn" onClick={() => setIsModalOpen(true)} />
          </div>
              <div className="remainder-box">
                  {remainders.map((bill,index)=>(
                    <div key={index} className="remainder-card">
                        <h3>{bill.title}</h3>
                        <p>🗓️{dayjs(bill.dueDate).format("DD MMM")}</p>
                        {bill.isPaid ? (
                          <CheckCircle color="success" sx={{ fontSize: 25,pt:0.5 }} />
                        ) : (
                          <AccessTime color="error" sx={{ fontSize: 25,pt:0.5 }} />
                        )}
                    </div>
                  ))}
              </div>
          </div>
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

          <ResponsiveContainer width="100%" height={250} >
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
        {isModalOpen && (
          <div className="overlay">
            <div className="modal">
              <CloseIcon className="close-icon" onClick={() => setIsModalOpen(false)} />
              <h3>Add Remainder</h3>
              <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Remainder Title" value={Remainders.title} onChange={handleChange} />
                <input type="date" name="dueDate" placeholder="Due Date" value={Remainders.dueDate} onChange={handleChange} />
                <button type="submit">Add</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
