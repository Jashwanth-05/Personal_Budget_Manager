// Tools.js
const { DynamicStructuredTool } = require('@langchain/core/tools');
const { z } = require('zod');
const Transaction = require('../Models/Transaction'); // Ensure this path is correct

// Index recommendation (set up in Mongo): db.transactions.createIndex({ userId: 1, date: 1 })

const getTransactionsTool = new DynamicStructuredTool({
  name: 'get_raw_transaction_data',
  description:
    "Fetches a raw list of a user's transactions for the current month. Requires the user's ID.",
  schema: z.object({
    userId: z.string().min(1).describe('The ID of the user to get transactions for.'),
  }),
  func: async ({ userId }) => {
    console.log(`--- EXECUTING: getTransactionsTool for userId: ${userId} ---`);
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const transactions = await Transaction.find({
        userId,
        date: { $gte: startOfMonth, $lt: startOfNextMonth },
      })
        .select('date category description amount Bamount Camount')
        .sort({ date: 1 })
        .lean();

      // Normalize missing amounts to 0 to reduce LLM burden
      const normalized = transactions.map((t) => ({
        ...t,
        amount: Number(t.amount) || 0,
        Bamount: Number(t.Bamount) || 0,
        Camount: Number(t.Camount) || 0,
      }));

      console.log(`--- Found ${normalized.length} transactions ---`);

      // Explicit ok flag + payload envelope
      return JSON.stringify({ ok: true, transactions: normalized });
    } catch (error) {
      console.error('Error fetching transactions from database:', error);
      return JSON.stringify({ ok: false, error: 'Failed to fetch transaction data.' });
    }
  },
});

module.exports = {
  getTransactionsTool,
};
