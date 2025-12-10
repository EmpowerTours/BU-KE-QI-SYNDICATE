import { GoogleGenAI } from "@google/genai";

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
