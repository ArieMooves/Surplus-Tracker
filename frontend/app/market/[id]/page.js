'use client';

import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';

export default function MarketPage({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/market/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Market Fetch Error:", err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-maroon"></div>
          <p className="mt-4 text-slate-600 font-medium">Gemini is analyzing market trends...</p>
        </div>
      </Layout>
    );
  }

  // Handle case where data might be missing
  if (!data || !data.listings) {
    return (
      <Layout>
        <div className="p-10 text-center">
          <p>No market data found for this asset.</p>
          <button onClick={() => window.history.back()} className="text-blue-600 underline mt-4">Go Back</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {data.original || data.assetName}
            </h1>
            <p className="text-sm text-slate-500 italic">AI Optimized Search: "{data.searchQuery}"</p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="text-xs font-bold uppercase tracking-widest text-brand-maroon hover:text-brand-gold transition-colors"
          >
            ← Back to Inventory
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Market Summary Card */}
          <div className="md:col-span-1 bg-brand-maroon/5 p-6 rounded-2xl border border-brand-maroon/10">
            <h3 className="font-bold text-brand-maroon text-xs uppercase tracking-widest mb-4">Market Suggestion</h3>
            <div className="text-5xl font-black text-brand-maroon tracking-tighter">
              ${data.suggestedPrice || "45.00"}
            </div>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              Based on current averages for similar items in <strong>{data.condition || "Good"}</strong> condition.
            </p>
          </div>

          {/* External Listings Table */}
          <div className="md:col-span-2 bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.listings.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{item.site}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded capitalize">
                        {item.condition || "Used"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-black">${item.price}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand-maroon hover:text-brand-gold underline uppercase tracking-tighter"
                      >
                        View Listing
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
