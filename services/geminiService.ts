
import { Language, StoryData } from '../types';

// AI Features are currently bypassed for demo/PWA deployment without API Key.
// These functions return mock data to simulate functionality.

export const chatWithBuddy = async (history: any[], message: string, language: Language = 'ms') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    "Itu soalan yang bagus! Membuli adalah perbuatan yang tidak baik kerana ia menyakiti hati orang lain.",
    "Budi di sini sentiasa mendengar. Ceritakan lagi, saya sedia membantu.",
    "Kita semua perlu berani untuk berkata 'TIDAK' kepada pembuli!",
    "Awak seorang yang hebat kerana berkongsi perkara ini dengan saya.",
    "Ingat, awak tidak bersendirian. Cikgu dan ibu bapa sentiasa ada untuk awak."
  ];
  
  // Return random response
  return responses[Math.floor(Math.random() * responses.length)] + " (AI Demo)";
};

export const generateStory = async (topic: string, language: Language): Promise<StoryData> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    title: "Kisah Si Kancil dan Rakan Baru",
    content: "Pada suatu hari, di dalam hutan yang damai, Si Kancil sedang berjalan-jalan. Tiba-tiba, dia ternampak seekor arnab kecil sedang menangis di tepi sungai. 'Kenapa awak menangis?' tanya Si Kancil. Arnab itu menjawab, 'Ada serigala yang mengejek telinga saya yang panjang.' Si Kancil tersenyum dan berkata, 'Jangan sedih. Telinga panjang awak sangat istimewa! Ia membantu awak mendengar dengan lebih jelas.' Arnab itu berhenti menangis dan berasa bangga dengan dirinya. Mereka pun menjadi kawan baik dan bermain bersama-sama dengan gembira.",
    moral: "Kita harus menghargai keunikan diri sendiri dan orang lain. Jangan mengejek kawan.",
    visualPrompt: "A cute mouse deer comforting a crying rabbit by a river in a magical forest"
  };
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return a safe placeholder image from Unsplash source
  return "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?q=80&w=1000&auto=format&fit=crop";
};

export const generateSpeech = async (text: string): Promise<string> => {
  // Mock returns empty string - UI handles this by just logging or skipping playback
  console.log("Speech generation bypassed in demo mode");
  return ""; 
};

export const analyzeImage = async (base64Data: string, mimeType: string, language: Language): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return "Wah! Ini kelihatan seperti sekumpulan pelajar yang sedang belajar bersama-sama. Mereka kelihatan gembira dan saling tolong-menolong. Ini adalah contoh persahabatan yang baik!";
};