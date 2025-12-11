
import React from 'react';
import { ArrowLeft, Hand, MessageCircle, Users, Smartphone, Info } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const DefinisiBuli: React.FC<Props> = ({ onBack }) => {
  const types = [
    {
      title: "Buli Fizikal",
      desc: "Memukul, menendang, mencubit, atau merosakkan harta benda orang lain.",
      icon: Hand,
      color: "bg-red-100 text-red-600",
      border: "border-red-200"
    },
    {
      title: "Buli Lisan",
      desc: "Mengejek, menggelar nama, menghina, atau mengugut secara percakapan.",
      icon: MessageCircle,
      color: "bg-orange-100 text-orange-600",
      border: "border-orange-200"
    },
    {
      title: "Buli Sosial",
      desc: "Memulaukan kawan, menyebarkan fitnah, atau menghasut orang lain membenci mangsa.",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      border: "border-blue-200"
    },
    {
      title: "Buli Siber",
      desc: "Menghantar mesej jahat, menyebarkan gambar aib, atau mengugut di media sosial.",
      icon: Smartphone,
      color: "bg-purple-100 text-purple-600",
      border: "border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b border-stone-100 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-[#3D405B]">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-[#3D405B] font-fredoka">Definisi Buli</h2>
      </div>

      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        {/* Main Definition */}
        <div className="bg-[#E07A5F] rounded-3xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="text-2xl font-black font-fredoka mb-4">Apa Itu Buli?</h3>
             <p className="text-lg font-nunito leading-relaxed font-medium">
               Perbuatan tingkah laku agresif yang berulang kali dilakukan untuk menyakiti hati atau mencederakan orang lain, sama ada secara fizikal atau emosi.
             </p>
           </div>
           <div className="absolute -right-4 -bottom-4 opacity-20">
             <Info size={120} />
           </div>
        </div>

        <h3 className="text-xl font-black text-[#3D405B] font-fredoka mb-4 px-2">4 Jenis Utama Buli</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map((type, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-2xl border-2 ${type.border} shadow-sm hover:shadow-md transition-shadow`}>
               <div className={`w-12 h-12 rounded-xl ${type.color} flex items-center justify-center mb-4`}>
                 <type.icon size={24} />
               </div>
               <h4 className="text-lg font-bold text-[#3D405B] mb-2">{type.title}</h4>
               <p className="text-slate-500 text-sm leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-[#81B29A]/10 rounded-2xl border border-[#81B29A]/20 text-center">
           <p className="text-[#3D405B] font-bold text-sm">
             "Membuli tidak menjadikan anda hebat. Ia menjadikan anda seorang yang lemah."
           </p>
        </div>
      </div>
    </div>
  );
};
