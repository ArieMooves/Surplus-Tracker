"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getAssetByTag } from "../../lib/api";
import { Camera, Barcode, Laptop, AlertCircle, CheckCircle2, ScanLine } from "lucide-react";

const QRScanner = dynamic(() => import("../../components/QRScanner"), { 
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
      <p className="text-slate-400 animate-pulse font-bold uppercase tracking-widest text-xs">Initializing Camera...</p>
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

  useEffect(() => {
    if (activeTab === "barcode" && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [activeTab]);

  const handleScan = async (tag) => {
    if (!tag) return;
    setError(null);
    try {
      const asset = await getAssetByTag(tag.trim());
      setScannedAsset(asset);
      if (barcodeInputRef.current) barcodeInputRef.current.value = "";
    } catch (err) {
      setScannedAsset(null);
      setError(`Asset "${tag}" not found.`);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <BackButton />
        
        
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-3 uppercase">
            <ScanLine size={32} className="text-brand-gold" />
            Scanner Portal
          </h1>
          <p className="text-slate-500 font-medium">
            Scan asset tags via phone camera or Bluetooth wand for instant verification
          </p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* TAB SELECTOR */}
          <div className="flex p-2 bg-slate-50 border-b border-slate-100">
            <button 
              onClick={() => setActiveTab("camera")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === "camera" ? "bg-white text-brand-maroon shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Camera size={18} /> Phone Camera
            </button>
            <button 
              onClick={() => setActiveTab("barcode")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === "barcode" ? "bg-white text-brand-maroon shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Barcode size={18} /> Bluetooth Wand
            </button>
          </div>

          <div className="p-8">
            {activeTab === "camera" ? (
              <div key="camera-view" className="animate-in fade-in zoom-in-95 duration-300">
                {mounted && <QRScanner onScanSuccess={handleScan} />}
              </div>
            ) : (
              <div key="wand-view" className="py-12 text-center animate-in slide-in-from-bottom-4 duration-300">
                <div className="inline-flex p-5 bg-brand-maroon/5 rounded-full text-brand-maroon mb-6">
                  <Laptop size={40} />
                </div>
                <h2 className="text-xl font-black text-brand-maroon uppercase mb-2">Wand Mode Active</h2>
                <p className="text-slate-500 text-sm font-medium italic mb-8">Scan asset tag using the Inateck wand</p>
                
                <input 
                  ref={barcodeInputRef}
                  type="text" 
                  placeholder="AWAITING SCAN..." 
                  className="w-full max-w-md mx-auto p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center text-2xl font-mono font-bold focus:border-brand-maroon focus:ring-8 focus:ring-brand-maroon/5 outline-none transition-all uppercase"
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
            <div className="mt-10 min-h-[140px]">
              {scannedAsset && (
                <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-100 flex gap-6 animate-in zoom-in-95 duration-300">
                  <CheckCircle2 className="text-green-600 shrink-0" size={32} />
                  <div className="flex-1">
                    <span className="text-[10px] font-black bg-green-600 text-white px-3 py-1 rounded-full uppercase mb-3 inline-block tracking-widest">Verified Match</span>
                    <h3 className="font-black text-brand-maroon text-2xl uppercase leading-tight tracking-tight">{scannedAsset.item_name}</h3>
                    <p className="text-slate-600 mt-2 font-medium italic leading-relaxed">{scannedAsset.description}</p>
                    <div className="mt-6 pt-4 border-t border-green-200 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Tag: {scannedAsset.asset_tag}</span>
                      <span>Department: {scannedAsset.location}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="p-6 bg-red-50 text-red-700 rounded-2xl border-2 border-red-100 flex items-center gap-4 animate-in shake-1 duration-500">
                  <AlertCircle className="shrink-0" size={24} />
                  <span className="font-black uppercase text-sm tracking-tight">{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
