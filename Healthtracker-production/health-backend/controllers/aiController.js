const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.checkHealth = async (req, res) => {
  try {
    const { bp, sugar, heartRate, symptoms } = req.body;

    if (!bp || !sugar || !heartRate) {
      return res.status(400).json({ result: "Please provide BP, sugar, and heart rate." });
    }

    const prompt = `You are a helpful medical assistant AI. Analyze this patient data and respond in a clear, structured way.

Patient Data:
- Blood Pressure: ${bp} mmHg
- Blood Sugar: ${sugar} mg/dL
- Heart Rate: ${heartRate} bpm
- Symptoms: ${symptoms || "None reported"}

Please provide:
1. **Status** – Are these readings normal, concerning, or dangerous?
2. **Analysis** – Brief explanation of what each reading means.
3. **Advice** – Lifestyle or dietary recommendations.
4. **Suggested Medicines** – Over-the-counter options if appropriate (note: always consult a doctor before taking any medicine).
5. **When to See a Doctor** – Clear guidance on urgency.

Keep the response concise, friendly, and easy to understand.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate and knowledgeable medical assistant. Always remind users to consult a qualified doctor for serious concerns. Never diagnose definitively.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 800,
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      return res.status(500).json({ result: "AI returned an empty response. Please try again." });
    }

    res.json({ result });
  } catch (err) {
    console.error("AI ERROR:", err.message);

    if (err.status === 401) {
      return res.status(500).json({ result: "AI service authentication failed. Please contact support." });
    }
    if (err.status === 429) {
      return res.status(429).json({ result: "AI service is currently rate limited. Please try again in a moment." });
    }

    res.status(500).json({ result: "AI analysis temporarily unavailable. Please try again later." });
  }
};
