import React, { useState, useRef } from 'react';
import { BookOpen, Image as ImageIcon, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { generateStory, generateIllustration, generateSpeech } from '../services/geminiService';
import { decodeBase64, decodeAudioData, playAudioBuffer } from '../utils/audioUtils';
import { StoryData, LoadingState, Language } from '../types';

interface StoryModeProps {
  language: Language;
}

export const StoryMode: React.FC<StoryModeProps> = ({ language }) => {
  const [topic, setTopic] = useState('');
  const [story, setStory] = useState<StoryData | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [imageStatus, setImageStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [audioStatus, setAudioStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const textContent = {
    en: {
      title: "Magic Story Time",
      placeholder: "e.g., A brave cat in space...",
      button: "Write Story!",
      error: "Oops! My magic pen broke. Try again?",
      noImage: "No picture yet",
      drawBtn: "Draw This!",
      moralLabel: "Moral",
      subtitle: "What should we write a story about today?"
    },
    ms: {
      title: "Masa Bercerita Ajaib",
      placeholder: "cth., Kucing berani di angkasa...",
      button: "Tulis Cerita!",
      error: "Alamak! Pen ajaib saya rosak. Cuba lagi?",
      noImage: "Tiada gambar lagi",
      drawBtn: "Lukis Ini!",
      moralLabel: "Pengajaran",
      subtitle: "Apakah cerita yang patut kita tulis hari ini?"
    }
  };

  const t = textContent[language];

  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setStatus(LoadingState.LOADING);
    setStory(null);
    setImageUrl(null);
    
    try {
      const data = await generateStory(topic, language);
      setStory(data);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleGenerateImage = async () => {
    if (!story) return;
    setImageStatus(LoadingState.LOADING);
    try {
      const url = await generateIllustration(story.visualPrompt);
      setImageUrl(url);
      setImageStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setImageStatus(LoadingState.ERROR);
    }
  };

  const handleReadAloud = async () => {
    if (!story) return;
    setAudioStatus(LoadingState.LOADING);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const base64Audio = await generateSpeech(`${story.title}. ${story.content} ${t.moralLabel}: ${story.moral}`);
      const audioBytes = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current);
      
      playAudioBuffer(audioContextRef.current, audioBuffer);
      setAudioStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAudioStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="space-y-6 p-4 pb-24 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-600 mb-2 font-fredoka">{t.title}</h2>
        <p className="text-slate-500 font-nunito">{t.subtitle}</p>
      </div>

      <form onSubmit={handleGenerateStory} className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t.placeholder}
          className="w-full p-4 pr-14 text-lg rounded-2xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm font-nunito"
          disabled={status === LoadingState.LOADING}
        />
        <button
          type="submit"
          disabled={status === LoadingState.LOADING || !topic}
          className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === LoadingState.LOADING ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles />
          )}
        </button>
      </form>

      {status === LoadingState.ERROR && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-bold">
          {t.error}
        </div>
      )}

      {story && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-50 animate-fade-in-up">
           {/* Image Section */}
           <div className="w-full min-h-[250px] bg-slate-100 flex items-center justify-center relative group">
            {imageUrl ? (
              <img src={imageUrl} alt="Story illustration" className="w-full h-full object-cover animate-fade-in" />
            ) : (
              <div className="flex flex-col items-center p-8 text-slate-400">
                {imageStatus === LoadingState.LOADING ? (
                  <Loader2 className="w-10 h-10 animate-spin mb-2 text-indigo-500" />
                ) : (
                   <div className="text-center">
                     <ImageIcon className="w-16 h-16 mb-2 mx-auto opacity-30" />
                     <p className="text-sm font-bold opacity-50">{t.noImage}</p>
                   </div>
                )}
              </div>
            )}
            
            {!imageUrl && imageStatus !== LoadingState.LOADING && (
               <button
               onClick={handleGenerateImage}
               className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md shadow-lg text-indigo-600 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform"
             >
               <ImageIcon size={18} /> {t.drawBtn}
             </button>
            )}
           </div>

           {/* Content */}
           <div className="p-6 space-y-4">
             <div className="flex justify-between items-start gap-4">
               <h3 className="text-2xl font-bold text-slate-800 font-fredoka leading-tight">{story.title}</h3>
               <button
                 onClick={handleReadAloud}
                 disabled={audioStatus === LoadingState.LOADING}
                 className="text-indigo-600 bg-indigo-50 p-3 rounded-full hover:bg-indigo-100 transition-colors flex-shrink-0"
               >
                 {audioStatus === LoadingState.LOADING ? <Loader2 className="animate-spin" size={24} /> : <Volume2 size={24} />}
               </button>
             </div>
             
             <div className="prose prose-indigo text-slate-600 leading-loose whitespace-pre-wrap font-nunito text-lg">
               {story.content}
             </div>

             <div className="mt-6 pt-4 border-t border-indigo-50 bg-yellow-50/50 -mx-6 px-6 pb-2">
               <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mt-4">{t.moralLabel}</span>
               <p className="mt-2 text-base font-medium text-slate-700 italic">"{story.moral}"</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
