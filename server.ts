import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Islam360" });
  });

  // Islam360 AI Search & Ask Mufti Endpoint
  app.post("/api/ask-islam", async (req, res) => {
    try {
      const { prompt, language = "ur-en" } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const ai = getGenAI();
      if (!ai) {
        // Fallback intelligent answer if Gemini API key is not yet set
        return res.json({
          answer: `Assalamu Alaikum wa Rahmatullah. Here are authentic Islamic references regarding "${prompt}":\n\n📖 **Quranic Guidance**: "Indeed, with hardship comes ease." (Surah Ash-Sharh 94:6) and "Call upon Me; I will respond to you." (Surah Ghafir 40:60).\n\n📜 **Prophetic Sunnah**: The Messenger of Allah (ﷺ) said: "The best among you are those who have the best manners and character." (Sahih al-Bukhari 6035).\n\n💡 *Note: To unlock live AI search with real-time scholar reasoning, please ensure your GEMINI_API_KEY is configured in Settings.*`,
          source: "offline-fallback",
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are Islam360 AI, an authentic Islamic search engine and scholarly knowledge assistant inspired by Islam360.
Your goal is to provide authentic, respectful, and well-grounded answers strictly based on the Holy Quran and authentic Hadith (Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah).
Format your answer clearly with Markdown:
1. Core Islamic Ruling / Wisdom.
2. Quranic Proof: Include the Arabic verse, Surah name, and Ayah number, followed by English and Urdu translation.
3. Hadith Proof: Include Hadith book, number, authenticity (Sahih/Hasan), and lesson.
4. Practical Summary / Du'a if applicable.
Always address the user with respect (Assalamu Alaikum) and write with clarity and elegance. Support both English and Urdu/Roman Urdu queries smoothly.`,
        },
      });

      return res.json({
        answer: response.text || "No response generated.",
        source: "gemini",
      });
    } catch (error: any) {
      console.error("AI Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to process Islamic query.",
      });
    }
  });

  // Vite middleware for development vs Static in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Islam360 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
