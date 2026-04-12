"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getAssetByTag } from "../../lib/api";

const QRScanner = dynamic(() => import("../../components/QRScanner"), { 
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center bg-slate-100 rounded-xl">Initializing Camera...</div>
});

export default function ScannerPage() {
  const [scannedAsset, setScannedAsset] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScan = async (decodedText) => {
    setError(null);
    try {
      const asset = await getAssetByTag(decodedText);
      setScannedAsset(asset);
    } catch (err) {
      setScannedAsset(null);
      setError("Asset not found in MSU Database");
    }
  };

  if (!mounted) return null;

  return (
    <Layout>
      <BackButton />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-black text-brand-maroon italic mb-8">SCANNER PORTAL</h1>
        
        <div className="w-full max-w-md bg-white p-4 rounded-3xl shadow-xl border-t-8 border-brand-gold">
          {/* Use the dynamic component here */}
          <QRScanner onScanSuccess={handleScan} />
          
          <div className="mt-6">
            {scannedAsset && (
              <div className="bg-green-50 p-5 rounded-xl border border-green-200 animate-in zoom-in-95">
                <h3 className="font-black text-brand-maroon uppercase">{scannedAsset.item_name}</h3>
                <p className="text-brand-maroon/70 font-bold text-xs">Dept: {scannedAsset.location}</p>
                <p className="text-slate-600 text-xs italic mt-2 border-t pt-2">{scannedAsset.description}</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-bold text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
