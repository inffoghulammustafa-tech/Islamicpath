import type { IncomingMessage, ServerResponse } from "http";
import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }

  // Parse body if not already parsed by Vercel
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { prompt } = body || {};
  if (!prompt || typeof prompt !== "string") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Prompt is required" }));
  }

  try {
    const ai = getGenAI();
    if (!ai) {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          answer: `Assalamu Alaikum wa Rahmatullah. Here are authentic Islamic references regarding "${prompt}":\n\n📖 **Quranic Guidance**: "Indeed, with hardship comes ease." (Surah Ash-Sharh 94:6) and "Call upon Me; I will respond to you." (Surah Ghafir 40:60).\n\n📜 **Prophetic Sunnah**: The Messenger of Allah (ﷺ) said: "The best among you are those who have the best manners and character." (Sahih al-Bukhari 6035).\n\n💡 *Note: To unlock live AI search with real-time scholar reasoning, please ensure your GEMINI_API_KEY is configured in Vercel Environment Variables.*`,
          source: "offline-fallback",
        })
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are IslamicPath AI, an authentic Islamic search engine and scholarly knowledge assistant.
Your goal is to provide authentic, respectful, and well-grounded answers strictly based on the Holy Quran and authentic Hadith (Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah).
Format your answer clearly with Markdown:
1. Core Islamic Ruling / Wisdom.
2. Quranic Proof: Include the Arabic verse, Surah name, and Ayah number, followed by English and Urdu translation.
3. Hadith Proof: Include Hadith book, number, authenticity (Sahih/Hasan), and lesson.
4. Practical Summary / Du'a if applicable.
Always address the user with respect (Assalamu Alaikum) and write with clarity and elegance. Support both English and Urdu/Roman Urdu queries smoothly.`,
      },
    });

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        answer: response.text || "No response generated.",
        source: "gemini",
      })
    );
  } catch (error: any) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    return res.end(
      JSON.stringify({
        error: error.message || "Failed to process Islamic query.",
      })
    );
  }
}
