// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // if Node v18-, else native in v18+

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "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";

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: req.body.messages
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server listening on http://localhost:3000");
});
