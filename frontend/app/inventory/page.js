"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getAssets, updateAssetStatus, claimSurplusAsset } from "../../lib/api"; 
import { Search, X, Edit3, Save, BarChart2, PackageSearch, ShieldCheck } from 'lucide-react';

export default function InventoryPage() {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // ADMIN PROFILE DATA
  const ADMIN_NAME = "Marcus Mustang";
  const MUSTANG_ID = "M10357379";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
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

  const handleSaveStatus = async () => {
    setIsSaving(true);
    try {
      await updateAssetStatus(selectedAsset.asset_id, selectedAsset.current_status);
      await fetchData(); 
      setSelectedAsset(null); 
      alert("Status Updated Successfully");
    } catch (err) {
      alert("Update Failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <BackButton />
      
      {/* ADMIN IDENTITY BANNER */}
      <div className="mb-6 flex items-center gap-3 bg-brand-maroon p-4 rounded-2xl border-b-4 border-brand-gold shadow-lg">
        <div className="bg-white/20 p-2 rounded-full">
          <ShieldCheck size={20} className="text-brand-gold" />
        </div>
        <div>
          <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] leading-none mb-1">
            Authenticated System Administrator
          </p>
          <p className="text-white font-bold text-sm">
            {ADMIN_NAME} <span className="opacity-60 ml-2">ID: {MUSTANG_ID}</span>
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-3 uppercase">
            <PackageSearch size={32} className="text-brand-gold" />
            Asset Inventory
          </h1>
          <p className="text-slate-500 font-medium">
            Managing {filteredAssets.length} tracked items
          </p>
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
              <th className="p-4 font-bold text-slate-600 text-xs uppercase">Asset Tag</th>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase">Item Name</th>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="3" className="p-12 text-center animate-pulse">Accessing Registry...</td></tr>
            ) : filteredAssets.map((asset) => (
              <tr 
                key={asset.asset_id} 
                onClick={() => setSelectedAsset(asset)}
                className="hover:bg-brand-gold/5 transition-colors group cursor-pointer"
              >
                <td className="p-4 font-mono text-sm text-brand-maroon font-bold">{asset.asset_tag}</td>
                <td className="p-4 text-slate-700 font-medium uppercase text-xs">{asset.item_name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    asset.current_status === 'active' ? 'bg-green-100 text-green-700' : 
                    asset.current_status === 'surplus' ? 'bg-brand-gold/20 text-brand-maroon' : 
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {asset.current_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-maroon/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-t-8 border-brand-gold overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-2">
                <Edit3 size={20} className="text-brand-gold" />
                ADMIN CONTROL PANEL
              </h2>
              <button onClick={() => setSelectedAsset(null)} className="text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Tag</label>
                  <p className="text-lg font-mono font-bold text-brand-maroon">{selectedAsset.asset_tag}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Condition</label>
                  <p className="text-md font-bold text-slate-700">{selectedAsset.condition}</p>
                </div>
              </div>

              {/* ADMIN APPROVAL BOX */}
              {selectedAsset.current_status === 'surplus' && (
                <div className="p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl">
                  <p className="text-[9px] font-black text-blue-600 uppercase mb-2 text-center">
                    Authorized Approval Required
                  </p>
                  <button 
                    onClick={handleSaveStatus}
                    className="w-full bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition-all uppercase text-xs tracking-widest shadow-md"
                  >
                    Approve Redistribution
                  </button>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Set System Status</label>
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
              <button 
                onClick={handleSaveStatus}
                disabled={isSaving}
                className="w-full bg-brand-maroon text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? "EXECUTING..." : "COMMIT CHANGES"}
              </button>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="w-full border-2 border-slate-200 text-slate-500 font-bold py-4 rounded-xl"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
