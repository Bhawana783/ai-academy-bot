const axios = require("axios");
const courseContext = require("../utils/courseContext");

async function getLLMResponse(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the AI Academy WhatsApp assistant. Use only the provided course context. If information is not in context, say you only support AI Academy course questions. Keep answers concise and practical. If user asks about enrollment, pricing, paid modules, or access, include the payment page URL.

Course context:
${courseContext}`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = { getLLMResponse };
