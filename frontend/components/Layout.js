"use client";
import { useEffect, useState } from 'react'; 
import { useRouter, usePathname } from 'next/navigation'; 
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  LayoutDashboard, 
  ClipboardList, 
  ScanBarcode, 
  BarChart3, 
  ShoppingCart,
  Settings, 
  LogOut,
  PlusCircle
} from 'lucide-react';

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }));
    };
    updateTime();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('msu_user');
    if (!storedUser) {
      router.push('/login'); 
    } else {
      setUser(JSON.parse(storedUser));
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('msu_user');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={20}/> },
    { name: 'Inventory', href: '/inventory', icon: <ClipboardList size={20}/> },
    { name: 'Add Asset', href: '/add', icon: <PlusCircle size={20}/> },
    { name: 'Scanner', href: '/scanner', icon: <ScanBarcode size={20}/> },
    { name: 'Reports', href: '/reports', icon: <BarChart3 size={20}/> },
    { name: 'Market', href: '/market', icon: <ShoppingCart size={20}/> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20}/> },
  ];

  return (
    // Fixed container to prevent warping. bg-[#f5f5f4] ensures the background stays clean.
    <div className="flex h-screen w-full bg-[#f5f5f4] overflow-hidden antialiased text-slate-900">
      
      {/* SIDEBAR - Fixed width 16rem (w-64) */}
      <aside className="w-64 bg-[#800000] text-white flex flex-col shadow-2xl z-20 flex-shrink-0">
        <div className="p-6 text-[#FFD700] text-2xl font-black border-b border-[#4a0000] italic tracking-tighter">
          MSU <span className="block text-sm not-italic font-bold tracking-widest opacity-80 uppercase">Surplus Tracker</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                  isActive 
                    ? 'bg-[#4a0000] text-[#FFD700] shadow-inner' 
                    : 'hover:bg-[#4a0000]/50 hover:text-[#FFD700]'
                }`}
              >
                <span className={`${
                  isActive ? 'text-[#FFD700]' : 'text-[#FFD700]/60 group-hover:text-[#FFD700]'
                }`}>
                  {item.icon}
                </span>
                <span className={`font-bold text-sm tracking-tight ${isActive ? 'text-white' : ''}`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute right-4 w-1.5 h-1.5 bg-[#FFD700] rounded-full shadow-[0_0_8px_rgba(255,215,0,0.8)]" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#4a0000] space-y-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-xl hover:bg-black/20 hover:text-[#FFD700] transition-all text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <LogOut size={16} />
            Logout
          </button>
          <div className="px-4 py-1 text-[9px] uppercase tracking-[0.3em] text-[#FFD700]/30 font-black">
            Aretha & Harika © 2026
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER - Increased height for "Spacious" feel */}
        <header className="h-32 bg-white border-b-4 border-[#FFD700] flex items-center px-12 justify-between shadow-sm z-10 flex-shrink-0">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Current Section</span>
            <h2 className="font-black text-[#800000] text-3xl uppercase tracking-tighter italic">
              {menuItems.find(i => i.href === pathname)?.name || "System Overview"}
            </h2>
          </div>
          
          <div className="flex items-center gap-8">
             {user && (
               <div className="hidden md:flex flex-col items-end border-r pr-8 border-slate-100">
                 <p className="text-[9px] font-black text-[#800000] uppercase tracking-widest leading-none mb-1">
                   {user.role}
                 </p>
                 <div className="flex items-center gap-2">
                   <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                     {user.name} 
                   </span>
                   <span className="text-[10px] font-bold text-slate-300">
                     ({user.id})
                   </span>
                 </div>
               </div>
             )}

             <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-xs font-black text-[#800000] uppercase tracking-widest">
                    {currentTime || "Loading Date..."}
                </span>
             </div>
          </div>
        </header>

        {/* MAIN SCROLL AREA */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-12 bg-[#f5f5f4]">
          <AnimatePresence mode="wait">
            {isCheckingAuth ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full flex flex-col items-center justify-center"
              >
                <div className="text-[#800000]/10 text-8xl font-black italic mb-4 animate-pulse uppercase">
                  MSU
                </div>
                <div className="text-[#800000]/40 text-[11px] uppercase tracking-[0.5em] font-black">
                  Verifying Credentials
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={pathname} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-7xl mx-auto"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
