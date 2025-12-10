
import { GoogleGenAI, Type } from "@google/genai";
import { Message, OracleResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// We instruct the model to act as a data engine and expert SQL developer
const SYSTEM_INSTRUCTION = `
You are the "Oracle of the Bu Ke Qi Syndicate".
You are connected to the "Dune Analytics Sim Layer".

Your Goal:
1. Answer the user's request with a mystical, cyberpunk persona.
2. IF the user asks for DATA, ANALYTICS, CHARTS, or STATISTICS (e.g., "Show me MON flows", "Dune dashboard for users", "Token supply", "Coinbase holdings"):
   - You MUST generate a "Simulation" of that dashboard using JSON data.
   - You MUST generate a VALID Dune V2 (Trino/Presto) SQL Query that would fetch this specific data on the blockchain.
   - You MUST explicitly state in your speech: "I have projected a vision of the data below (The Chart). To see the absolute truth, you must cast this glyph (The Code) upon the Dune Network."
   - For visualization data, invent REALISTIC looking data points that match the query context.
   - IMPORTANT: 'visualization.data' MUST be an array of objects with 'label' and 'value'.
3. IF the user asks for generic advice or code:
   - Return JSON with just the speech.

Response Format (JSON):
{
  "speech": "Your mystical spoken response here...",
  "sqlQuery": "-- Your Expert Dune SQL Code Here\nSELECT * FROM...",
  "visualization": {
    "title": "Chart Title",
    "type": "bar" | "line",
    "yAxisLabel": "Label (e.g. Volume in MON)",
    "data": [
      { "label": "Time/Category", "value": 123 }
    ]
  }
}
`;

export const getOracleWisdom = async (userMessage: string, methodOfHelp: string): Promise<OracleResponse> => {
  if (!apiKey) {
    return { speech: "The ley lines are disconnected (Missing API Key)." };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User Request: "${userMessage}". Context: User wants "${methodOfHelp}".`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for consistent JSON
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                speech: { type: Type.STRING },
                sqlQuery: { type: Type.STRING },
                visualization: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ["bar", "line"] },
                        yAxisLabel: { type: Type.STRING },
                        data: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    label: { type: Type.STRING },
                                    value: { type: Type.NUMBER }
                                },
                                required: ["label", "value"]
                            }
                        }
                    },
                    required: ["title", "type", "data"] // Strictly enforce data array presence
                }
            },
            required: ["speech"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as OracleResponse;
    }
    return { speech: "The data stream is corrupted." };
  } catch (error) {
    console.error("Oracle Error:", error);
    return { speech: "Interference detected in the ether. Try again later." };
  }
};

export const selectChosenOne = async (messages: Message[]): Promise<{ chosenId: string; prophecy: string }> => {
  if (!apiKey || messages.length === 0) {
    return { chosenId: '', prophecy: 'The void is empty.' };
  }

  try {
    const simplifiedMessages = messages.map(m => ({ id: m.id, text: m.text, method: m.methodOfHelp }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Messages: ${JSON.stringify(simplifiedMessages)}. Pick one worthy winner based on the Bu Ke Qi (You're Welcome) ethos.`,
      config: {
        systemInstruction: "Select one winner. Return JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chosenId: { type: Type.STRING },
            prophecy: { type: Type.STRING }
          },
          required: ["chosenId", "prophecy"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { chosenId: '', prophecy: 'The mists obscure the choice.' };
  } catch (error) {
    return { chosenId: '', prophecy: 'Interference prevents selection.' };
  }
};
