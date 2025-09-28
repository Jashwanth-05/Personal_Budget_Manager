import React, { useState } from "react";
import Navbar from "./Navbar";
import "../Styles/Budgets.css";
import { useBudget } from "./Contexts/BudgetContext";
import { CircularProgress, IconButton } from "@mui/material";
import CircularProgressWithLabel from "./CircularProgressWithLabel"
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from "@mui/icons-material/Close";
import AlertDialog from "./AlertDialog";

const Budgets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addBudget, budgets, delBudget,createFromPresets } = useBudget();
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: "Monthly",
    name: "",
    budget: "",
    Spent: "",
    valid: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setNewBudget({ ...newBudget, [e.target.name]: e.target.value });
  };

  const handlebudgetadd = (e) => {
    e.preventDefault();
    if (
      !newBudget.name ||
      !newBudget.budget ||
      (newBudget.category === "Custom" && !newBudget.valid)
    ) {
      alert("Please fill all fields!");
      return;
    }

    let date = new Date();

   if (newBudget.category === "Monthly") {
      // Last date of current month at 23:59:59.999
      date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      date.setHours(23, 59, 59, 999);
    } else if (newBudget.category === "Weekly") {
      // Last Sunday at 23:59:59.999
      const day = date.getDay(); // 0 = Sunday
      const diff = (7 - day) % 7;
      date.setDate(date.getDate() + diff);
      date.setHours(23, 59, 59, 999);
    } else {
      // Custom
      date = new Date(newBudget.valid);
      date.setHours(23, 59, 59, 999);
    }

    addBudget({
      userId: user.id,
      category: newBudget.category,
      name: newBudget.name,
      budget: newBudget.budget,
      Spent: 0,
      valid: date,
    });

    setNewBudget({ category: "Monthly", name: "", budget: "", Spent: "", valid: "" });
    setIsModalOpen(false);
  };

  const handleCreateFromPresets = () => {
  let date = new Date();
  date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  date.setHours(23, 59, 59, 999);

  createFromPresets({
    userId: user.id,
    valid: date,
  });
  };

  return (
    <div>
      <Navbar />
      <main className="budgets-main">
        <div className="budgets-header">
          <h2 className="budgets-title">Budgets</h2>
          <div className="budgets-options">
          <button className="sf-button" onClick={() => setIsPresetDialogOpen(true)}>Budgets Preset</button>
          <AddIcon className="add-icon" onClick={() => setIsModalOpen(true)} />
          </div>
        </div>

        {/* Display 3 categories side by side */}
        <div className="budgets-categories">
          {["Monthly", "Weekly", "Custom"].map((category, index) => (
            <div key={index} className="budget-category-column">
              <h3 className="budgets-subtitle-inline">{category}</h3>
              <div className="budget-list">
                {budgets.filter((budget) => budget.category === category).length === 0 ? (
                  <p className="no-budgets">No {category} budgets added yet.</p>
                ) : (
                  budgets
                    .filter((budget) => budget.category === category)
                    .map((budget, idx) => (
                      <div key={idx} className="budget-item">
                        <div className="budget-info">
                          <p className="budget-name">{budget.name}</p>
                          <p className="budget-amount">Budget: ₹{budget.budget}</p>
                          <p className="budget-spent">Spent: ₹{budget.Spent}</p>
                          <p className={!budget.overflow ? "budget-savings" : "budget-over"}>
                            Savings: ₹{Math.abs(budget.savings)}
                          </p>
                        </div>
                        <div className="budget-controls">
                          <CircularProgressWithLabel
                            variant="determinate"
                            value={budget.overflow ? 100 : (budget.Spent / budget.budget) * 100}
                            size={40}
                            className="budget-progress"
                          />
                          <div className="budget-operation-bts">
                            <IconButton color="error" onClick={() => delBudget(budget._id)}>
                            <DeleteIcon/>
                          </IconButton>
                          <IconButton>
                            <AddBoxIcon style={{"color":"#fd7e14"}}/>
                          </IconButton>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ADD BUDGET MODAL */}
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
                <input
                  type="text"
                  name="name"
                  placeholder="Budget Name"
                  value={newBudget.name}
                  onChange={handleChange}
                />
                {newBudget.category === "Custom" && (
                  <input
                    type="date"
                    name="valid"
                    placeholder="Validity"
                    value={newBudget.valid}
                    onChange={handleChange}
                  />
                )}
                <input
                  type="number"
                  name="budget"
                  placeholder="Total Budget"
                  value={newBudget.budget}
                  onChange={handleChange}
                />
                <button type="submit">Add Budget</button>
              </form>
            </div>
          </div>
        )}
        <AlertDialog
          open={isPresetDialogOpen}
          onClose={() => setIsPresetDialogOpen(false)}
          onConfirm={handleCreateFromPresets}
          title="Create Budgets from Presets?"
          description="This will create new budgets from your saved presets. Do you want to continue?"
          cancelText="No, Cancel"
          confirmText="Yes, Create"
        />
      </main>
    </div>
  );
};

export default Budgets;
