const express= require('express')
const mdb=require('mongoose')
const dotenv=require('dotenv')
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const sendOTP = require("./gmailservice");
const cors=require('cors')
dotenv.config()
const app =express()
app.use(express.json())
app.use(cors())
const PORT = 5556
const Budget = require("./Models/Budget");
const Remainder =require("./Models/Remainder");
const Transaction = require("./Models/Transaction");
const jwt = require("jsonwebtoken");
const Income = require("./Models/Income");
const User = require("./Models/User");
const Tax =require("./Models/TaxSchema");

mdb.connect(process.env.MONGODB_URL).then(()=>{
    console.log("MDB Connection Successful")
}).catch((err)=>{
    console.log("MDB Connection Failed", err)
})

const otpStore = new Map();
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};
app.post("/budgets/all",verifyToken, async (req, res) => {
    const {userId}=req.body;
    try {
      const budgets = await Budget.find({userId:userId});
      res.json(budgets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

app.post("/budgets/add",verifyToken, async (req, res) => {
    const { userId,category, name, budget, Spent,valid } = req.body;
    try {
      const newBudget = new Budget ({userId,category, name, budget,savings:budget, Spent,valid,overflow:false});
      await newBudget.save();
      res.status(201).json(newBudget);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

app.put("/budgets/edit/:id",verifyToken,async (req,res)=>{
    try{
      const {overflow}=req.body;
      const UpdatedBudget=await Budget.findByIdAndUpdate(req.params.id,{$set:{overflow}}, 
        { new: true, runValidators: true });
      res.status(200).json({message:"Budget Updated Successfully",UpdatedBudget:UpdatedBudget})
    }catch(error){
      console.log("Error Updating Budget",error);
    }
})

  app.delete("/budgets/del/:id",verifyToken, async (req, res) => {
    try {
      await Budget.findByIdAndDelete(req.params.id);
      res.json({ message: "Budget deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/remainders/all",verifyToken, async (req, res) => {
    const {userId}=req.body;
    try {
      const remainders = await Remainder.find({userId:userId});
      res.json(remainders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/remainders/add",verifyToken, async (req, res) => {
    const { userId,title,dueDate,isPaid } = req.body;
    try {
      const newRemainder = new Remainder ({userId,title,dueDate,isPaid:false});
      await newRemainder.save();
      res.status(201).json(newRemainder);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.put("/remainders/edit/:id",verifyToken,async (req,res)=>{
    try{
      const {isPaid}=req.body;
      const UpdatedRemainder=await Remainder.findByIdAndUpdate(req.params.id,{$set:{isPaid}}, 
        { new: true, runValidators: true });
      res.status(200).json({message:"Remainder Updated Successfully",UpdatedRemainder:UpdatedRemainder})
    }catch(error){
      console.log("Error Updating Remainder",error);
    }
})

  app.delete("/remainders/del/:id",verifyToken, async (req, res) => {
    try {
      await Remainder.findByIdAndDelete(req.params.id);
      res.json({ message: "Remainder deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/transactions/all",verifyToken, async (req, res) => {
    const {userId}=req.body;
    try {
      const transactions = await Transaction.find({userId:userId}).populate("budgetId", "name category");
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/transactions/add",verifyToken, async (req, res) => {
    const { userId,budgetId,name,Camount,Bamount, amount,payment_method, description,date } = req.body;
    try {
      const curBudget=await Budget.findById(budgetId);
      const newTransaction = new Transaction({ userId,budgetId,budgetName:curBudget.name,Camount,Bamount, amount,payment_method, description,date});
      await newTransaction.save();
      const famount=amount+Bamount+Camount;
      const updatedSavings = Math.abs(curBudget.savings - famount);

      await Budget.findByIdAndUpdate(budgetId, { 
        $inc: { Spent: famount },
        $set: { savings: updatedSavings }
      });
      
      const curTransaction={...newTransaction._doc,}
      console.log(curTransaction)
      res.status(201).json(curTransaction);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/transactions/del/:id",verifyToken, async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) return res.status(404).json({ message: "Transaction not found" });
  
      await Budget.findByIdAndUpdate(transaction.budgetId, { $inc: { Spent: -transaction.amount } });
  
      await transaction.deleteOne();
      res.json({ message: "Transaction deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  


  app.post("/incomes/all",verifyToken, async (req, res) => {
    const {userId}=req.body;
    try {
      const income = await Income.find({userId:userId});
      res.json(income);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/incomes/add",verifyToken, async (req, res) => {
    const { userId,source,payment_method, amount,date } = req.body;
    try {
      const newIncome = new Income({ userId,source, amount,date,payment_method });
      await newIncome.save();
      res.status(201).json(newIncome);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/incomes/del/:id",verifyToken, async (req, res) => {
    try {
      await Income.findByIdAndDelete(req.params.id);
      res.json({ message: "Income entry deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/tax/add",verifyToken, async (req, res) => {
    const {userId,category,price,description,taxRate,taxAmount,basePrice}=req.body;
    try {
      const newEntry = new Tax({userId,category,price,description,taxRate,taxAmount,basePrice});
      await newEntry.save();
      res.status(201).json(newEntry);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/tax/all/:id",verifyToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const calculations = await Tax.find({ userId });
      res.status(200).json(calculations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  app.delete("/tax/del/:id",verifyToken, async (req, res) => {
    try {
      await Tax.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/signup", async (req, res) => {
  try {
      const { FirstName,LastName, email, password } = req.body;
      const name=FirstName+LastName

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      newuser = new User({name, email, password: hashedPassword });
      await newuser.save();
      const token = jwt.sign({ id: newuser._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
      res.status(201).json({ message: "User registered successfully",token,user: { id: newuser._id, name: newuser.name, email: newuser.email } });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
  });

  app.put("/updateProfilePicture", verifyToken, async (req, res) => {
    try {
      const { profileImage } = req.body;
      const userId = req.user?.id; 
      if (!profileImage) {
        return res.status(400).json({ message: "Profile image URL is required" });
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { profileImage } }, 
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "Profile picture updated successfully",
        profileImage: updatedUser.profileImage,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        console.log(user)
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email,profileImage:user.profileImage } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  app.put("/updatepass",async (req,res)=>{
    try{
      const{email,password}=req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: {password: hashedPassword } }, 
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "Password updated successfully"
      });
    }catch(err){
      console.error("Error updating Password:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  })
  app.post("/verify",verifyToken,(req,res)=>{
      res.status(200).json({"message":"TokenVerified"})
  });

  app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
  
    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  
    const sent = await sendOTP(email, otp);
    if (sent) {
      res.json({ message: "OTP sent successfully" });
    } else {
      res.status(500).json({ message: "Error sending OTP" });
    }
  });
  
  app.get("/test",(req,res)=>{
    res.json({message:"API working"})
  })

  app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    const storedOTP = otpStore.get(email);
  
    if (!storedOTP || storedOTP.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  
    otpStore.delete(email);
    res.json({ message: "OTP verified successfully!" });
  });
  


  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));