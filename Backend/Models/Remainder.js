const mongoose = require("mongoose");

const RemainderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  dueDate:{type: Date,required:true},
  isPaid:{type: Boolean,required:true}
});

module.exports = mongoose.model("Remainder",RemainderSchema);