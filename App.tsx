
import React, { useState, useEffect } from 'react';
import { 
  Youtube, ShieldAlert, Music, Gamepad2, BookOpen,
  Star, Home, StickyNote, MessageCircleHeart, Gavel, HeartHandshake, Siren, 
  LogOut, School, Plus, X, ArrowRight, Sparkles, UserCircle, Lock, Key, ArrowLeft, Loader2,
  Unlock, Users, FileText, Activity, AlertTriangle, Settings, 
  Trash2, Edit, BarChart3, Wrench, Layers, Save
} from 'lucide-react';
import { ViewState, MenuItem } from './types';
import { 
  loginUser, getUsers, updateUserRole, addUser, deleteUser,
  getReports, addReport, updateReport, deleteReport,
  getSettings, toggleMaintenanceMode, getFeatures, updateFeature,
  incrementFeatureUsage, getFeatureUsage
} from './services/firebase';
import { DefinisiBuli } from './components/DefinisiBuli';
import { CaraMengelak } from './components/CaraMengelak';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  // Login State
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // User State
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // Admin Feature State
  const [adminPin, setAdminPin] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminView, setAdminView] = useState<'dashboard' | 'users' | 'reports' | 'settings' | 'features'>('dashboard');
  
  // Data Lists
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [featureStats, setFeatureStats] = useState<Record<string, number>>({});

  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', studentId: '', password: '', role: 'student' });
  const [showAddReport, setShowAddReport] = useState(false);
  const [newReport, setNewReport] = useState({ student: '', class: '', issue: '', status: 'Baru' });

  // Maintenance Mode
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceBypass, setMaintenanceBypass] = useState(false);
  const [maintenancePinInput, setMaintenancePinInput] = useState('');
  const [showMaintenanceLogin, setShowMaintenanceLogin] = useState(false);

  // Feature Management
  const [featureSettings, setFeatureSettings] = useState<Record<string, any>>({});
  const [showEditFeature, setShowEditFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [showBackendPinModal, setShowBackendPinModal] = useState(false);
  const [backendPinInput, setBackendPinInput] = useState('');
  const [backendPinError, setBackendPinError] = useState('');
  const [pendingFeatureUpdate, setPendingFeatureUpdate] = useState<{id: string, data: any} | null>(null);

  // Feature Popups (Coming Soon / Blocked)
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureModalContent, setFeatureModalContent] = useState({ title: '', message: '' });

  // Init
  useEffect(() => {
    const checkSettings = async () => {
      const settings = await getSettings();
      if (settings && settings.maintenanceMode !== undefined) {
        setMaintenanceMode(settings.maintenanceMode);
      }
      // Fetch features
      const features = await getFeatures();
      setFeatureSettings(features);
    };
    checkSettings();
  }, []);

  // Fetch stats when entering dashboard
  useEffect(() => {
    if (view === ViewState.ADMIN && adminView === 'dashboard') {
        const loadStats = async () => {
             const stats = await getFeatureUsage();
             setFeatureStats(stats as Record<string, number>);
        };
        loadStats();
    }
  }, [view, adminView]);

  // Refresh features helper
  const fetchFeatures = async () => {
    const features = await getFeatures();
    setFeatureSettings(features);
  };

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
      // Use internal component
    },
    { 
      id: '2', 
      title: 'Video Kesedaran', 
      icon: Youtube, 
      color: 'text-[#E07A5F]',
      action: () => window.open('https://sites.google.com/moe-dl.edu.my/koleksi-video-antibuli/laman-utama', '_blank')
    },
    { 
      id: '3', 
      title: 'Cara Mengelak', 
      icon: ShieldAlert, 
      color: 'text-[#81B29A]',
      // Use internal component
    },
    { 
      id: '4', 
      title: 'Lagu Anti Buli', 
      icon: Music, 
      color: 'text-[#F2CC8F]',
      action: () => window.open('https://music.youtube.com/playlist?list=PLzh8AM9to4UBCc3fEP0e9jytGMTW1QJ2i&si=niNW6AZVJpErNn-c', '_blank')
    },
    { 
      id: '5', 
      title: 'Permainan', 
      icon: Gamepad2, 
      color: 'text-[#81B29A]',
      action: () => window.open('https://sites.google.com/moe-dl.edu.my/game-anti-buli-kitabuddy/laman-utama', '_blank')
    },
    { 
      id: '7', 
      title: 'Saya Nak Jadi Baik', 
      icon: Star, 
      color: 'text-[#F2CC8F]',
      action: () => window.open('https://lnk.bio/kitabuddy', '_blank')
    },
  ];

  const extraMenuItems: MenuItem[] = [
    { 
      id: 'web', 
      title: 'Laman Web', 
      icon: Home, 
      color: 'text-[#81B29A]',
      action: () => window.open('https://kitabuddy.my.canva.site/', '_blank')
    },
    { 
      id: 'padlet', 
      title: 'Padlet Sharing', 
      icon: StickyNote, 
      color: 'text-[#F2CC8F]',
      action: () => window.open('https://padlet.com/arfansyahmimuhammadazmi/apa-yang-anda-pelajari-tzg937penpjgv70i', '_blank')
    },
    { 
      id: 'chat', 
      title: 'Berbual Bersama Budi', 
      icon: MessageCircleHeart, 
      color: 'text-[#E07A5F]',
      action: () => window.open('https://character.ai/chat/MTBBbDV5aZMXYA2b8o-K7dOJn5Wxteci7Of68s11ieM', '_blank')
    },
    { 
      id: 'hukuman', 
      title: 'Hukuman Membuli', 
      icon: Gavel, 
      color: 'text-[#3D405B]',
      action: () => window.open('https://sites.google.com/moe-dl.edu.my/kitabuddy-hukuman-sang-pembuli/laman-utama', '_blank')
    },
    { 
      id: 'talian', 
      title: 'Talian Hayat', 
      icon: HeartHandshake, 
      color: 'text-[#E07A5F]',
      action: () => window.open('https://linktr.ee/emaslahat', '_blank')
    },
    { 
      id: 'sos', 
      title: 'SOS BULI (SPDB)', 
      icon: Siren, 
      color: 'text-red-500 animate-pulse',
      action: () => window.open('https://s-a-f-e-smart-reporting.onrender.com', '_blank')
    },
  ];

  const handleFeatureClick = (item: MenuItem) => {
    // Track usage immediately (live data)
    incrementFeatureUsage(item.id);

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
    if (!loginForm.id || !loginForm.password) {
      setLoginError("Sila masukkan ID dan Kata Laluan");
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const user = await loginUser(loginForm.id, loginForm.password);
      
      if (user) {
        // Check maintenance
        if (maintenanceMode && !maintenanceBypass && !user.role.toLowerCase().includes('admin')) {
          setLoginError("Sistem dalam penyelenggaraan.");
          setIsLoggingIn(false);
          return;
        }

        setUserRole(user.role);
        setUserName(user.name);
        setView(ViewState.MENU);
      } else {
        setLoginError("ID atau Kata Laluan salah. Sila cuba lagi.");
      }
    } catch (error) {
      setLoginError("Ralat sambungan. Sila semak internet anda.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setLoginForm({ id: '', password: '' });
    setUserRole('');
    setUserName('');
    setAdminPin('');
    setIsAdminUnlocked(false);
    setMaintenanceBypass(false); 
    setView(ViewState.LANDING);
  };

  const handleAdminUnlock = () => {
    if (adminPin === '21412141') {
      setIsAdminUnlocked(true);
      setAdminError('');
      fetchReports();
      fetchFeatures();
    } else {
      setAdminError('Pin Induk tidak sah. Sila cuba lagi.');
    }
  };

  // --- User Management ---
  const fetchUsersList = async () => {
    setLoadingUsers(true);
    try {
      const users = await getUsers();
      setUsersList(users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addUser(newUser);
    if (success) {
      setShowAddUser(false);
      setNewUser({ name: '', studentId: '', password: '', role: 'student' });
      fetchUsersList();
    }
  };

  const handleDeleteUser = async (docId: string) => {
    if (window.confirm("Adakah anda pasti mahu memadam pengguna ini?")) {
      await deleteUser(docId);
      fetchUsersList();
    }
  };

  const handleUpdateRole = async (docId: string, newRole: string) => {
    const success = await updateUserRole(docId, newRole);
    if (success) {
      setUsersList(prev => prev.map(u => u.docId === docId ? {...u, role: newRole} : u));
    }
  };

  // --- Report Management ---
  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const reports = await getReports();
      setReportsList(reports);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addReport(newReport);
    if (success) {
      setShowAddReport(false);
      setNewReport({ student: '', class: '', issue: '', status: 'Baru' });
      fetchReports();
    }
  };

  const handleUpdateReportStatus = async (docId: string, status: string) => {
    await updateReport(docId, { status });
    setReportsList(prev => prev.map(r => r.id === docId ? {...r, status} : r));
  };

  const handleDeleteReport = async (docId: string) => {
    if (window.confirm("Padam laporan ini?")) {
      await deleteReport(docId);
      fetchReports();
    }
  };

  // --- Feature Management & Backend PIN ---
  
  const openEditFeature = (item: MenuItem) => {
    const existing = featureSettings[item.id] || {};
    setEditingFeature({
      id: item.id,
      title: existing.title || item.title,
      status: existing.status || 'Active',
      message: existing.message || ''
    });
    setShowEditFeature(true);
  };

  const handleSaveFeatureRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;
    
    // Stage the update and ask for PIN
    setPendingFeatureUpdate({
      id: editingFeature.id,
      data: {
        title: editingFeature.title,
        status: editingFeature.status,
        message: editingFeature.message
      }
    });
    setShowEditFeature(false);
    setBackendPinInput('');
    setBackendPinError('');
    setShowBackendPinModal(true);
  };

  const verifyBackendPin = async () => {
    if (backendPinInput === '090713040013') {
      if (pendingFeatureUpdate) {
        await updateFeature(pendingFeatureUpdate.id, pendingFeatureUpdate.data);
        await fetchFeatures();
        setShowBackendPinModal(false);
        setPendingFeatureUpdate(null);
      }
    } else {
      setBackendPinError("PIN tidak sah!");
    }
  };

  // --- Maintenance ---
  const verifyMaintenancePin = () => {
    if (maintenancePinInput === '040013') {
      setMaintenanceBypass(true);
      setShowMaintenanceLogin(false);
      setMaintenancePinInput('');
    } else {
      alert("Pin tidak sah!");
    }
  };

  const handleToggleMaintenance = async () => {
    const newState = !maintenanceMode;
    const success = await toggleMaintenanceMode(newState);
    if (success) setMaintenanceMode(newState);
  };

  // --- Renderers ---

  const renderMaintenanceScreen = () => (
    <div className="fixed inset-0 bg-[#3D405B] z-[100] flex flex-col items-center justify-center p-6 text-white text-center">
       {!showMaintenanceLogin ? (
         <>
            <div className="w-32 h-32 bg-[#E07A5F] rounded-full flex items-center justify-center mb-8 animate-pulse">
               <Wrench size={64} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-fredoka mb-4">PENYELENGGARAAN</h1>
            <p className="text-xl text-white/60 font-nunito max-w-lg mb-12">
              Sistem sedang dinaik taraf untuk pengalaman yang lebih baik. Sila cuba sebentar lagi.
            </p>
            <button 
              onClick={() => setShowMaintenanceLogin(true)}
              className="bg-white/10 hover:bg-white/20 text-sm font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
            >
              <Lock size={16} /> Akses Staf
            </button>
         </>
       ) : (
         <div className="bg-white text-[#3D405B] p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-fade-in-up">
             <h3 className="text-2xl font-bold mb-4">Bypass Penyelenggaraan</h3>
             <input 
               type="password" 
               value={maintenancePinInput}
               onChange={(e) => setMaintenancePinInput(e.target.value)}
               className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl p-4 text-center text-2xl font-bold mb-4 outline-none focus:border-[#E07A5F]"
               placeholder="PIN (******)"
               maxLength={6}
             />
             <div className="flex gap-2">
               <button onClick={() => setShowMaintenanceLogin(false)} className="flex-1 py-3 bg-slate-200 rounded-xl font-bold">Batal</button>
               <button onClick={verifyMaintenancePin} className="flex-1 py-3 bg-[#E07A5F] text-white rounded-xl font-bold shadow-lg">Masuk</button>
             </div>
         </div>
       )}
    </div>
  );

  const renderLanding = () => (
    <div className="min-h-screen bg-aesthetic-pattern flex items-center justify-center p-6 relative overflow-hidden">
      
      <div className="max-w-5xl w-full animate-fade-in flex flex-col items-center relative z-10">
        
        {/* Main Clean Card */}
        <div className="glass-panel w-full rounded-[3rem] shadow-2xl p-8 md:p-16 relative flex flex-col md:flex-row items-center gap-12 overflow-hidden bg-white">
           
           {/* Content Side */}
           <div className="flex-1 text-center md:text-left space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#81B29A]/10 text-[#81B29A] rounded-full text-sm font-bold tracking-wider mb-2">
                <Sparkles size={16} />
                <span className="uppercase">Edisi 2026</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-black text-[#3D405B] leading-tight tracking-tight">
                  KITABUDDY
                </h1>
                <h2 className="text-3xl md:text-5xl font-bold text-[#E07A5F] tracking-tight">
                  #JOMCEGAH BULI
                </h2>
              </div>

              {/* The "Sticky Note" Content */}
              <div className="bg-[#F4F1DE] border-l-4 border-[#81B29A] p-6 rounded-r-2xl text-[#3D405B] max-w-md mx-auto md:mx-0 text-lg font-medium leading-relaxed shadow-sm">
                 "PENCEGAHAN BULI ERA BAHARU BERMULA DI SINI!"
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setView(ViewState.LOGIN)}
                  className="group bg-[#E07A5F] text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-[#E07A5F]/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 mx-auto md:mx-0"
                >
                  <UserCircle size={24} />
                  Log Masuk
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
           </div>

           {/* Visual Side - Abstract Composition */}
           <div className="w-full md:w-1/3 flex justify-center relative">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                 <div className="absolute inset-0 bg-[#F2CC8F] rounded-full opacity-20 animate-pulse"></div>
                 <div className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center z-10 border-8 border-[#Fdfbf7]">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#E07A5F] to-[#F2CC8F] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-inner rotate-3 text-white">
                        <School size={48} />
                      </div>
                      <span className="block font-black text-2xl text-[#3D405B]">KITA</span>
                      <span className="block font-medium text-xl text-[#81B29A]">BUDDY</span>
                    </div>
                 </div>
                 {/* Floating elements */}
                 <div className="absolute top-0 right-0 bg-white p-3 rounded-2xl shadow-lg text-[#E07A5F] animate-bounce" style={{animationDuration: '3s'}}>
                    <HeartHandshake size={24} />
                 </div>
                 <div className="absolute bottom-4 left-0 bg-white p-3 rounded-2xl shadow-lg text-[#81B29A] animate-bounce" style={{animationDuration: '4s'}}>
                    <ShieldAlert size={24} />
                 </div>
              </div>
           </div>

        </div>
        
        <div className="mt-8 text-[#3D405B]/60 text-xs font-bold font-nunito tracking-widest uppercase text-center space-y-1">
          <p>© 2025 HAK CIPTA TERPELIHARA SM SAINS MUZAFFAR SYAH</p>
          <p>DIBANGUNKAN OLEH: MUHAMMAD ARFAN</p>
        </div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen bg-aesthetic-pattern flex items-center justify-center p-6">
      <div className="max-w-4xl w-full animate-fade-in-up">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Side - Decorative */}
          <div className="md:w-5/12 bg-[#F4F1DE] p-10 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#E07A5F_1px,transparent_1px)] [background-size:16px_16px]"></div>
             
             <div className="relative z-10">
               <button onClick={() => setView(ViewState.LANDING)} className="text-[#3D405B] hover:text-[#E07A5F] transition-colors flex items-center gap-2 font-bold mb-8">
                 <ArrowLeft size={20} /> Kembali
               </button>
               <h2 className="text-3xl font-black text-[#3D405B] leading-tight mb-2">Selamat Kembali!</h2>
               <p className="text-[#81B29A] font-bold">Log masuk untuk teruskan.</p>
             </div>

             <div className="relative z-10 text-center mt-8">
                <div className="w-32 h-32 bg-white rounded-full shadow-xl mx-auto flex items-center justify-center text-[#E07A5F] mb-6 animate-bounce">
                   <UserCircle size={64} />
                </div>
             </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-7/12 p-10 md:p-16 flex flex-col justify-center bg-white">
             <div className="mb-8">
               <h3 className="text-2xl font-bold text-[#3D405B] mb-1 font-fredoka">Akaun Pelajar</h3>
               <p className="text-slate-400 text-sm font-nunito">Sila masukkan maklumat anda.</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-[#3D405B] uppercase tracking-wider ml-1">ID Pengguna</label>
                   <div className="relative">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <UserCircle size={20} />
                     </div>
                     <input 
                       type="text" 
                       value={loginForm.id}
                       onChange={(e) => setLoginForm({...loginForm, id: e.target.value})}
                       className="w-full bg-[#Fdfbf7] border-2 border-stone-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#3D405B] outline-none focus:border-[#81B29A] focus:bg-white transition-all"
                       placeholder="Nama / ID Pelajar"
                     />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-[#3D405B] uppercase tracking-wider ml-1">Kata Laluan</label>
                   <div className="relative">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Key size={20} />
                     </div>
                     <input 
                       type="password" 
                       value={loginForm.password}
                       onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                       className="w-full bg-[#Fdfbf7] border-2 border-stone-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#3D405B] outline-none focus:border-[#81B29A] focus:bg-white transition-all"
                       placeholder="••••••••"
                     />
                   </div>
                </div>

                {loginError && (
                  <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl flex items-center gap-2">
                    <ShieldAlert size={16} /> {loginError}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-[#81B29A] hover:bg-[#6da388] text-white text-lg font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                   {isLoggingIn ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                   {isLoggingIn ? 'Sedang Menyemak...' : 'Log Masuk Sekarang'}
                </button>
             </form>
          </div>

        </div>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="min-h-screen bg-aesthetic-pattern p-6 md:p-12 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header for Admin Page */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setView(ViewState.MENU)}
               className="p-3 bg-white rounded-full shadow-sm text-slate-400 hover:text-[#E07A5F] transition-colors"
             >
               <ArrowLeft size={24} />
             </button>
             <h2 className="text-3xl font-black text-[#3D405B] font-fredoka">Admin Console</h2>
           </div>
           {maintenanceMode && (
             <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 animate-pulse">
               <Wrench size={16} /> Maintenance Active
             </div>
           )}
        </div>

        {!isAdminUnlocked ? (
            <div className="max-w-md mx-auto mt-20 bg-white rounded-[2.5rem] p-10 shadow-2xl text-center border border-slate-100">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                    <Lock size={40} />
                </div>
                <h3 className="text-2xl font-black font-fredoka text-[#3D405B] mb-2">Akses Terhad</h3>
                <p className="text-slate-500 font-nunito mb-8">Sila masukkan Pin Induk untuk mengakses panel admin.</p>
                
                <div className="space-y-4">
                    <input 
                        type="password" 
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        placeholder="Pin Induk"
                        className="w-full bg-[#Fdfbf7] border-2 border-stone-100 rounded-xl py-4 px-4 font-bold text-center text-2xl tracking-widest focus:border-[#E07A5F] outline-none text-[#3D405B]"
                        maxLength={8}
                    />
                    {adminError && <p className="text-red-500 text-sm font-bold">{adminError}</p>}
                    <button 
                        onClick={handleAdminUnlock}
                        className="w-full bg-[#3D405B] text-white font-bold py-4 rounded-xl hover:bg-[#2a2c3f] transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Unlock size={20} /> Buka Akses
                    </button>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="md:w-64 bg-[#3D405B] p-6 text-white flex flex-col">
                    <div className="flex items-center gap-3 mb-10 px-2">
                       <div className="w-10 h-10 bg-[#E07A5F] rounded-xl flex items-center justify-center shadow-lg">
                          <Settings size={20} />
                       </div>
                       <div>
                          <p className="font-bold leading-tight">Admin</p>
                          <p className="text-xs text-white/50">Panel</p>
                       </div>
                    </div>

                    <nav className="space-y-2 flex-1">
                       <button 
                         onClick={() => setAdminView('dashboard')}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${adminView === 'dashboard' ? 'bg-[#E07A5F] text-white shadow-lg' : 'hover:bg-white/10 text-white/70'}`}
                       >
                          <Activity size={20} /> Dashboard
                       </button>
                       <button 
                         onClick={() => { setAdminView('users'); fetchUsersList(); }}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${adminView === 'users' ? 'bg-[#E07A5F] text-white shadow-lg' : 'hover:bg-white/10 text-white/70'}`}
                       >
                          <Users size={20} /> Pengguna
                       </button>
                       <button 
                         onClick={() => { setAdminView('reports'); fetchReports(); }}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${adminView === 'reports' ? 'bg-[#E07A5F] text-white shadow-lg' : 'hover:bg-white/10 text-white/70'}`}
                       >
                          <FileText size={20} /> Laporan
                       </button>
                       <button 
                         onClick={() => { setAdminView('features'); fetchFeatures(); }}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${adminView === 'features' ? 'bg-[#E07A5F] text-white shadow-lg' : 'hover:bg-white/10 text-white/70'}`}
                       >
                          <Layers size={20} /> Pengurusan Ciri
                       </button>
                       <button 
                         onClick={() => setAdminView('settings')}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${adminView === 'settings' ? 'bg-[#E07A5F] text-white shadow-lg' : 'hover:bg-white/10 text-white/70'}`}
                       >
                          <Wrench size={20} /> Tetapan
                       </button>
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/10">
                       <div className="px-4">
                          <p className="text-xs text-white/50 font-bold uppercase mb-1">Logged in as</p>
                          <p className="font-bold truncate">{loginForm.id}</p>
                       </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 bg-[#Fdfbf7] overflow-y-auto max-h-[80vh]">
                   
                   {/* DASHBOARD VIEW */}
                   {adminView === 'dashboard' && (
                      <div className="space-y-8 animate-fade-in">
                          <h3 className="text-2xl font-black text-[#3D405B] font-fredoka">Ringkasan Analytics</h3>
                          
                          {/* Quick Stats */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Users size={24} /></div>
                                    <span className="font-bold text-slate-400 text-sm uppercase">Total Users</span>
                                </div>
                                <p className="text-3xl font-black text-[#3D405B]">{usersList.length || 'Loading...'}</p>
                             </div>
                             
                             {/* SOS Engagement Card (Replaces Active Reports) */}
                             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Siren size={24} /></div>
                                    <span className="font-bold text-slate-400 text-sm uppercase">SOS Engagement</span>
                                </div>
                                <p className="text-3xl font-black text-[#3D405B]">{featureStats['sos'] || 0}</p>
                                <p className="text-xs text-slate-400 font-bold mt-2">Total Clicks</p>
                             </div>

                             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl"><Activity size={24} /></div>
                                    <span className="font-bold text-slate-400 text-sm uppercase">System Status</span>
                                </div>
                                <p className={`text-lg font-black ${maintenanceMode ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {maintenanceMode ? 'Maintenance' : 'Operational'}
                                </p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Live Analytics: Feature Usage */}
                              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                  <h4 className="font-bold text-[#3D405B] mb-6 flex items-center gap-2"><BarChart3 size={18}/> Most Chosen Features (Live)</h4>
                                  <div className="space-y-4">
                                      {Object.entries(featureStats).length > 0 ? (
                                          Object.entries(featureStats)
                                          .sort(([,a], [,b]) => (b as number) - (a as number))
                                          .slice(0, 4)
                                          .map(([id, count], idx) => {
                                              const item = [...mainMenuItems, ...extraMenuItems].find(i => i.id === id);
                                              const title = item?.title || id;
                                              const total = (Object.values(featureStats) as number[]).reduce((a, b) => a + b, 0);
                                              const percentage = total > 0 ? Math.round(((count as number) / total) * 100) : 0;
                                              
                                              const colors = ['bg-[#E07A5F]', 'bg-[#81B29A]', 'bg-[#F2CC8F]', 'bg-blue-300'];
                                              const color = colors[idx % colors.length];

                                              return (
                                                  <div key={id}>
                                                      <div className="flex justify-between text-sm font-bold text-slate-500 mb-1">
                                                          <span>{title}</span>
                                                          <span>{percentage}% ({count})</span>
                                                      </div>
                                                      <div className="w-full bg-slate-100 rounded-full h-3">
                                                          <div className={`h-3 rounded-full ${color}`} style={{width: `${percentage}%`}}></div>
                                                      </div>
                                                  </div>
                                              );
                                          })
                                      ) : (
                                           <div className="text-center py-4 text-slate-400 font-bold text-sm">
                                               Tiada data penggunaan direkodkan.
                                           </div>
                                      )}
                                  </div>
                              </div>

                              {/* Mock Analytics: Usage Trend */}
                              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                                   <h4 className="font-bold text-[#3D405B] mb-6 flex items-center gap-2"><Activity size={18}/> Usage Trend (7 Days)</h4>
                                   <div className="flex-1 flex items-end justify-between gap-2 px-4">
                                       {[40, 65, 35, 90, 50, 75, 60].map((h, i) => (
                                           <div key={i} className="w-full bg-[#3D405B] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity relative group" style={{height: `${h}%`}}>
                                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h}</div>
                                           </div>
                                       ))}
                                   </div>
                                   <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
                                       <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                   </div>
                              </div>
                          </div>
                      </div>
                   )}

                   {/* USERS VIEW */}
                   {adminView === 'users' && (
                      <div className="space-y-6 animate-fade-in">
                         <div className="flex justify-between items-center">
                           <h3 className="text-2xl font-black text-[#3D405B] font-fredoka">Pengurusan Pengguna</h3>
                           <div className="flex gap-2">
                               <button onClick={() => setShowAddUser(true)} className="bg-[#81B29A] hover:bg-[#6da388] text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-colors">
                                   <Plus size={18} /> Tambah
                               </button>
                               <button onClick={fetchUsersList} className="p-2 bg-white text-[#3D405B] rounded-full shadow-sm hover:bg-slate-50">
                                   <Activity size={20} className={loadingUsers ? 'animate-spin' : ''}/>
                               </button>
                           </div>
                         </div>

                         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Pelajar</th>
                                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Peranan</th>
                                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Tindakan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                           {usersList.map((user) => (
                                               <tr key={user.docId} className="hover:bg-[#Fdfbf7] transition-colors">
                                                   <td className="p-4">
                                                       <div className="flex items-center gap-3">
                                                           <div className="w-8 h-8 bg-[#E07A5F]/10 text-[#E07A5F] rounded-full flex items-center justify-center font-bold text-xs">
                                                               <UserCircle size={16} />
                                                           </div>
                                                           <span className="font-bold text-[#3D405B]">{user.name || user.StudentName || 'Unknown'}</span>
                                                       </div>
                                                   </td>
                                                   <td className="p-4 font-mono text-sm text-slate-500">{user.studentId}</td>
                                                   <td className="p-4">
                                                       <select 
                                                            value={user.role || 'student'}
                                                            onChange={(e) => handleUpdateRole(user.docId, e.target.value)}
                                                            className="bg-white border border-slate-200 text-[#3D405B] text-sm font-bold rounded-lg px-3 py-1 outline-none focus:border-[#E07A5F] focus:ring-2 focus:ring-[#E07A5F]/20 transition-all"
                                                        >
                                                            <option value="student">Student</option>
                                                            <option value="admin">Admin</option>
                                                            <option value="super admin">Super Admin</option>
                                                        </select>
                                                   </td>
                                                   <td className="p-4 text-right">
                                                       <button onClick={() => handleDeleteUser(user.docId)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
                                                           <Trash2 size={18} />
                                                       </button>
                                                   </td>
                                               </tr>
                                           ))}
                                        </tbody>
                                    </table>
                                </div>
                                {usersList.length === 0 && !loadingUsers && (
                                     <div className="p-8 text-center text-slate-400 font-bold">Tiada pengguna dijumpai.</div>
                                )}
                         </div>
                      </div>
                   )}

                   {/* REPORTS VIEW */}
                   {adminView === 'reports' && (
                      <div className="space-y-6 animate-fade-in">
                         <div className="flex justify-between items-center">
                           <h3 className="text-2xl font-black text-[#3D405B] font-fredoka">Pengurusan Laporan</h3>
                           <div className="flex gap-2">
                               <button onClick={() => setShowAddReport(true)} className="bg-[#E07A5F] hover:bg-[#c96246] text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-colors">
                                   <Plus size={18} /> Laporan Baru
                               </button>
                               <button onClick={fetchReports} className="p-2 bg-white text-[#3D405B] rounded-full shadow-sm hover:bg-slate-50">
                                   <Activity size={20} className={loadingReports ? 'animate-spin' : ''}/>
                               </button>
                           </div>
                         </div>
                         
                         <div className="grid grid-cols-1 gap-4">
                            {reportsList.map((report) => (
                                <div key={report.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                report.status === 'Baru' ? 'bg-red-100 text-red-600' : 
                                                report.status === 'Siasatan' ? 'bg-orange-100 text-orange-600' : 
                                                'bg-green-100 text-green-600'
                                            }`}>
                                                {report.status}
                                            </span>
                                            <span className="text-xs text-slate-400 font-bold">{report.date}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-[#3D405B]">{report.student} <span className="text-sm font-normal text-slate-400">({report.class})</span></h4>
                                        <p className="text-[#E07A5F] font-medium">{report.issue}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select 
                                            value={report.status} 
                                            onChange={(e) => handleUpdateReportStatus(report.id, e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-[#3D405B] outline-none"
                                        >
                                            <option value="Baru">Baru</option>
                                            <option value="Siasatan">Siasatan</option>
                                            <option value="Selesai">Selesai</option>
                                        </select>
                                        <button onClick={() => handleDeleteReport(report.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {reportsList.length === 0 && !loadingReports && (
                                <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-3xl border border-stone-100">Tiada laporan semasa.</div>
                            )}
                         </div>
                      </div>
                   )}

                   {/* FEATURE MANAGEMENT VIEW */}
                   {adminView === 'features' && (
                     <div className="space-y-6 animate-fade-in">
                        <h3 className="text-2xl font-black text-[#3D405B] font-fredoka">Pengurusan Ciri</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[...mainMenuItems, ...extraMenuItems].map(item => {
                            const settings = featureSettings[item.id] || {};
                            const status = settings.status || 'Active';
                            const displayTitle = settings.title || item.title;

                            return (
                              <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center ${item.color}`}>
                                     <item.icon size={24} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-[#3D405B]">{displayTitle}</h4>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase ${
                                      status === 'Active' ? 'bg-green-100 text-green-600' : 
                                      status === 'Maintenance' ? 'bg-red-100 text-red-600' : 
                                      'bg-orange-100 text-orange-600'
                                    }`}>
                                      {status}
                                    </span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => openEditFeature(item)}
                                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                >
                                  <Edit size={18} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                     </div>
                   )}

                   {/* SETTINGS VIEW */}
                   {adminView === 'settings' && (
                      <div className="space-y-6 animate-fade-in">
                          <h3 className="text-2xl font-black text-[#3D405B] font-fredoka">Tetapan Sistem</h3>
                          
                          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                              <div className="flex items-center justify-between">
                                  <div>
                                      <h4 className="text-xl font-bold text-[#3D405B] mb-2 flex items-center gap-2">
                                          <Wrench size={24} className="text-[#81B29A]" />
                                          Maintenance Mode
                                      </h4>
                                      <p className="text-slate-500 text-sm max-w-md">
                                          Aktifkan mod penyelenggaraan untuk menghalang akses pelajar sementara waktu.
                                          Pin lalai untuk bypass: <strong>040013</strong>
                                      </p>
                                  </div>
                                  <button 
                                    onClick={handleToggleMaintenance}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-[#E07A5F]' : 'bg-slate-200'}`}
                                  >
                                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition shadow-md ${maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
                                  </button>
                              </div>
                              {maintenanceMode && (
                                  <div className="mt-6 p-4 bg-orange-50 text-orange-700 rounded-xl text-sm font-bold border border-orange-100 flex items-center gap-3">
                                      <AlertTriangle size={20} />
                                      Sistem kini dalam mod penyelenggaraan. Hanya Admin atau pengguna dengan PIN boleh akses.
                                  </div>
                              )}
                          </div>
                      </div>
                   )}
                </div>
            </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-2xl font-black text-[#3D405B] mb-6">Tambah Pengguna Baru</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <input type="text" placeholder="Nama Penuh" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full p-4 rounded-xl bg-[#Fdfbf7] border-2 border-slate-100 font-bold text-[#3D405B] outline-none focus:border-[#81B29A]"/>
                    <input type="text" placeholder="ID Pelajar" required value={newUser.studentId} onChange={e => setNewUser({...newUser, studentId: e.target.value})} className="w-full p-4 rounded-xl bg-[#Fdfbf7] border-2 border-slate-100 font-bold text-[#3D405B] outline-none focus:border-[#81B29A]"/>
                    <input type="password" placeholder="Kata Laluan (Default: 123456)" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full p-4 rounded-xl bg-[#Fdfbf7] border-2 border-slate-100 font-bold text-[#3D405B] outline-none focus:border-[#81B29A]"/>
                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full p-4 rounded-xl bg-[#Fdfbf7] border-2 border-slate-100 font-bold text-[#3D405B] outline-none focus:border-[#81B29A]">
                        <option value="student">Pelajar</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowAddUser(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-200">Batal</button>
                        <button type="submit" className="flex-1 py-3 bg-[#81B29A] text-white rounded-xl font-bold hover:bg-[#6da388] shadow-lg">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Add Report Modal */}
      {showAddReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-2xl font-black text-[#3D405B] mb-6">Laporan Insiden Baru</h3>
                <form onSubmit={handleAddReport} className="space-y-4">
                    <input type="text" placeholder="Nama Pelajar Terlibat" required value={newReport.student} onChange={e => setNewReport({...newReport, student: e.target.value})} className="w-full p-4 rounded-xl bg-[#Fdfbf7] border-2 border-slate-100 font-bold text-[#3D405B] outline-none focus:border-[#E07A5F]"/>
                    <input type="text" placeholder="Kelas" required value={newReport.class} onChange={e => setNewReport({...newReport, class: e.target.value})} className="w-full p-4 rounded-xl bg-[#Fdfbf7] border-2 border-slate-100 font-bold text-[#3D405B] outline-none focus:border-[#E07A5F]"/>
                    <textarea placeholder="Jenis Kesalahan / Isu" required value={newReport.issue} onChange={e => setNewReport({...newReport, issue: e.target.value})} className="w-full p-4 rounded-xl bg-[#Fdfbf7] border-2 border-slate-100 font-bold text-[#3D405B] outline-none focus:border-[#E07A5F] h-32 resize-none"></textarea>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowAddReport(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-200">Batal</button>
                        <button type="submit" className="flex-1 py-3 bg-[#E07A5F] text-white rounded-xl font-bold hover:bg-[#c96246] shadow-lg">Lapor</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Edit Feature Modal */}
      {showEditFeature && editingFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
             <h3 className="text-2xl font-black text-[#3D405B] mb-6">Kemaskini Ciri</h3>
             <form onSubmit={handleSaveFeatureRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Nama Ciri</label>
                  <input 
                    type="text" 
                    value={editingFeature.title} 
                    onChange={e => setEditingFeature({...editingFeature, title: e.target.value})}
                    className="w-full p-3 mt-1 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#3D405B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                  <select 
                    value={editingFeature.status}
                    onChange={e => setEditingFeature({...editingFeature, status: e.target.value})}
                    className="w-full p-3 mt-1 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#3D405B]"
                  >
                    <option value="Active">Active</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Mesej (Popup)</label>
                  <textarea 
                    value={editingFeature.message} 
                    onChange={e => setEditingFeature({...editingFeature, message: e.target.value})}
                    className="w-full p-3 mt-1 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[#3D405B] h-24 resize-none"
                    placeholder="Mesej untuk dipaparkan jika status bukan Active..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowEditFeature(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-200">Batal</button>
                    <button type="submit" className="flex-1 py-3 bg-[#3D405B] text-white rounded-xl font-bold hover:bg-[#2a2c3f] shadow-lg flex items-center justify-center gap-2">
                      <Save size={18} /> Simpan
                    </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Backend PIN Modal */}
      {showBackendPinModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[80] p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center border-4 border-slate-200">
             <div className="w-20 h-20 bg-[#3D405B] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
               <Lock size={32} />
             </div>
             <h3 className="text-xl font-black text-[#3D405B] mb-2">Security Check</h3>
             <p className="text-slate-400 text-sm mb-6">Backend PIN diperlukan untuk pengubahsuaian sistem.</p>
             
             <input 
                type="password" 
                value={backendPinInput}
                onChange={(e) => setBackendPinInput(e.target.value)}
                className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl p-4 text-center text-xl font-bold mb-2 outline-none focus:border-[#3D405B]"
                placeholder="Backend PIN"
             />
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Hint: IC.D</div>
             
             {backendPinError && (
               <div className="bg-red-50 text-red-500 text-sm font-bold p-2 rounded-lg mb-4">
                 {backendPinError}
               </div>
             )}

             <div className="flex gap-2">
               <button onClick={() => { setShowBackendPinModal(false); setPendingFeatureUpdate(null); }} className="flex-1 py-3 bg-slate-200 rounded-xl font-bold text-slate-600">Batal</button>
               <button onClick={verifyBackendPin} className="flex-1 py-3 bg-[#3D405B] text-white rounded-xl font-bold shadow-lg">Sahkan</button>
             </div>
          </div>
        </div>
      )}

      {/* Feature Status Modal (Coming Soon / Maintenance) */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[50] p-4 animate-fade-in backdrop-blur-sm">
           <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center relative">
              <button onClick={() => setShowFeatureModal(false)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500">
                <X size={24} />
              </button>
              <div className="w-24 h-24 bg-[#F2CC8F]/20 text-[#F2CC8F] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                 <Sparkles size={40} />
              </div>
              <h3 className="text-2xl font-black text-[#3D405B] mb-3 font-fredoka">{featureModalContent.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                {featureModalContent.message}
              </p>
              <button 
                onClick={() => setShowFeatureModal(false)}
                className="w-full py-3 bg-[#81B29A] text-white rounded-xl font-bold hover:bg-[#6da388] shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Baiklah
              </button>
           </div>
        </div>
      )}
    </div>
  );

  const renderMenu = () => {
    // Feature Routing
    if (selectedFeature === '1') {
      return <DefinisiBuli onBack={() => setSelectedFeature(null)} />;
    }
    if (selectedFeature === '3') {
      return <CaraMengelak onBack={() => setSelectedFeature(null)} />;
    }

    // Fallback for other features (e.g. placeholders or admin testing)
    if (selectedFeature) {
        return (
            <div className="min-h-screen bg-[#Fdfbf7] flex flex-col animate-fade-in">
            <div className="bg-white p-4 shadow-sm border-b border-stone-100 flex items-center gap-4 sticky top-0 z-20">
                <button onClick={() => setSelectedFeature(null)} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-[#3D405B]">
                <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold text-[#3D405B] font-fredoka truncate">
                {featureSettings[selectedFeature]?.title || "Feature"}
                </h2>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-300">
                <School size={48} />
                </div>
                <h3 className="text-xl font-bold text-[#3D405B] mb-2">Kandungan Sedang Dibangunkan</h3>
                <p className="text-slate-400">Modul ini akan datang tidak lama lagi.</p>
            </div>
            </div>
        );
    }

    return (
      <div className="min-h-screen bg-aesthetic-pattern p-6 pb-24 md:p-10 animate-fade-in">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-sm border border-white/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E07A5F] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                {(userName || loginForm.id).charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-black text-[#3D405B] font-fredoka leading-none">
                  Hai, {userName ? userName.split(' ')[0] : loginForm.id}!
                </h2>
                <p className="text-xs font-bold text-[#81B29A] uppercase tracking-wider mt-1">Pelajar Hebat</p>
              </div>
            </div>
            <div className="flex gap-2">
              {userRole && userRole.toLowerCase().includes('admin') && (
                <button onClick={() => setView(ViewState.ADMIN)} className="bg-[#3D405B] text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform">
                  <Settings size={20} />
                </button>
              )}
              <button onClick={handleLogout} className="bg-red-50 text-red-500 p-3 rounded-full shadow-sm hover:bg-red-100 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-black text-[#3D405B] font-fredoka mb-4 px-2">Aktiviti Utama</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mainMenuItems.map((item) => {
                const setting = featureSettings[item.id];
                const title = setting?.title || item.title;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleFeatureClick(item)}
                    className="group bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-[#Fdfbf7] flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shadow-inner`}>
                      <item.icon size={32} />
                    </div>
                    <span className="font-bold text-[#3D405B] text-sm md:text-base leading-tight px-2">{title}</span>
                    
                    {/* Status Badge if not Active */}
                    {setting && setting.status !== 'Active' && (
                       <div className="absolute top-2 right-2">
                          {setting.status === 'Coming Soon' && <div className="bg-yellow-100 text-yellow-600 p-1 rounded-full"><Sparkles size={12} /></div>}
                          {setting.status === 'Maintenance' && <div className="bg-red-100 text-red-600 p-1 rounded-full"><Wrench size={12} /></div>}
                       </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-[#3D405B] font-fredoka mb-4 px-2">Pautan Pantas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {extraMenuItems.map((item) => {
                const setting = featureSettings[item.id];
                const title = setting?.title || item.title;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleFeatureClick(item)}
                    className={`bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4 hover:shadow-md transition-all text-left group ${item.id === 'sos' ? 'bg-red-50 border-red-100' : ''}`}
                  >
                    <div className={`p-3 rounded-xl ${item.id === 'sos' ? 'bg-white text-red-500 shadow-sm' : 'bg-stone-50 ' + item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon size={20} />
                    </div>
                    <span className={`font-bold text-sm flex-1 ${item.id === 'sos' ? 'text-red-600' : 'text-[#3D405B]'}`}>{title}</span>
                    
                    {/* Status Icon */}
                    {setting && setting.status !== 'Active' && (
                         <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-md text-slate-500 whitespace-nowrap">
                           {setting.status}
                         </span>
                    )}

                    {item.id !== 'sos' && (!setting || setting.status === 'Active') && (
                       <ArrowRight size={16} className="text-stone-300 group-hover:text-[#E07A5F] transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="mt-12 text-center">
             <p className="text-[#81B29A] font-fredoka text-sm opacity-60">#KITAJAGAKITA • SM SAINS MUZAFFAR SYAH</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {maintenanceMode && !maintenanceBypass && view !== ViewState.ADMIN && renderMaintenanceScreen()}
      {view === ViewState.LANDING && renderLanding()}
      {view === ViewState.LOGIN && renderLogin()}
      {view === ViewState.MENU && renderMenu()}
      {view === ViewState.ADMIN && renderAdmin()}
    </>
  );
};

export default App;
