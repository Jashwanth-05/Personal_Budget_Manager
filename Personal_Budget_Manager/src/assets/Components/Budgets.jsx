import React, { useState } from "react";
import Navbar from "./Navbar";
import "../Styles/Budgets.css";
import {useBudget} from "./Contexts/BudgetContext"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { List, ListItem, ListItemText, IconButton, Typography, CircularProgress } from "@mui/material";
import { format, isWithinInterval, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const Budgets = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {addBudget,budgets, delBudget,setBudgets} = useBudget()
  const [newBudget, setNewBudget] = useState({
    category: "Monthly",
    name: "",
    budget: "",
    Spent: "",
    valid:"",
  });
  const user=JSON.parse(localStorage.getItem("user"))
  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleChange = (e) => {
    setNewBudget({ ...newBudget, [e.target.name]: e.target.value });
  };

  const handlebudgetadd = (e) => {
    e.preventDefault();
    if (!newBudget.name || !newBudget.budget || (newBudget.category==="Custom" && !newBudget.valid)) {
      alert("Please fill all fields!");
      return;
    }

    let date=new Date();
    if(newBudget.category==="Monthly"){
      date=endOfMonth(date);
    }else if(newBudget.category==="Weekly"){
      date=endOfWeek(date);
    }else{
      date=new Date(newBudget.valid);
    }
    addBudget({
      userId:user.id,
      category:newBudget.category,
      name:newBudget.name,
      budget:newBudget.budget,
      Spent:0,
      valid:date
    });
    setNewBudget({ category: "Monthly", name: "", budget: "", Spent: "",valid:""}); 
    setIsModalOpen(false); 
  };

  return (
    <div>
      <Navbar />
      <main className="budgets-main">
        <div className="budgets-header">
          <h2 className="budgets-title">Budgets</h2>
          <AddIcon className="add-icon" onClick={() => setIsModalOpen(true)} />
        </div>

        {["Monthly", "Weekly", "Custom"].map((category, index) => (
          <div key={index} className="budget-category">
            <div className="budgets-subtitle" onClick={() => toggleCategory(category)}>
              <h3>{category}</h3>
              {openCategory === category ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </div>

            {openCategory === category && (
            <div className="budget-content">
              <table className="budget-table">
                <tbody>
                  {budgets.filter((budget) => {
                      return budget.category === category;
                    })
                    .map((budget, idx) => (
                      <tr key={idx}>
                        <td className="budget-name">{budget.name}</td>
                        <td className="budget-amount">₹{budget.budget}</td>
                        <td className="budget-spent">₹{budget.Spent}</td>
                        <td className="budget-progress">
                          <CircularProgress
                            variant="determinate"
                            value={(budget.Spent / budget.budget) * 100}
                            size={30}
                          />
                        </td>
                        <td>
                        <IconButton edge="end" color="error" onClick={() => delBudget(budget._id)}>
                        <DeleteIcon />
                        </IconButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          </div>
        ))}

    
        {isModalOpen && (
          <div className="overlay">
            <div className="modal">
              <CloseIcon className="close-icon" onClick={() => setIsModalOpen(false)} />
              <h3>Add New Budget</h3>
              <form onSubmit={handlebudgetadd} className="add-budget-form">
                <select name="category" value={newBudget.category} onChange={handleChange}>
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Custom">Custom</option>
                </select>
                <input type="text" name="name" placeholder="Budget Name" value={newBudget.name} onChange={handleChange} />
                {newBudget.category==="Custom" && <input type="date" name="valid" placeholder="Validity" value={newBudget.valid} onChange={handleChange} />}
                <input type="number" name="budget" placeholder="Total Budget" value={newBudget.Budget} onChange={handleChange} />
                
                <button type="submit">Add Budget</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Budgets;
