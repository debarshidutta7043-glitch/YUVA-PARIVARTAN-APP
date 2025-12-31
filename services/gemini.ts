
import { GoogleGenAI, Type } from "@google/genai";

// Always use the specified initialization format with named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProfessionalBio = async (name: string, dept: string, skills: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional, crisp LinkedIn-style bio for a student named ${name} in the ${dept} department. They have the following skills: ${skills.join(', ')}. Keep it under 60 words.`,
      config: {
        temperature: 0.7,
      }
    });
    // Access the .text property directly instead of calling a text() method.
    return response.text || "Passionate student dedicated to professional growth.";
  } catch (error) {
    console.error("Gemini Bio Generation Error:", error);
    return "Enthusiastic learner focusing on excellence in my field.";
  }
};

export const suggestSkills = async (dept: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List 5 high-demand professional skills for a student studying ${dept} at a vocational training school. Respond in a simple comma-separated list.`,
      config: {
        temperature: 0.5,
      }
    });
    // Access the .text property directly instead of calling a text() method.
    return (response.text || "").split(',').map(s => s.trim());
  } catch (error) {
    console.error("Gemini Skill Suggestion Error:", error);
    return [];
  }
};
