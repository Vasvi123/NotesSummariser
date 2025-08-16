const express = require("express");
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-r1-0528:free";

// Generate summary endpoint
router.post("/generate", async (req, res) => {
  try {
    const { transcript, customPrompt } = req.body;

    if (!transcript?.trim()) {
      return res.status(400).json({ error: "Transcript is required" });
    }
    if (!customPrompt?.trim()) {
      return res.status(400).json({ error: "Custom prompt is required" });
    }
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OpenRouter API key not configured" });
    }

    const systemPrompt = `You are an expert meeting summarizer. Follow the user's custom requirement: ${customPrompt}`;
    const userMessage = `Summarize the following transcript:\n\n${transcript}`;

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000", // optional
        "X-Title": process.env.SITE_NAME || "Meeting Summarizer", // optional
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter API Error:", data.error);
      return res.status(500).json({ error: data.error.message || "OpenRouter API failed" });
    }

    const summary = data.choices?.[0]?.message?.content || "No summary generated";

    res.json({
      success: true,
      summary,
      originalTranscript: transcript,
      customPrompt,
      model: OPENROUTER_MODEL,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to generate summary", message: err.message });
  }
});

module.exports = router;

