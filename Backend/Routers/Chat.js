// routes/chat.js
const express = require('express');
const { ChatOllama } = require('@langchain/ollama');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { createToolCallingAgent, AgentExecutor } = require('langchain/agents');

// Import your tool from the Tools.js file
const { getTransactionsTool } = require('./Tools.js');

const router = express.Router();

// --- 1. Initialize the Chat Model ---
const chatModel = new ChatOllama({
  baseUrl: 'http://localhost:11434',
  model: 'llama3.1', // ensure this model supports tool calling well
  temperature: 0.2,
  // Optional: maxRetries, request options, etc.
});

// --- 2. Create the list of available tools ---
const tools = [getTransactionsTool];

// --- 3. Create the Detailed Agent Prompt ---
// Expose userId explicitly so the model can pass it to the tool call args.
// Keep legacy AgentExecutor’s agent_scratchpad placeholder.
const agentPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are an expert financial analyst. All monetary values are in Indian Rupees (₹).

Process:
1) Always call the 'get_raw_transaction_data' tool with the exact userId provided below.
2) The tool returns a JSON string; strictly parse it as JSON.
3) Compute:
   - total expenses = sum of (amount + Bamount + Camount) across all transactions (treat missing as 0).
   - top spending categories by total amount.
4) Output 2–3 friendly sentences in plain text. Do not show JSON or code. Use ₹ prefix and Indian digit grouping (e.g., ₹1,23,456).

User ID: {userId}`,
  ],
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
]);

// --- 4. Create Agent and Executor ---
const agent = createToolCallingAgent({
  llm: chatModel,
  tools,
  prompt: agentPrompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true,
});

// --- 5. Define the API Endpoint ---
router.post('/chat', async (req, res) => {
  const { input, userId } = req.body;

  if (typeof input !== 'string' || !input.trim() || typeof userId !== 'string' || !userId.trim()) {
    return res.status(400).json({ error: 'Input text and userId are required' });
  }

  // Optional: simple timeout guard for long-running LLM calls
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 60_000); // 60s

  try {
    // Provide both prompt variables so the tool can be called with userId
    const result = await agentExecutor.invoke(
      { input, userId },
      { signal: abortController.signal }
    );

    clearTimeout(timeout);
    return res.json({ response: result.output });
  } catch (error) {
    clearTimeout(timeout);
    console.error('Error processing agent request:', error);
    // 502 to indicate upstream dependency failure is often useful
    return res.status(502).json({ error: 'Upstream AI agent failed.' });
  }
});

module.exports = router;
