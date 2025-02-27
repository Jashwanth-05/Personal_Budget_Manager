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
const Income = require("./Models/Income");


mdb.connect(process.env.MONGODB_URL).then(()=>{
    console.log("MDB Connection Successful")
}).catch((err)=>{
    console.log("MDB Connection Failed", err)
})

app.get("/budgets/all", async (req, res) => {
    try {
      const budgets = await Budget.find();
      res.json(budgets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

app.post("/budgets/add", async (req, res) => {
    const { category, name, budget, Spent } = req.body;
    try {
      const newBudget = new Budget ({ category, name, budget, Spent });
      await newBudget.save();
      res.status(201).json(newBudget);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get("/transactions/all", async (req, res) => {
    try {
      const transactions = await Transaction.find().populate("budgetId", "name category");
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/transactions/add", async (req, res) => {
    const { budgetId,name, amount, description } = req.body;
    try {
      const curBudget=await Budget.findById(budgetId);
      const newTransaction = new Transaction({ budgetId,budgetName:curBudget.name, amount, description });
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


  app.get("/incomes/all", async (req, res) => {
    try {
      const income = await Income.find();
      res.json(income);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/incomes/add", async (req, res) => {
    const { source, amount,date } = req.body;
    try {
      const newIncome = new Income({ source, amount,date });
      await newIncome.save();
      res.status(201).json(newIncome);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));