"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { addAsset } from "../../lib/api";
import { PlusCircle, Sparkles, Building2, ClipboardCheck, Tag } from 'lucide-react';

export default function AddAssetPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    asset_tag: '',
    item_name: '',
    condition: 'Good',
    location: 'Computer Science', // Default for Marcus's department
    description: '',
    current_status: 'active'
  });

  // Departments list to match seed.py
  const departments = [
    "Bookstore", "Mathematics", "Geosciences", "Career Management Center", 
    "Clark Student Center", "Counseling Center", "Nursing", "Computer Science", 
    "University Police", "Health Services"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addAsset(formData);
      alert("Asset registered successfully in the MSU Registry.");
      router.push('/inventory');
    } catch (err) {
      alert("Failed to register asset. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <BackButton />

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-3 uppercase">
            <PlusCircle size={32} className="text-brand-gold" />
            Register New Asset
          </h1>
          <p className="text-slate-500 font-medium">
            Authorized Input for Mustang ID: <span className="text-brand-maroon font-bold">M10357379</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-6">
            
            {/* Asset Tag & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Tag size={12} /> Asset Tag (5-Digits)
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 50123"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none font-mono font-bold text-brand-maroon"
                  value={formData.asset_tag}
                  onChange={(e) => setFormData({...formData, asset_tag: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ClipboardCheck size={12} /> Item Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Standard name"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none font-bold"
                  value={formData.item_name}
                  onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                />
              </div>
            </div>

            {/* Department & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 size={12} /> Assigning Department
                </label>
                <select
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none font-bold text-slate-700"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                >
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Condition</label>
                <select
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none font-bold text-slate-700"
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                >
                  <option value="New">New / In Box</option>
                  <option value="Good">Good / Operational</option>
                  <option value="Fair">Fair / Wear Visible</option>
                  <option value="Poor">Poor / Requires Repair</option>
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>Detailed Audit Description</span>
                <span className="text-brand-gold flex items-center gap-1"><Sparkles size={10}/> AI-Ready formatting</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Include cause for entry (e.g., Department upgrade, relocation, or surplus lifecycle cycle)"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none italic font-medium text-slate-600"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand-maroon text-white font-black py-4 rounded-2xl hover:bg-brand-dark transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {isSubmitting ? "Processing..." : "Authorize Registry Entry"}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-8 border-2 border-slate-200 text-slate-400 font-bold rounded-2xl hover:bg-slate-100 transition-all uppercase text-xs tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
