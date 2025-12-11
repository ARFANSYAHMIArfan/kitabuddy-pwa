
import React from 'react';
import { ArrowLeft, ShieldCheck, UserX, UserCheck, Volume2, Flag } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const CaraMengelak: React.FC<Props> = ({ onBack }) => {
  const steps = [
    {
      title: "Abaikan & Berlalu",
      desc: "Jangan balas provokasi. Buat tidak tahu dan terus berjalan pergi dengan tenang.",
      icon: UserX,
      color: "bg-stone-100 text-stone-600"
    },
    {
      title: "Tampil Yakin",
      desc: "Berjalan dengan tegak dan pandang ke hadapan. Pembuli suka mangsa yang nampak takut.",
      icon: ShieldCheck,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Berkawan",
      desc: "Sentiasa bergerak dalam kumpulan. Pembuli jarang mengganggu jika anda ramai.",
      icon: UserCheck,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Katakan 'TIDAK'",
      desc: "Jika berani, katakan 'JANGAN GANGGU SAYA' dengan suara yang tegas dan kuat.",
      icon: Volume2,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Lapor Segera",
      desc: "Beritahu guru, ibu bapa, atau pengawas. Melapor bukan bermaksud anda lemah, tapi bijak!",
      icon: Flag,
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b border-stone-100 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-[#3D405B]">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-[#3D405B] font-fredoka">Cara Mengelak</h2>
      </div>

      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
           <div className="w-20 h-20 bg-[#81B29A] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg animate-bounce">
             <ShieldCheck size={40} />
           </div>
           <h3 className="text-2xl font-black text-[#3D405B] font-fredoka">Jadilah Wira Diri!</h3>
           <p className="text-slate-500 font-nunito">Ikuti langkah-langkah ini untuk melindungi diri anda.</p>
        </div>

        <div className="space-y-4">
           {steps.map((step, idx) => (
             <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4 hover:shadow-md transition-all hover:-translate-y-1">
                <div className={`p-3 rounded-xl ${step.color} flex-shrink-0 mt-1`}>
                  <step.icon size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#3D405B] mb-1">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-8 bg-white p-6 rounded-3xl border-2 border-dashed border-[#E07A5F]/30 text-center">
            <h4 className="font-bold text-[#E07A5F] mb-2">Ingat!</h4>
            <p className="text-sm text-slate-500">
              Jika anda melihat rakan dibuli, jangan diam. Jadilah 'Upstander', bukan 'Bystander'. Bantuan anda sangat bermakna.
            </p>
        </div>
      </div>
    </div>
  );
};
