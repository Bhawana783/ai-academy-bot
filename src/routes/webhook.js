const express = require("express");
const router = express.Router();
const { getLLMResponse } = require("../services/llmService");
const axios = require("axios");

const activeUsers = new Set();

function readIncomingMessage(body) {
  const directText = body?.message?.text;
  const directFrom = body?.from;
  if (directText && directFrom) {
    return { text: directText, from: directFrom };
  }

  const msg = Array.isArray(body?.messages) ? body.messages[0] : null;
  const text = msg?.text?.body || msg?.text || body?.text?.body || body?.text;
  const from = msg?.from || body?.from || body?.chat_id;

  if (!text || !from) {
    return null;
  }

  return { text: String(text).trim(), from: String(from).trim() };
}

async function sendWhapiText(to, body) {
  const token = process.env.WHAPI_TOKEN;
  if (!token) {
    throw new Error("Missing WHAPI_TOKEN");
  }

  await axios.post(
    "https://gate.whapi.cloud/messages/text",
    { to, body },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
}

router.post("/", async (req, res) => {
  const incoming = readIncomingMessage(req.body);
  if (!incoming) {
    return res.sendStatus(200);
  }

  const message = incoming.text;
  const from = incoming.from;
  const normalizedMessage = message.trim();
  const lowerMessage = normalizedMessage.toLowerCase();

  let reply;

  if (lowerMessage === "stop") {
    activeUsers.delete(from);
    reply = "You are unsubscribed from this bot. Send AI-Academy anytime to start again.";
  } else if (normalizedMessage === "AI-Academy") {
    activeUsers.add(from);
    reply = "Thank you for reaching out to the AI Academy! How can I help you today?";
  } else if (!activeUsers.has(from)) {
    reply = "Please send AI-Academy to start the conversation.";
  } else {
    try {
      reply = await getLLMResponse(message);
    } catch (e) {
      reply = "Sorry, I could not generate a response right now. Please try again.";
    }
  }

  try {
    await sendWhapiText(from, `${reply}\n\nType STOP to stop messages.`);
  } catch (e) {
    console.error("Failed to send Whapi message:", e.message);
  }

  res.sendStatus(200);
});

module.exports = router;
