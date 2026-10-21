import { GoogleGenAI } from "@google/genai";
import { BOOK_CONTEXT_SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    // Convert internal history format to Gemini API format if needed, 
    // but for simple generation we can concatenate or use chat session.
    // Here we will use a fresh generation for stateless simplicity or maintain a chat session object in a real app.
    // For this implementation, we will pass the history as context in the prompt to ensure the "Coach" persona stays consistent.

    const conversationHistory = history.map(msg => `${msg.role === 'user' ? 'Usuario' : 'Coach Allen'}: ${msg.text}`).join('\n');
    
    const prompt = `
      ${BOOK_CONTEXT_SYSTEM_PROMPT}
      
      Historial de la conversación:
      ${conversationHistory}
      
      Usuario: ${newMessage}
      Coach Allen:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "Lo siento, tuve un problema al procesar tu respuesta. Inténtalo de nuevo.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Hubo un error al conectar con el servicio. Por favor, verifica tu conexión o intenta más tarde.";
  }
};