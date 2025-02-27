import React, { useState } from "react";
import Navbar from "./Navbar";
import "../Styles/Budgets.css";
import {useBudget} from "./Contexts/BudgetContext"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const Budgets = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {budgets, setBudgets} = useBudget()
  const [newBudget, setNewBudget] = useState({
    category: "Monthly",
    name: "",
    Budget: "",
    Spent: "",
  });

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleChange = (e) => {
    setNewBudget({ ...newBudget, [e.target.name]: e.target.value });
  };

  const addBudget = (e) => {
    e.preventDefault();
    if (!newBudget.name || !newBudget.Budget) {
      alert("Please fill all fields!");
      return;
    }
    setBudgets([...budgets, { ...newBudget, Budget: Number(newBudget.Budget), Spent: Number(newBudget.Spent) }]);
    setNewBudget({ category: "Monthly", name: "", Budget: "", Spent: "" }); 
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
                  {budgets
                    .filter((budget) => budget.category === category)
                    .map((budget, idx) => (
                      <tr key={idx}>
                        <td className="budget-name">{budget.name}</td>
                        <td className="budget-amount">₹{budget.Budget}</td>
                        <td className="budget-spent">₹{budget.Spent}</td>
                        <td className="budget-progress">
                          <CircularProgress
                            variant="determinate"
                            value={(budget.Spent / budget.Budget) * 100}
                            size={30}
                          />
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
              <form onSubmit={addBudget} className="add-budget-form">
                <select name="category" value={newBudget.category} onChange={handleChange}>
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Custom">Custom</option>
                </select>
                <input type="text" name="name" placeholder="Budget Name" value={newBudget.name} onChange={handleChange} />
                <input type="number" name="Budget" placeholder="Total Budget" value={newBudget.Budget} onChange={handleChange} />
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
