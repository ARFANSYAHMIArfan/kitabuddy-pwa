import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Loader2, Info, Search } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { Language } from '../types';

interface LearnModeProps {
  language: Language;
}

export const LearnMode: React.FC<LearnModeProps> = ({ language }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    en: {
      title: "Explore the World!",
      subtitle: "Show me something, and I'll tell you what it is.",
      tapToPhoto: "Tap to take a photo",
      orUpload: "or upload an image",
      thinking: "Looking closely...",
      resultTitle: "Here's what I found!",
      tipPet: "Take a picture of a pet!",
      tipFruit: "Take a picture of a fruit!"
    },
    ms: {
      title: "Teroka Dunia!",
      subtitle: "Tunjuk sesuatu, saya akan beritahu apa itu.",
      tapToPhoto: "Ketuk untuk ambil gambar",
      orUpload: "atau muat naik gambar",
      thinking: "Sedang melihat...",
      resultTitle: "Ini apa yang saya jumpa!",
      tipPet: "Ambil gambar haiwan peliharaan!",
      tipFruit: "Ambil gambar buah-buahan!"
    }
  };

  const text = t[language];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      // Start analysis automatically
      runAnalysis(base64String, file.type);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (base64Full: string, mimeType: string) => {
    setIsLoading(true);
    setAnalysis(null);
    
    const base64Data = base64Full.split(',')[1];

    try {
      const result = await analyzeImage(base64Data, mimeType, language);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysis(language === 'ms' ? "Alamak! Saya tak nampak dengan jelas. Cuba gambar lain?" : "Oops! I couldn't see that clearly. Try another picture?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-600 mb-2 font-fredoka">{text.title}</h2>
        <p className="text-slate-500 font-nunito">{text.subtitle}</p>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative w-full aspect-video rounded-3xl border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group shadow-sm
          ${imagePreview ? 'border-emerald-400 bg-black' : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/*" 
          className="hidden" 
        />
        
        {imagePreview ? (
          <img src={imagePreview} alt="Uploaded" className="w-full h-full object-contain animate-fade-in" />
        ) : (
          <div className="text-center p-6 transition-transform duration-300 group-hover:scale-105">
            <div className="bg-white p-5 rounded-full inline-block mb-4 shadow-md">
               <Camera className="w-10 h-10 text-emerald-500" />
            </div>
            <p className="font-bold text-emerald-700 text-lg">{text.tapToPhoto}</p>
            <p className="text-emerald-500 text-sm font-medium">{text.orUpload}</p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
            <Loader2 className="w-12 h-12 animate-spin mb-3 text-emerald-400" />
            <p className="font-bold font-fredoka text-lg tracking-wide animate-pulse">{text.thinking}</p>
          </div>
        )}
        
        {imagePreview && !isLoading && (
          <div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
             <Search size={20} />
          </div>
        )}
      </div>

      {analysis && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 animate-fade-in-up ring-4 ring-emerald-50">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 flex-shrink-0 shadow-sm">
              <Sparkles size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2 font-fredoka">{text.resultTitle}</h3>
              <div className="prose prose-emerald text-slate-600 leading-loose font-nunito">
                 {analysis}
              </div>
            </div>
          </div>
        </div>
      )}

      {!imagePreview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-500"><Info size={20} /></div>
                <p className="text-sm text-slate-600 font-bold">{text.tipPet}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="bg-orange-100 p-2 rounded-xl text-orange-500"><Info size={20} /></div>
                <p className="text-sm text-slate-600 font-bold">{text.tipFruit}</p>
            </div>
        </div>
      )}
    </div>
  );
};