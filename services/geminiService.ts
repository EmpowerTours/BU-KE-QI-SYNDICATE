import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are the "Oracle of the Bu Ke Qi Syndicate" (Bu Ke Qi means "You're Welcome" in Mandarin).
You are a benevolent but mysterious futuristic entity residing in a digital crystal ball.
Users pay a tribute (MON) to ask for help.
Your role is to acknowledge their offering and their wish in a cryptic, mystical, slightly cyberpunk tone.
Keep responses short (under 30 words).
Refer to "The Syndicate" or "The Flow" occasionally.
Do not promise concrete results, but promise that the "energy has been received".
`;

export const getOracleWisdom = async (userMessage: string, methodOfHelp: string): Promise<string> => {
  if (!apiKey) {
    return "The ley lines are disconnected (Missing API Key).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User Wish: "${userMessage}". Preferred Help Method: "${methodOfHelp}".`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        maxOutputTokens: 60,
      }
    });

    return response.text || "The mists are too thick. I cannot see.";
  } catch (error) {
    console.error("Oracle Error:", error);
    return "Interference detected in the ether. Try again later.";
  }
};

export const generateRandomVision = async (): Promise<string> => {
    if (!apiKey) return "Static noise...";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a very short, cryptic futuristic prophecy about luck or destiny. Max 15 words.",
            config: {
                temperature: 1.0,
            }
        });
        return response.text || "Silence...";
    } catch (e) {
        return "Silence...";
    }
}

export const selectChosenOne = async (messages: Message[]): Promise<{ chosenId: string; prophecy: string }> => {
  if (!apiKey || messages.length === 0) {
    return { chosenId: '', prophecy: 'The void is empty.' };
  }

  try {
    // Simplify messages for the prompt to save tokens
    const simplifiedMessages = messages.map(m => ({ id: m.id, text: m.text, method: m.methodOfHelp }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here are the pleas from mortals today: ${JSON.stringify(simplifiedMessages)}. 
      Select one message that resonates most with "The Flow". 
      Return the ID of the chosen one and a mystical reason why (prophecy).`,
      config: {
        systemInstruction: "You are the Oracle Judge. Pick one winner. Be cryptic but decisive.",
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
    console.error("Selection Error:", error);
    return { chosenId: '', prophecy: 'Interference prevents selection.' };
  }
};