const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "HANSHIKA AI" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "कृपया अपना सवाल लिखें।"
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "सवाल 4000 अक्षरों से छोटा रखें।"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "सर्वर पर API key सेट नहीं है।"
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are HANSHIKA AI, a helpful assistant. Reply in the language used by the user."
        },
        {
          role: "user",
          content: message.trim()
        }
      ],
      max_tokens: 700
    });

    const replyText = response.choices?.[0]?.message?.content || "जवाब नहीं मिला।";
    res.json({ reply: replyText });
  } catch (error) {
    console.error("AI request failed:", error.message);
    res.status(500).json({
      error: "AI से जवाब नहीं मिल पाया। बाद में फिर कोशिश करें।"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("HANSHIKA AI server is running on port " + PORT);
});
