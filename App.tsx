
import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Youtube, ShieldAlert, Music, Gamepad2, Image as ImageIcon, 
  Star, Home, StickyNote, MessageCircleHeart, Gavel, HeartHandshake, Siren, 
  LogOut, School, Plus, X, ArrowRight, Sparkles, UserCircle, Lock, Key, ArrowLeft, Loader2,
  Unlock, Users, FileText, Activity, AlertTriangle, CheckCircle, Settings, 
  Trash2, Edit, BarChart3, Power, PenTool, Wrench, Layers, Save, Eye, PlayCircle, WifiOff,
  Brain, Footprints, Megaphone, Phone, ExternalLink, CheckSquare, Heart, PauseCircle
} from 'lucide-react';
import { ViewState, MenuItem } from './types';
import { ChatMode } from './components/ChatMode';
import { StoryMode } from './components/StoryMode';
import { LearnMode } from './components/LearnMode';
import { 
  loginUser, getUsers, updateUserRole, addUser, deleteUser,
  getReports, addReport, updateReport, deleteReport,
  getSettings, toggleMaintenanceMode, getFeatures, updateFeature
} from './services/firebase';

// --- Internal Creative Components ---

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="space-y-6">
      <div className="bg-[#3D405B] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E07A5F]/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`w-40 h-40 bg-gradient-to-tr from-[#E07A5F] to-[#F2CC8F] rounded-full flex items-center justify-center shadow-lg mb-6 border-8 border-white/10 ${isPlaying ? 'animate-spin-slow' : ''}`}>
             <Music size={64} className="text-white drop-shadow-md" />
          </div>
          <h3 className="text-2xl font-black font-fredoka mb-1">Budi Bahasa Budaya Kita</h3>
          <p className="text-white/60 font-nunito font-bold mb-8">Lagu Rasmi KitaBuddy</p>
          
          <div className="flex items-center gap-6">
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><SkipBackIcon size={24} /></button>
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className="w-16 h-16 bg-white text-[#3D405B] rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
             >
               {isPlaying ? <PauseCircle size={32} fill="currentColor" /> : <PlayCircle size={32} fill="currentColor" />}
             </button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><SkipForwardIcon size={24} /></button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
         <h4 className="font-bold text-[#3D405B] mb-4 flex items-center gap-2">
           <FileText size={20} className="text-[#81B29A]" /> Lirik Lagu
         </h4>
         <div className="space-y-4 font-nunito text-slate-600 leading-relaxed text-center">
            <p className="italic text-slate-400 text-sm">(Intro Muzik Ceria)</p>
            <p>🎵 Di sini teman, di sana teman<br/>Di mana-mana kita berkawan</p>
            <p>🎵 Tiada musuh, tiada lawan<br/>Semua orang kita sayangi</p>
            <p className="font-bold text-[#E07A5F]">Korus:</p>
            <p>Katakan TAK NAK pada buli<br/>Katakan YA pada budi<br/>Hormat guru, sayang rakan<br/>Itulah amalan murni!</p>
         </div>
      </div>
    </div>
  );
};

const PosterGallery: React.FC = () => {
  const posters = [
    { title: "HENTIKAN BULI", color: "from-red-500 to-orange-500", icon: ShieldAlert, subtitle: "Bersama Mencegah" },
    { title: "KITA KAWAN", color: "from-blue-400 to-cyan-300", icon: Users, subtitle: "Bukan Lawan" },
    { title: "BUDI BAHASA", color: "from-emerald-400 to-green-300", icon: Heart, subtitle: "Amalan Kita" },
    { title: "FIKIR DULU", color: "from-purple-500 to-pink-500", icon: Brain, subtitle: "Sebelum Bertindak" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {posters.map((poster, i) => (
         <div key={i} className={`aspect-[3/4] rounded-3xl bg-gradient-to-br ${poster.color} p-6 flex flex-col items-center justify-center text-white shadow-xl hover:scale-105 transition-transform relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
               <poster.icon size={48} className="text-white" />
            </div>
            <h3 className="text-3xl font-black font-fredoka text-center leading-none mb-2">{poster.title}</h3>
            <div className="w-12 h-1 bg-white/50 rounded-full mb-2"></div>
            <p className="font-nunito font-bold tracking-widest text-sm uppercase">{poster.subtitle}</p>
         </div>
       ))}
    </div>
  );
};

const GoodDeedsPledge: React.FC = () => {
  const [checked, setChecked] = useState<number[]>([]);
  const [signed, setSigned] = useState(false);

  const deeds = [
    "Saya akan senyum pada kawan hari ini.",
    "Saya tidak akan mengejek sesiapa.",
    "Saya akan ajak kawan yang keseorangan bermain.",
    "Saya akan lapor pada cikgu jika nampak buli.",
    "Saya akan cakap perkara yang baik sahaja."
  ];

  const toggle = (i: number) => {
    if (checked.includes(i)) setChecked(checked.filter(c => c !== i));
    else setChecked([...checked, i]);
  };

  return (
    <div className="space-y-6">
       <div className="bg-[#F2CC8F]/20 p-8 rounded-3xl text-center border-2 border-[#F2CC8F] border-dashed">
          <Star size={48} className="mx-auto text-[#E07A5F] mb-4 fill-current" />
          <h3 className="text-2xl font-bold text-[#3D405B] mb-2 font-fredoka">Misi Saya Hari Ini</h3>
          <p className="text-slate-600">Tandakan semua kotak untuk menjadi Wira Anti-Buli!</p>
       </div>

       <div className="space-y-3">
          {deeds.map((deed, i) => (
            <div 
              key={i} 
              onClick={() => toggle(i)}
              className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${checked.includes(i) ? 'bg-[#81B29A]/10 border-[#81B29A] scale-[1.02]' : 'bg-white border-slate-100 hover:border-[#81B29A]/50'}`}
            >
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-colors ${checked.includes(i) ? 'bg-[#81B29A] border-[#81B29A] text-white' : 'border-slate-200 text-transparent'}`}>
                  <CheckSquare size={20} />
               </div>
               <span className={`font-bold font-nunito ${checked.includes(i) ? 'text-[#3D405B]' : 'text-slate-500'}`}>{deed}</span>
            </div>
          ))}
       </div>

       <button 
         disabled={checked.length < deeds.length || signed}
         onClick={() => setSigned(true)}
         className="w-full py-4 bg-[#3D405B] text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2A2D40] transition-colors mt-4"
       >
         {signed ? "Tahniah! Anda Wira Sejati 🌟" : "Saya Berjanji! ✋"}
       </button>
       
       {signed && (
         <div className="text-center animate-bounce text-[#E07A5F] font-bold mt-4">
           Terima kasih kerana menjadi kawan yang baik!
         </div>
       )}
    </div>
  );
};

const EmergencyView: React.FC<{type: 'talian' | 'sos'}> = ({type}) => {
  if (type === 'sos') {
     return (
       <div className="space-y-6 text-center animate-pulse">
          <div className="bg-red-500 text-white p-10 rounded-[3rem] shadow-2xl shadow-red-200">
             <Siren size={80} className="mx-auto mb-6 animate-ping" />
             <h2 className="text-4xl font-black font-fredoka mb-4">SOS BULI</h2>
             <p className="text-xl font-bold mb-8">Anda dalam bahaya? Bertindak sekarang!</p>
             <button onClick={() => window.open('tel:999')} className="bg-white text-red-600 px-8 py-4 rounded-full font-black text-2xl hover:scale-105 transition-transform shadow-lg">
                HUBUNGI 999
             </button>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border-2 border-red-100 text-left space-y-4">
             <h3 className="font-bold text-red-500 uppercase tracking-widest text-sm">Langkah Kecemasan</h3>
             <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">1</div>
                <p className="font-bold text-slate-700">Lari ke tempat yang ramai orang.</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">2</div>
                <p className="font-bold text-slate-700">Jerit "TOLONG!" dengan kuat.</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">3</div>
                <p className="font-bold text-slate-700">Cari guru atau orang dewasa.</p>
             </div>
          </div>
       </div>
     );
  }

  return (
    <div className="space-y-4">
       <div className="bg-[#E07A5F]/10 p-6 rounded-3xl mb-4 flex items-center gap-4">
          <HeartHandshake size={48} className="text-[#E07A5F]" />
          <div>
            <h3 className="text-xl font-bold text-[#3D405B]">Talian Hayat</h3>
            <p className="text-slate-600 text-sm">Kami sedia mendengar masalah anda.</p>
          </div>
       </div>

       {[
         { name: "Talian Kasih", number: "15999", desc: "Bantuan Khas Kerajaan (24 Jam)", color: "bg-pink-50 text-pink-600" },
         { name: "Befrienders", number: "03-76272929", desc: "Sokongan Emosi & Mental", color: "bg-blue-50 text-blue-600" },
         { name: "Buddy Chat", number: "Chat Sekarang", desc: "Berbual dengan AI Buddy", color: "bg-emerald-50 text-emerald-600", action: true }
       ].map((item, i) => (
         <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex justify-between items-center group hover:shadow-md transition-shadow">
            <div>
               <h4 className="font-bold text-lg text-[#3D405B]">{item.name}</h4>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.desc}</p>
            </div>
            {item.action ? (
               <div className={`px-4 py-2 rounded-xl font-bold ${item.color} flex items-center gap-2`}>
                 <MessageCircleHeart size={18} /> Chat
               </div>
            ) : (
               <a href={`tel:${item.number}`} className={`px-4 py-2 rounded-xl font-bold ${item.color} flex items-center gap-2 group-hover:scale-105 transition-transform`}>
                 <Phone size={18} /> {item.number}
               </a>
            )}
         </div>
       ))}
    </div>
  );
};

// Icons helper
const SkipBackIcon = ({size}: {size:number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
);
const SkipForwardIcon = ({size}: {size:number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
);


const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  // Online/Offline State
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Login State
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // User State
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // Maintenance Mode
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceBypass, setMaintenanceBypass] = useState(false);
  const [maintenancePinInput, setMaintenancePinInput] = useState('');
  const [showMaintenanceLogin, setShowMaintenanceLogin] = useState(false);

  // Feature Management
  const [featureSettings, setFeatureSettings] = useState<Record<string, any>>({});
  
  // Feature Popups
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureModalContent, setFeatureModalContent] = useState({ title: '', message: '' });

  // Init
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkSettings = async () => {
      if (navigator.onLine) {
        try {
          const settings = await getSettings();
          if (settings && settings.maintenanceMode !== undefined) {
            setMaintenanceMode(settings.maintenanceMode);
          }
          const features = await getFeatures();
          setFeatureSettings(features);
        } catch (e) {
          console.log("Offline: Using default settings");
        }
      }
    };
    checkSettings();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Palette:
  // Primary (Sage): text-[#81B29A]
  // Secondary (Terracotta): text-[#E07A5F]
  // Dark (Charcoal): text-[#3D405B]
  // Light (Cream): bg-[#F4F1DE]

  const mainMenuItems: MenuItem[] = [
    { 
      id: '1', 
      title: 'Definisi Buli', 
      icon: BookOpen, 
      color: 'text-[#E07A5F]',
      action: () => window.open('https://character.ai/chat/MTBBbDV5aZMXYA2b8o-K7dOJn5Wxteci7Of68s11ieM', '_blank')
    },
    { 
      id: '2', 
      title: 'Video Kesedaran', 
      icon: Youtube, 
      color: 'text-[#E07A5F]',
      action: () => window.open('https://sites.google.com/moe-dl.edu.my/koleksi-video-antibuli/laman-utama', '_blank')
    },
    { id: '3', title: 'Cara Mengelak', icon: ShieldAlert, color: 'text-[#81B29A]' },
    { id: '4', title: 'Lagu Anti Buli', icon: Music, color: 'text-[#F2CC8F]' },
    { id: '5', title: 'Permainan', icon: Gamepad2, color: 'text-[#81B29A]' },
    { id: '6', title: 'Koleksi Poster', icon: ImageIcon, color: 'text-[#E07A5F]' },
    { id: '7', title: 'Saya Nak Jadi Baik', icon: Star, color: 'text-[#F2CC8F]' },
  ];

  const extraMenuItems: MenuItem[] = [
    { 
      id: 'web', 
      title: 'Laman Web', 
      icon: Home, 
      color: 'text-[#81B29A]',
      action: () => window.open('https://kitabuddy.my.canva.site', '_blank')
    },
    { id: 'padlet', title: 'Padlet Sharing', icon: StickyNote, color: 'text-[#F2CC8F]' },
    { 
      id: 'chat', 
      title: 'Berbual Bersama Budi', 
      icon: MessageCircleHeart, 
      color: 'text-[#E07A5F]',
      action: () => setView(ViewState.CHAT) 
    },
    { id: 'hukuman', title: 'Hukuman Membuli', icon: Gavel, color: 'text-[#3D405B]' },
    { id: 'talian', title: 'Talian Hayat', icon: HeartHandshake, color: 'text-[#E07A5F]' },
    { 
      id: 'sos', 
      title: 'SOS BULI (SPDB)', 
      icon: Siren, 
      color: 'text-red-500 animate-pulse',
      action: () => window.open('https://s-a-f-e-smart-reporting.onrender.com', '_blank')
    },
  ];

  // Static content dictionary
  const staticContent: Record<string, any> = {
    '3': {
      title: "Cara Mengelak Buli",
      content: (
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-[#81B29A] to-[#6a9e85] p-8 rounded-3xl text-center relative overflow-hidden text-white shadow-xl shadow-emerald-100 mb-2">
              <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:20px_20px]"></div>
              <div className="relative z-10">
                <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-pulse">
                   <ShieldAlert size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-black font-fredoka mb-1">Jadilah Bijak!</h3>
                <p className="font-nunito font-medium opacity-90 text-sm">Anda lebih kuat & berani dari yang anda sangka.</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute top-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
           </div>

           <div className="grid gap-4">
              {[
                { 
                  title: "Kekal Tenang", 
                  desc: "Jangan tunjukkan rasa takut. Tarik nafas, muka yakin!",
                  icon: <Brain size={24} />,
                  bg: "bg-blue-100",
                  text: "text-blue-600",
                  border: "border-blue-100"
                },
                { 
                  title: "Abaikan & Blah", 
                  desc: "Buat tak tahu. Terus jalan dengan laju macam bos!",
                  icon: <Footprints size={24} />,
                  bg: "bg-purple-100",
                  text: "text-purple-600",
                  border: "border-purple-100"
                },
                { 
                  title: "Lapor Segera", 
                  desc: "Beritahu Cikgu atau Ibu Bapa. Ini bukan mengadu, ini bertindak!",
                  icon: <Megaphone size={24} />,
                  bg: "bg-orange-100",
                  text: "text-orange-600",
                  border: "border-orange-100"
                },
                { 
                  title: "Gerak Berkumpulan", 
                  desc: "Jalan dengan kawan. Pembuli takut bila kita ramai.",
                  icon: <Users size={24} />,
                  bg: "bg-emerald-100",
                  text: "text-emerald-600",
                  border: "border-emerald-100"
                }
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-4 bg-white p-4 rounded-2xl border-2 ${item.border} shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.text} shadow-sm flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${item.text} font-fredoka leading-none mb-1`}>{item.title}</h4>
                    <p className="text-slate-500 text-sm font-nunito leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )
    },
    'hukuman': {
      title: "Hukuman Membuli",
      content: (
         <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
               <Gavel size={48} className="text-red-400 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-red-600 mb-2">Tindakan Disiplin</h3>
               <p className="text-slate-600 font-nunito">
                  Buli adalah kesalahan serius di sekolah dan boleh dikenakan tindakan undang-undang.
               </p>
            </div>
            <ul className="space-y-3">
               {["Amaran Lisan & Bertulis", "Gantung Sekolah", "Buang Sekolah", "Tindakan Undang-Undang (Polis)", "Kaunseling Wajib"].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-stone-100 text-[#3D405B] font-bold">
                    <div className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                    {item}
                 </li>
               ))}
            </ul>
         </div>
      )
    }
  };

  const handleFeatureClick = (item: MenuItem) => {
    // Check connectivity for specific features
    const onlineOnlyFeatures = ['chat', '5', 'sos', 'padlet', 'web', '2', '1']; 
    if (!isOnline && onlineOnlyFeatures.includes(item.id)) {
      setFeatureModalContent({
        title: "Tiada Sambungan Internet",
        message: "Ciri ini memerlukan sambungan internet untuk berfungsi. Sila semak sambungan anda."
      });
      setShowFeatureModal(true);
      return;
    }

    // Check feature status from DB
    const setting = featureSettings[item.id];
    
    if (setting) {
      if (setting.status === 'Coming Soon') {
        setFeatureModalContent({
          title: setting.title || item.title,
          message: setting.message || "Ciri ini akan datang tidak lama lagi. Kami sedang menyiapkannya dengan penuh kasih sayang!"
        });
        setShowFeatureModal(true);
        return;
      }
      
      if (setting.status === 'Maintenance') {
        setFeatureModalContent({
          title: "Penyelenggaraan",
          message: setting.message || "Ciri ini sedang dikemaskini. Sila cuba sebentar lagi."
        });
        setShowFeatureModal(true);
        return;
      }
    }

    if (item.action) {
      item.action();
    } else {
      setSelectedFeature(item.id);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      setLoginError("Tiada sambungan internet.");
      return;
    }

    if (!loginForm.id || !loginForm.password) {
      setLoginError("Sila masukkan ID dan Kata Laluan");
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const user = await loginUser(loginForm.id, loginForm.password);
      
      if (user) {
        if (maintenanceMode && !maintenanceBypass && !user.role.toLowerCase().includes('admin')) {
          setLoginError("Sistem dalam penyelenggaraan.");
          setIsLoggingIn(false);
          return;
        }

        setUserRole(user.role);
        setUserName(user.name);
        setView(ViewState.MENU);
      } else {
        setLoginError