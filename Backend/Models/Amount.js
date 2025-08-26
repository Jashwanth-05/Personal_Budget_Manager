const mongoose = require("mongoose");

const AmountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  total:{type:Number,required:true}
});

module.exports = mongoose.model("Amount", AmountSchema);
