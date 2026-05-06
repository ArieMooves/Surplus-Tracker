"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { 
  getAssets, 
  updateAssetStatus, 
  claimSurplusAsset, 
  updateAssetCondition 
} from "../../lib/api"; 
import { 
  Search, 
  X, 
  Edit3, 
  Save, 
  BarChart2, 
  PackageSearch, 
  ShieldCheck, 
  MapPin, 
  BellRing,
  RefreshCw
} from 'lucide-react';

export default function InventoryPage() {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const ADMIN_NAME = "Marcus Mustang";
  const MUSTANG_ID = "M10357379";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    getAssets()
      .then(data => {
        setAssets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredAssets = assets.filter(asset => 
    asset.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset_tag.includes(searchTerm)
  );

  // INTERACTIVE CONDITION CYCLING
  const handleConditionCycle = async () => {
    const conditions = ["Poor", "Fair", "Good", "Excellent", "New"];
    const currentIndex = conditions.indexOf(selectedAsset.condition || "Good");
    const nextCondition = conditions[(currentIndex + 1) % conditions.length];
    
    setIsSaving(true);
    try {
      await updateAssetCondition(selectedAsset.asset_id, nextCondition);
      
      // Update local UI immediately
      setSelectedAsset({ ...selectedAsset, condition: nextCondition });
      setAssets(prev => prev.map(a => 
        a.asset_id === selectedAsset.asset_id ? { ...a, condition: nextCondition } : a
      ));
    } catch (err) {
      alert("❌ CONDITION SYNC FAILED");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStatus = async () => {
    setIsSaving(true);
    try {
      await updateAssetStatus(selectedAsset.asset_id, selectedAsset.current_status);
      await fetchData(); 
      alert(`💾 SYSTEM OVERRIDE SUCCESSFUL\nAsset status set to: ${selectedAsset.current_status.toUpperCase()}`);
      setSelectedAsset(null); 
    } catch (err) {
      alert("❌ UPDATE FAILED");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClaim = async () => {
    setIsSaving(true);
    const targetDept = selectedAsset.location || "the requesting department";
    try {
      await claimSurplusAsset(selectedAsset.asset_id, targetDept);
      await fetchData();
      alert(`✅ REDISTRIBUTION APPROVED\nAssignment: ${targetDept}`);
      setSelectedAsset(null);
    } catch (err) {
      alert("❌ REDISTRIBUTION FAILED");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <BackButton />
      
      {/* ADMIN IDENTITY BANNER */}
      <div className="mb-6 flex items-center gap-3 bg-brand-maroon p-4 rounded-2xl border-b-4 border-brand-gold shadow-lg">
        <div className="bg-white/20 p-2 rounded-full"><ShieldCheck size={20} className="text-brand-gold" /></div>
        <div>
          <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] leading-none mb-1">Authenticated System Administrator</p>
          <p className="text-white font-bold text-sm">{ADMIN_NAME} <span className="opacity-60 ml-2">ID: {MUSTANG_ID}</span></p>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-3 uppercase">
            <PackageSearch size={32} className="text-brand-gold" /> Asset Inventory
          </h1>
          <p className="text-slate-500 font-medium">Monitoring {filteredAssets.length} tracked items</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search Assets..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase text-center">Asset Tag</th>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase">Item Name</th>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase">Location</th>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="p-12 text-center animate-pulse">Accessing Registry...</td></tr>
            ) : filteredAssets.map((asset) => {
              const isRequested = asset.current_status === 'surplus' && asset.location && asset.location !== 'N/A';
              return (
                <tr 
                  key={asset.asset_id} 
                  onClick={() => setSelectedAsset(asset)}
                  className={`transition-colors group cursor-pointer ${isRequested ? 'bg-blue-50/50 hover:bg-blue-100/50 border-l-4 border-l-blue-500' : 'hover:bg-brand-gold/5'}`}
                >
                  <td className="p-4 font-mono text-sm text-brand-maroon font-bold text-center">{asset.asset_tag}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-slate-700 font-medium uppercase text-xs">{asset.item_name}</span>
                      {isRequested && <span className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1 mt-1"><BellRing size={10} /> Request Pending</span>}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 font-bold uppercase text-[10px] tracking-tight">
                    <div className="flex items-center gap-1.5"><MapPin size={12} /> {asset.location || "Central Receiving"}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${asset.current_status === 'active' ? 'bg-green-100 text-green-700' : asset.current_status === 'surplus' ? 'bg-brand-gold/20 text-brand-maroon' : 'bg-slate-200 text-slate-600'}`}>
                      {asset.current_status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-maroon/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-t-8 border-brand-gold overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-2">
                <Edit3 size={20} className="text-brand-gold" /> ADMIN CONTROL PANEL
              </h2>
              <button onClick={() => setSelectedAsset(null)} className="text-slate-400"><X size={24} /></button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Tag</label>
                  <p className="text-lg font-mono font-bold text-brand-maroon">{selectedAsset.asset_tag}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Condition (Click to cycle)</label>
                  <button 
                    onClick={handleConditionCycle}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-brand-gold/20 px-4 py-2 rounded-xl border border-slate-200 transition-all group"
                  >
                    <span className="text-md font-black text-slate-700 uppercase tracking-tight">{selectedAsset.condition || "Good"}</span>
                    <RefreshCw size={14} className={`text-brand-gold ${isSaving ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Item Description</label>
                <p className="text-sm text-slate-600 italic bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedAsset.description}</p>
              </div>

              {selectedAsset.current_status === 'surplus' && (
                <div className="p-4 bg-blue-50 border-2 border-dashed border-blue-400 rounded-2xl space-y-3">
                  <p className="text-center text-[9px] font-black text-blue-600 uppercase tracking-widest">Redistribution Request</p>
                  <button onClick={handleClaim} className="w-full bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition-all uppercase text-xs tracking-widest shadow-md flex items-center justify-center gap-2">
                    <ShieldCheck size={16} /> Approve Transfer
                  </button>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Status Override</label>
                <select 
                  value={selectedAsset.current_status}
                  onChange={(e) => setSelectedAsset({...selectedAsset, current_status: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold text-brand-maroon uppercase text-xs"
                >
                  <option value="active">Active</option>
                  <option value="surplus">Surplus</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
              <Link 
                href="/market"
                className="w-full bg-brand-gold text-brand-maroon font-black py-4 rounded-xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-widest text-xs"
              >
                <BarChart2 size={18} /> View Market Analysis
              </Link>
              <button 
                onClick={handleSaveStatus}
                disabled={isSaving}
                className="w-full bg-brand-maroon text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Save size={18} /> {isSaving ? "COMMITTING..." : "SAVE MANUAL CHANGES"}
              </button>
              <button onClick={() => setSelectedAsset(null)} className="w-full border-2 border-slate-200 text-slate-500 font-bold py-4 rounded-xl hover:bg-slate-100">CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
