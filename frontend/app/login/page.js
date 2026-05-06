"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [mustangId, setMustangId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Exact credentials required for Marcus-test
    if (mustangId === "M10357379" && password === "Warehouse") {
      const marcusUser = { 
        name: "Marcus Mustang", 
        id: "M10357379", 
        department: "System Administration", 
        role: "SUPER_ADMIN" 
      };
      
      localStorage.setItem('msu_user', JSON.stringify(marcusUser));
      router.push('/');
    } else {
      setError("Invalid Mustang ID or Security Password. Please contact IT.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-maroon flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-t-8 border-brand-gold relative">
        
        {/* Branding Header */}
        <div className="p-10 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-maroon/5 rounded-2xl mb-4 border border-brand-maroon/10">
            <ShieldCheck size={32} className="text-brand-maroon" />
          </div>
          <h1 className="text-4xl font-black text-brand-maroon italic tracking-tighter uppercase">
            MSU <span className="text-brand-gold">Surplus</span> <span className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-60">Tracker</span>
          </h1>
          <p className="text-slate-400 uppercase tracking-[0.2em] text-[10px] font-black mt-2">
            Centralized Asset Registry
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="px-10 pb-10 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-4 text-slate-300 group-focus-within:text-brand-maroon transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Mustang ID (e.g. M12345678)" 
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all text-sm font-bold" 
                value={mustangId}
                onChange={(e) => setMustangId(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-slate-300 group-focus-within:text-brand-maroon transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Security Password" 
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all text-sm font-bold" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-brand-maroon focus:ring-brand-gold" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remember Me</span>
            </label>
            <button type="button" className="text-[10px] font-bold text-brand-maroon uppercase tracking-widest hover:underline">
              Forgot ID?
            </button>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-maroon text-white font-black py-5 rounded-2xl hover:bg-brand-dark transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs group"
          >
            Authenticate Credentials
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer Features */}
          <div className="pt-6 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              Don't have an administrative account? <br/>
              <button type="button" className="text-brand-maroon font-black uppercase tracking-widest text-[10px] mt-2 hover:underline">
                Register New Asset Manager
              </button>
            </p>
          </div>
        </form>

        <div className="bg-slate-50 p-4 text-center">
          <p className="text-[9px] text-slate-400 font-medium italic">
            Property of Midwestern State University. Unauthorized access is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
