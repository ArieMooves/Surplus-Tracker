"use client";
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
  // Define your menu items here for easy updates
  const menuItems = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={20}/> },
    { name: 'Inventory', href: '/inventory', icon: <ClipboardList size={20}/> },
    { name: 'Add Asset', href: '/add', icon: <PlusCircle size={20}/> },
    { name: 'Scanner', href: '/scanner', icon: <ScanBarcode size={20}/> },
    { name: 'Reports', href: '/reports', icon: <BarChart3 size={20}/> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20}/> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl">
        <div className="p-6 text-white text-xl font-bold border-b border-slate-800">
          MSU Surplus
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-all group"
            >
              <span className="text-slate-400 group-hover:text-green-400">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={() => console.log("Logging out...")}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-all text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
          <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
            Logged in as Admin
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between shadow-sm">
          <h2 className="font-semibold text-gray-700">System Overview</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                April 2026
             </span>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
