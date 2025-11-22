
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithBuddy } from '../services/geminiService';
import { subscribeToChat, saveChatMessage } from '../services/firebase';

interface ChatModeProps {
  onBack: () => void;
  studentId: string; // Needed to save chat to the specific user
}

export const ChatMode: React.FC<ChatModeProps> = ({ onBack, studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to Firestore messages on mount
  useEffect(() => {
    if (!studentId) return;

    const unsubscribe = subscribeToChat(studentId, (newMessages) => {
      // If no messages exist yet in DB, add the welcome message locally or save it to DB
      if (newMessages.length === 0) {
        const welcomeMsg = {
          role: 'model' as const,
          text: "Hai! Saya Budi. Rakan siber anda di sini. Ada apa-apa yang awak nak kongsikan? Saya sedia mendengar. 🤗",
          timestamp: Date.now()
        };
        saveChatMessage(studentId, welcomeMsg);
      } else {
        setMessages(newMessages);
      }
    });

    return () => unsubscribe();
  }, [studentId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput(''); // Clear input immediately
    setIsTyping(true);

    // 1. Save User Message to Firestore
    await saveChatMessage(studentId, {
      role: 'user',
      text: userText,
      timestamp: Date.now()
    });

    try {
      // Format history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // 2. Get AI Response
      const responseText = await chatWithBuddy(history, userText, 'ms');

      // 3. Save AI Message to Firestore
      await saveChatMessage(studentId, {
        role: 'model',
        text: responseText || "Maaf, Budi kurang faham. Boleh ulang?",
        timestamp: Date.now()
      });

    } catch (error) {
      console.error(error);
      // Save error message to Firestore so user sees it
      await saveChatMessage(studentId, {
        role: 'model',
        text: "Alamak, talian terganggu sekejap. Cuba lagi ya!",
        timestamp: Date.now()
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-[#81B29A] p-6 text-white flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold font-fredoka">Berbual Bersama Budi</h2>
          <p className="text-xs text-white/80 font-nunito tracking-wide uppercase font-bold">Rakan Siber Anda</p>
        </div>
        <div className="ml-auto bg-white/20 p-2 rounded-2xl">
          <Bot size={28} />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-[#E07A5F] text-white' : 'bg-white text-[#81B29A] border border-[#81B29A]/20'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div
                className={`p-4 rounded-3xl text-[15px] font-nunito leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#E07A5F] text-white rounded-tr-sm'
                    : 'bg-white text-[#3D405B] rounded-tl-sm border border-stone-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex max-w-[80%] gap-3 flex-row">
                <div className="w-10 h-10 rounded-full bg-white text-[#81B29A] border border-[#81B29A]/20 flex items-center justify-center flex-shrink-0">
                   <Bot size={18} />
                </div>
                <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-sm border border-stone-100 shadow-sm flex items-center gap-2 text-[#81B29A] text-sm font-bold">
                  <Loader2 className="animate-spin" size={16} />
                  Budi sedang menaip...
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-stone-100">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis mesej kepada Budi..."
            className="w-full py-4 pl-6 pr-14 text-base rounded-full border-2 border-stone-200 focus:border-[#81B29A] focus:ring-4 focus:ring-[#81B29A]/10 outline-none transition-all bg-[#FDFBF7] font-nunito text-[#3D405B]"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bg-[#E07A5F] text-white p-3 rounded-full hover:bg-[#d0654a] transition-all disabled:opacity-50 shadow-md active:scale-95"
          >
            <Send size={20} className={input.trim() ? "translate-x-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
};
