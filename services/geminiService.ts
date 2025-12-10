
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Language, StoryData } from '../types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Chat with Budi (Anti-Bullying Companion)
export const chatWithBuddy = async (history: {role: string, parts: {text: string}[]}[], message: string, language: Language = 'ms') => {
  const ai = getAI();
  
  const systemPrompt = `
    Anda adalah "Budi", ikon kepada aplikasi KitaBuddy. 
    Peranan anda adalah rakan siber yang mesra, empati, dan membantu kanak-kanak sekolah menangani isu buli.
    
    Panduan Gaya:
    - Gunakan Bahasa Melayu yang standard tetapi mesra dan mudah difahami oleh pelajar sekolah rendah dan menengah.
    - Sentiasa beri nasihat yang selamat. Jika keadaan berbahaya, nasihatkan mereka memberitahu guru atau ibu bapa.
    - Gunakan emoji yang sesuai untuk nampak ceria dan menyokong.
    - Jangan terlalu formal seperti robot. Jadilah seperti abang atau kakak yang mengambil berat.
    
    Topik utama anda: Pencegahan buli, keselamatan mental, dan persahabatan yang sihat.
  `;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: systemPrompt,
    }
  });

  try {
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

export const generateStory = async (topic: string, language: Language): Promise<StoryData> => {
  const ai = getAI();
  const prompt = language === 'ms' 
    ? `Tulis cerita kanak-kanak pendek tentang "${topic}". Sertakan tajuk, kandungan cerita, pengajaran (moral), dan prompt visual (dalam Bahasa Inggeris) untuk menjana gambar ilustrasi.`
    : `Write a short children's story about "${topic}". Include title, content, moral, and a visual prompt (in English) to generate an illustration.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          moral: { type: Type.STRING },
          visualPrompt: { type: Type.STRING },
        },
        required: ['title', 'content', 'moral', 'visualPrompt'],
      }
    }
  });

  if (!response.text) throw new Error("No story generated");
  return JSON.parse(response.text) as StoryData;
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt + ", children's book illustration style, colorful, friendly",
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '16:9',
    }
  });
  
  const base64 = response.generatedImages?.[0]?.image?.imageBytes;
  if (!base64) throw new Error("No image generated");
  return `data:image/jpeg;base64,${base64}`;
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: { parts: [{ text }] },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' }
        }
      }
    }
  });

  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64) throw new Error("No audio generated");
  return base64;
};

export const analyzeImage = async (base64Data: string, mimeType: string, language: Language): Promise<string> => {
  const ai = getAI();
  const prompt = language === 'ms'
    ? "Lihat gambar ini dan terangkan apa yang anda nampak kepada kanak-kanak. Gunakan bahasa yang mudah dan ceria."
    : "Look at this picture and explain what you see to a child. Use simple and cheerful language.";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        { text: prompt }
      ]
    }
  });

  return response.text || (language === 'ms' ? "Maaf, saya tidak pasti." : "Sorry, I'm not sure.");
};
