"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getAssetByTag } from "../../lib/api";
import { ScanBarcode, PackageCheck, AlertCircle } from "lucide-react";

export default function ScannerPage() {
  const [scannedAsset, setScannedAsset] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    });

    const onScanSuccess = async (decodedText) => {
      setError(null);
      try {
       
        const asset = await getAssetByTag(decodedText);
        setScannedAsset(asset);
        
      } catch (err) {
        setScannedAsset(null);
        setError("Asset not found in MSU Database");
      }
    };

    const onScanFailure = (error) => {
      
    };

    scanner.render(onScanSuccess, onScanFailure);

    
    return () => {
      scanner.clear().catch((error) => console.error("Failed to clear scanner", error));
    };
  }, []);

  return (
    <Layout>
      <BackButton />
      
      <div className="flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center justify-center gap-3">
            <ScanBarcode size={32} className="text-brand-gold" />
            SCANNER PORTAL
          </h1>
          <p className="text-slate-500 font-medium">Align MSU Asset Tag within the frame</p>
        </div>

        <div className="w-full max-w-md bg-white p-4 rounded-3xl shadow-xl border-t-8 border-brand-gold overflow-hidden">
          {/* CAMERA FEED BOX */}
          <div id="reader" className="rounded-xl overflow-hidden border-2 border-slate-100"></div>

          {/* RESULTS AREA */}
          <div className="mt-6 min-h-[120px] flex flex-col justify-center">
            {!scannedAsset && !error && (
              <div className="text-center py-4">
                <div className="inline-block p-3 bg-slate-50 rounded-full text-slate-300 animate-pulse">
                  <ScanBarcode size={40} />
                </div>
                <p className="text-slate-400 text-sm mt-2 italic">Waiting for scan...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={24} />
                <span className="font-bold text-sm">{error}</span>
              </div>
            )}

            {scannedAsset && (
              <div className="bg-green-50 p-5 rounded-xl border border-green-200 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-brand-maroon uppercase">{scannedAsset.item_name}</h3>
                  <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">FOUND</span>
                </div>
                <div className="flex items-center gap-2 text-brand-maroon font-mono text-sm font-bold mb-3">
                   <PackageCheck size={16} />
                   Tag: {scannedAsset.asset_tag}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed italic border-t border-green-100 pt-3">
                  {scannedAsset.description || "No description provided."}
                </p>
                <button 
                  onClick={() => setScannedAsset(null)}
                  className="w-full mt-4 text-[10px] font-bold text-slate-400 hover:text-brand-maroon transition-colors uppercase tracking-widest"
                >
                  Scan Next Item
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 px-6 py-3 bg-brand-maroon/5 rounded-full border border-brand-maroon/10">
            <p className="text-[10px] text-brand-maroon/60 font-bold uppercase tracking-[0.2em] text-center">
                Authorized Personnel Only • MSU Assets Division
            </p>
        </div>
      </div>
    </Layout>
  );
}
