const mongoose = require("mongoose");

const BudgetPresetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category:{type:String,required:true},        
  defaultAmount: { type: Number, required: true }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    presets: [BudgetPresetSchema]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
