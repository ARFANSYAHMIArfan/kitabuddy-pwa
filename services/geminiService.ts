
import { Language, StoryData } from '../types';

// AI Features are currently disabled for deployment without API Key
// Returns placeholder data or errors safely

export const chatWithBuddy = async (history: any[], message: string, language: Language = 'ms') => {
  return "Sistem AI sedang dalam penyelenggaraan. Sila cuba lagi nanti.";
};

export const generateStory = async (topic: string, language: Language): Promise<StoryData> => {
  throw new Error("AI Features Disabled");
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  return "";
};

export const generateSpeech = async (text: string): Promise<string> => {
  return "";
};

export const analyzeImage = async (base64Data: string, mimeType: string, language: Language): Promise<string> => {
  return "AI Features Disabled";
};
