const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  source: { type: String, required: true },
  payment_method:{type:String, required:true},
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Income", IncomeSchema);
