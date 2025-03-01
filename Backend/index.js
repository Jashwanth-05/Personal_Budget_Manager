const express= require('express')
const mdb=require('mongoose')
const dotenv=require('dotenv')
const bcrypt = require('bcrypt');
const cors=require('cors')
dotenv.config()
const app =express()
app.use(express.json())
app.use(cors())
const PORT = 5556
const Budget = require("./Models/Budget");
const Transaction = require("./Models/Transaction");
const jwt = require("jsonwebtoken");
const Income = require("./Models/Income");
const User = require("./Models/User");


mdb.connect(process.env.MONGODB_URL).then(()=>{
    console.log("MDB Connection Successful")
}).catch((err)=>{
    console.log("MDB Connection Failed", err)
})
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token after "Bearer"
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
    const { userId,category, name, budget, Spent } = req.body;
    try {
      const newBudget = new Budget ({userId,category, name, budget, Spent });
      await newBudget.save();
      res.status(201).json(newBudget);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/budgets/del/:id", async (req, res) => {
    try {
      await Budget.findByIdAndDelete(req.params.id);
      res.json({ message: "Budget deleted successfully" });
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
    const { userId,budgetId,name, amount, description } = req.body;
    try {
      const curBudget=await Budget.findById(budgetId);
      const newTransaction = new Transaction({ userId,budgetId,budgetName:curBudget.name, amount, description });
      await newTransaction.save();
  
      // Update budget's spent amount
      await Budget.findByIdAndUpdate(budgetId, { $inc: { Spent: amount } });
      
      console.log(curBudget)
      const curTransaction={...newTransaction._doc,}
      console.log(curTransaction)
      res.status(201).json(curTransaction);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/transactions/del/:id", async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) return res.status(404).json({ message: "Transaction not found" });
  
      // Reduce spent amount from the budget
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
    const { userId,source, amount,date } = req.body;
    try {
      const newIncome = new Income({ userId,source, amount,date });
      await newIncome.save();
      res.status(201).json(newIncome);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete("/incomes/del/:id", async (req, res) => {
    try {
      await Income.findByIdAndDelete(req.params.id);
      res.json({ message: "Income entry deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Signup Route
  app.post("/signup", async (req, res) => {
  try {
      const { FirstName,LastName, email, password } = req.body;
      const name=FirstName+LastName
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      // Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create User
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

        // Find User
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        console.log(user)
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email,profileImage:user.profileImage } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

  app.post("/verify",verifyToken,(req,res)=>{
      res.status(200).json({"message":"TokenVerified"})
  });


  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));