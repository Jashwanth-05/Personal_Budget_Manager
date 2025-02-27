const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true }, 
  budget: { type: Number, required: true }, 
  Spent: { type: Number, default: 0 },
});

module.exports = mongoose.model("Budget", BudgetSchema);
