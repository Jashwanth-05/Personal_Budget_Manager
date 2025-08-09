const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: "Budget", required: true },
  budgetName:{type:String,required:true},
  amount: { type: Number, required: true },
  payment_method:{type:String, required:true},
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
