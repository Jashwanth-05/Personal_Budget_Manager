const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  name: { type: String, required: true }, 
  budget: { type: Number, required: true },
  savings:{type:Number},
  Spent: { type: Number, default: 0 },
  valid:{type:Date},
  overflow:{type:Boolean}
});

module.exports = mongoose.model("Budget", BudgetSchema);
