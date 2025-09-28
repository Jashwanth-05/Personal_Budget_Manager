import React, { useState } from "react";
import { evaluate } from "mathjs";
import { useRef } from "react";
import Navbar from "./Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../NotoSans-Regular-normal.js"
import "../NotoSans-Bold-normal.js"
import "../Styles/Transactions.css";
import { useBudget } from "./Contexts/BudgetContext";
import { List, ListItem, ListItemText, IconButton, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AlertDialog from "./AlertDialog.jsx";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, isWithinInterval, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

const Transactions = () => {
  const pValues=useRef({});
  const { transactions, addTransaction, delTransaction,budgets,upBudget} = useBudget();
  const [isExportDialogOpen,setIsExportDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("monthly");
  const user=JSON.parse(localStorage.getItem("user"));
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [newTransaction, setNewTransaction] = useState({
    budgetId: "",
    amount: "",
    Bamount:"",
    Camount:"",
    payment_method:"",
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

  const handleBlur = (e) => {
    const {name,value}=e.target;
    if(pValues.current[name]===value){
      console.log("True");
      return;
    }
    console.log("False");
    try {
      const result = evaluate(value);
      setNewTransaction({...newTransaction,[name]:result})
      pValues.current[name]=value;
    } catch {
      console.error("Invalid expression");
    }
  };

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
    if (!newTransaction.budgetId || !newTransaction.description || !newTransaction.payment_method  || !newTransaction.date || (newTransaction.payment_method==="BC" && (!newTransaction.Bamount || !newTransaction.Camount)) || (newTransaction.payment_method!="BC" && (!newTransaction.amount))) {
      alert("Please fill all fields!");
      return;
    }
    const curBudget=budgets.find(bud=>bud._id===newTransaction.budgetId);
    const totalAmount = newTransaction.payment_method === "BC"
      ? Number(newTransaction.Bamount) + Number(newTransaction.Camount)
      : Number(newTransaction.amount);

    if (curBudget.Spent + totalAmount > curBudget.budget) {
      alert("Transaction exceeds the budget limit!");
      upBudget({ id: newTransaction.budgetId });
    }
    console.log(newTransaction)
    addTransaction({
      userId:user.id,
      budgetId: newTransaction.budgetId,
      description: newTransaction.description,
      Bamount:Number(newTransaction.Bamount),
      Camount:Number(newTransaction.Camount),
      amount: Number(newTransaction.amount),
      payment_method:newTransaction.payment_method,
      date: newTransaction.date, 
    });
    setNewTransaction({ budgetId: "",Bamount:"",Camount:"", amount: "",payment_method:"", description: "", date: new Date().toISOString().split("T")[0] });
    setIsModalOpen(false);
  };

  let totalAmount = 0;
  filteredTransactions.forEach((transaction) => {
    const amount =
      transaction.payment_method === "BC"
        ? transaction.Bamount + transaction.Camount
        : transaction.amount;

    totalAmount += amount;});

  const exportToPDF = () => {
  const doc = new jsPDF();

  // Get current month name
  const monthName = format(new Date(), "MMMM yyyy"); // e.g., "September 2025"

  // Set PDF title and header
  doc.setFont("NotoSans-Regular", "normal");
  doc.setFontSize(16);
  doc.text(`Transactions Report - ${monthName}`, 14, 20);

  const tableColumn = ["Date", "Budget Name", "Description", "Method", "Amount"];
  const tableRows = [];

  let totalAmount = 0;
  filteredTransactions.forEach((transaction) => {
    const amount =
      transaction.payment_method === "BC"
        ? transaction.Bamount + transaction.Camount
        : transaction.amount;

    totalAmount += amount;

    tableRows.push([
      format(new Date(transaction.date), "dd/MM/yyyy"),
      transaction.budgetName || "-",
      transaction.description || "-",
      transaction.payment_method,
      `₹${amount}`,
    ]);
  });

  tableRows.push([
    { content: "Total", colSpan: 4, styles: { halign: "right", font: "NotoSans-Bold" } },
    { content: `₹${totalAmount}`, styles: { font: "NotoSans-Bold" } },
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 10, font: "NotoSans-Regular" },
    headStyles: { fillColor: [41, 128, 185] }, // Blue header
  });

  // Save file with month in the filename
  doc.save(`transactions_${monthName}.pdf`);
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
          <div className="in-btns">
          <FileDownloadIcon className="export-btn" onClick={()=> setIsExportDialogOpen(true)}/>
          <AddIcon className="add-transaction-btn" onClick={() => setIsModalOpen(true)} />
          </div>
        </div>
        <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Budget Name</th>
              <th>Description</th>
              <th>Method</th>
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
                <td>{transaction.payment_method}</td>
                <td className="amount">
                  ₹{transaction.payment_method==="BC"?transaction.Bamount+transaction.Camount:transaction.amount}
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
        <div className="transactions-total">
          <span style={{"color":"red"}}>Total: </span> <span>{totalAmount}</span>
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
                <select name="payment_method" value={newTransaction.payment_method} onChange={handleChange}>
                  <option value="">Select Method</option>
                  <option value="Bank">Bank</option>
                  <option value="Cash">Cash</option>
                  <option value="BC">Bank + Cash</option>
                </select>
                {newTransaction.payment_method==="BC"?(<><label htmlFor="Bamount" className="TL">Bank</label><input type="text" name="Bamount" placeholder="Amount or Expression like 2+3" value={newTransaction.Bamount} onChange={handleChange} onBlur={handleBlur}></input><label htmlFor="Camount" className="TL">Cash</label><input type="text" name="Camount" placeholder="Amount or Expression like 2+3" value={newTransaction.Camount} onChange={handleChange} onBlur={handleBlur}></input></>):(<input type="text" name="amount" placeholder="Amount or Expression like 2+3" value={newTransaction.amount} onChange={handleChange} onBlur={handleBlur}/>)}
                <input type="text" name="description" placeholder="Description" value={newTransaction.description} maxLength={25} onChange={handleChange} />
                <button type="submit">Add Transaction</button>
              </form>
            </div>
          </div>
        )}
      </main>
      <AlertDialog
        open={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onConfirm={exportToPDF}
        title="Download Transactions Report?"
        description="This will download the Transactions Report PDF. Do you want to continue?"
        cancelText="No"
        confirmText="Yes"
      />
    </div>
  );
};

export default Transactions;
