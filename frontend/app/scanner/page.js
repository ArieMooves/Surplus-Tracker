"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getAssetByTag } from "../../lib/api";
import { 
  Camera, 
  Barcode, 
  Laptop, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  MapPin,
  Tag
} from "lucide-react";

// Dynamically import the scanner to avoid SSR issues with camera hardware
const BarcodeScanner = dynamic(() => import("../../components/BarcodeScanner"), { 
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200">
      <div className="text-center">
        <p className="text-brand-maroon animate-pulse font-black uppercase tracking-[0.2em] text-[10px]">
          Initializing Optical Hardware...
        </p>
      </div>
    </div>
  )
});

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState("camera"); 
  const [scannedAsset, setScannedAsset] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-focus the input when switching to Wand Mode for hands-free scanning
  useEffect(() => {
    if (activeTab === "barcode" && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [activeTab]);

  const handleScan = async (tag) => {
    if (!tag) return;
    setError(null);
    try {
      // Hits the FastAPI /assets/{tag} endpoint
      const asset = await getAssetByTag(tag.trim());
      setScannedAsset(asset);
      if (barcodeInputRef.current) barcodeInputRef.current.value = "";
    } catch (err) {
      setScannedAsset(null);
      setError(`Asset Tag "${tag}" not recognized in MSU Registry.`);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <BackButton />
        
        {/* Header Section */}
        <div className="mb-10 mt-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-brand-gold/20 p-3 rounded-2xl">
              <Barcode size={32} className="text-brand-maroon" />
            </div>
            <h1 className="text-4xl font-black text-brand-maroon italic tracking-tighter uppercase">
              Scanner <span className="text-brand-gold">Portal</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium text-lg ml-1">
            Verification via Optical Camera or Bluetooth Peripheral
          </p>
        </div>

        <div className="w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
          {/* TAB SELECTOR - Modern Segmented Control */}
          <div className="flex p-3 bg-slate-50/50 border-b border-slate-100">
            <button 
              onClick={() => setActiveTab("camera")}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
                activeTab === "camera" 
                  ? "bg-white text-brand-maroon shadow-lg shadow-slate-200/50 scale-[1.02]" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Camera size={20} /> Device Camera
            </button>
            <button 
              onClick={() => setActiveTab("barcode")}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
                activeTab === "barcode" 
                  ? "bg-white text-brand-maroon shadow-lg shadow-slate-200/50 scale-[1.02]" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Barcode size={20} /> Bluetooth Wand
            </button>
          </div>

          <div className="p-10">
            {activeTab === "camera" ? (
              <div key="camera-view" className="animate-in fade-in zoom-in-95 duration-500">
                {mounted && <BarcodeScanner onScanSuccess={handleScan} />}
              </div>
            ) : (
              <div key="wand-view" className="py-16 text-center animate-in slide-in-from-bottom-6 duration-500">
                <div className="inline-flex p-6 bg-brand-maroon/10 rounded-full text-brand-maroon mb-6">
                  <Laptop size={48} />
                </div>
                <h2 className="text-2xl font-black text-brand-maroon uppercase mb-3">Peripheral Mode Active</h2>
                <p className="text-slate-400 text-sm font-bold italic mb-10 tracking-wide uppercase">Awaiting External Data Input...</p>
                
                <input 
                  ref={barcodeInputRef}
                  type="text" 
                  placeholder="SCAN LABEL NOW" 
                  className="w-full max-w-lg mx-auto p-8 bg-slate-50 border-4 border-slate-100 rounded-[32px] text-center text-3xl font-mono font-black text-brand-maroon focus:border-brand-gold/50 focus:bg-white outline-none transition-all uppercase placeholder:text-slate-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleScan(e.target.value);
                      e.target.value = ""; 
                    }
                  }}
                />
              </div>
            )}

            {/* RESULT AREA */}
            <div className="mt-12 min-h-[160px]">
              {scannedAsset && (
                <div className="bg-white p-10 rounded-[35px] border-2 border-slate-100 shadow-xl flex gap-8 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                  {/* Decorative gold side accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-brand-gold"></div>
                  
                  <div className="bg-green-100/50 p-4 rounded-full h-fit">
                    <ShieldCheck className="text-green-600" size={40} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black bg-green-600 text-white px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">Verified Match</span>
                        <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                    
                    <h3 className="font-black text-slate-800 text-3xl uppercase leading-none tracking-tighter mb-4">
                        {scannedAsset.item_name}
                    </h3>
                    
                    <p className="text-slate-500 font-medium italic text-lg leading-relaxed mb-8">
                        {scannedAsset.description || "No official description available in registry."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Tag size={12} className="text-brand-gold" /> Registry Tag
                        </span>
                        <span className="font-mono font-black text-brand-maroon text-lg">{scannedAsset.asset_tag}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <MapPin size={12} className="text-brand-gold" /> Assignment
                        </span>
                        <span className="font-black text-slate-700 uppercase">{scannedAsset.location || "Central Receiving"}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setScannedAsset(null)}
                      className="mt-10 w-full py-4 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-[10px] tracking-[0.3em]"
                    >
                      Clear & Reset
                    </button>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="p-8 bg-red-50 text-red-700 rounded-[30px] border-2 border-red-100 flex items-center gap-6 animate-in shake-1 duration-500">
                  <AlertCircle className="shrink-0 text-red-500" size={32} />
                  <div className="flex flex-col">
                    <span className="font-black uppercase text-xs tracking-[0.1em] text-red-400 mb-1">System Error</span>
                    <span className="font-black uppercase text-lg tracking-tight leading-none">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
