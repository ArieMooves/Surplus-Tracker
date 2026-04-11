"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ClipboardList, 
  ScanBarcode, 
  BarChart3, 
  Settings, 
  LogOut,
  PlusCircle
} from 'lucide-react';

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL path

  useEffect(() => {
    const user = localStorage.getItem('msu_user');
    if (!user) {
      router.push('/login'); 
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
    { name: 'Settings', href: '/settings', icon: <Settings size={20}/> },
  ];

  return (
    <div className="flex h-screen bg-stone-50">
      <aside className="w-64 bg-brand-maroon text-white flex flex-col shadow-2xl">
        <div className="p-6 text-brand-gold text-2xl font-black border-b border-brand-dark italic tracking-tighter">
          MSU SURPLUS
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            // Check if this item is the one we are currently viewing
            const isActive = pathname === item.href;

            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-brand-dark text-brand-gold shadow-inner' // Active Styles
                    : 'hover:bg-brand-dark hover:text-brand-gold'   // Inactive Styles
                }`}
              >
                <span className={`${
                  isActive ? 'text-brand-gold' : 'text-brand-gold/60 group-hover:text-brand-gold'
                } transition-colors`}>
                  {item.icon}
                </span>
                <span className={`font-semibold ${isActive ? 'text-white' : ''}`}>
                  {item.name}
                </span>
                
                {/* Visual Indicator: A small gold dot for the active tab */}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(214,172,80,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-dark space-y-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg hover:bg-black/20 hover:text-brand-gold transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
          <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-brand-gold/50 font-bold">
            Logged in as Admin
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b-4 border-brand-gold flex items-center px-8 justify-between shadow-sm">
          <h2 className="font-bold text-brand-maroon uppercase tracking-tight">
            {/* Dynamic Header Title based on path */}
            {menuItems.find(i => i.href === pathname)?.name || "System Overview"}
          </h2>
          <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-brand-maroon bg-brand-gold/20 px-3 py-1 rounded-full uppercase tracking-wider">
                April 2026
             </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
