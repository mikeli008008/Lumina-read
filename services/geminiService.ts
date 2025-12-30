import { GoogleGenAI, Type } from "@google/genai";
import { AI_MODEL_TEXT } from '../constants';
import { BookSummary } from '../types';

let ai: GoogleGenAI | null = null;

// Initialize the API client securely
const getAiClient = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing from environment variables.");
      throw new Error("API Key not found");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const fetchBookSummary = async (title: string, author: string, language: string = 'English'): Promise<BookSummary> => {
  const client = getAiClient();

  const prompt = `
    You are a world-class literary critic and educator. 
    Create a compelling, insightful 5-minute reading summary for the book "${title}" by ${author}.
    The summary should capture the essence of the book, its most powerful ideas, and why it matters.
    
    IMPORTANT: The output must be written entirely in the ${language} language.
    
    Structure the response strictly according to the requested JSON schema.
    - Intro: A hook that explains what the book is about and its context.
    - Key Insights: 3-5 distinct, powerful takeaways from the book.
    - Notable Quotes: 2-3 verbatim quotes that define the work (translated if necessary for comprehension, or original with translation).
    - Conclusion: A final thought on how to apply this wisdom today.
  `;

  try {
    const response = await client.models.generateContent({
      model: AI_MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intro: { type: Type.STRING, description: "A comprehensive introduction paragraph." },
            keyInsights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of main takeaways."
            },
            notableQuotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Famous quotes from the book."
            },
            conclusion: { type: Type.STRING, description: "A summarizing conclusion paragraph." },
            readingTimeMinutes: { type: Type.NUMBER, description: "Estimated reading time, usually 5." }
          },
          required: ["intro", "keyInsights", "notableQuotes", "conclusion"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    
    return JSON.parse(text) as BookSummary;

  } catch (error) {
    console.error("Error fetching book summary:", error);
    // Fallback for demo purposes if API fails or quota exceeded
    throw error;
  }
};
