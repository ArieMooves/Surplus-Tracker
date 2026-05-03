"use client";
import { useEffect, useState } from 'react';
import Layout from "../../components/Layout";
import { ShoppingCart, Globe, AlertCircle } from 'lucide-react';

export default function MarketDashboard() {
  const [marketList, setMarketList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/market')
      .then(res => {
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Validate that we received an array
        if (Array.isArray(data)) {
          // Fallback Logic: Ensure we always show exactly 25 items
          if (data.length < 25) {
            const placeholdersNeeded = 25 - data.length;
            const placeholders = Array.from({ length: placeholdersNeeded }, (_, i) => ({
              id: `placeholder-${i}`,
              name: "Awaiting Inventory...",
              cond: "N/A",
              prices: { msu: 0, ebay: null, amazon: null }
            }));
            setMarketList([...data, ...placeholders]);
          } else {
            setMarketList(data.slice(0, 25));
          }
        } else {
          throw new Error("Invalid data format received from server");
        }
      })
      .catch(err => {
        console.error("Market Fetch Error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-maroon uppercase italic tracking-tight">
            Market Intelligence
          </h1>
          <p className="text-slate-400 font-bold text-xs tracking-[0.3em] mt-1">
            MSU SURPLUS LIVE VALUATION
          </p>
        </div>
        <div className="bg-brand-gold/10 px-4 py-2 rounded-full border border-brand-gold/20">
          <span className="text-brand-maroon font-black text-xs uppercase tracking-widest animate-pulse">
            ● Live Analysis Active
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-maroon border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-brand-maroon uppercase tracking-widest text-sm">
            Aggregating Market Points...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-20 bg-red-50 rounded-3xl border border-red-100 text-red-600">
          <AlertCircle size={40} className="mb-4" />
          <p className="font-black uppercase tracking-widest">Analysis Failed</p>
          <p className="text-xs mt-2 opacity-70">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {marketList.map((item) => {
            const isPlaceholder = item.id.toString().includes('placeholder');
            
            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md transition-shadow ${
                  isPlaceholder ? 'opacity-50 grayscale-[0.5]' : ''
                }`}
              >
                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-300">
                      {isPlaceholder ? "#---" : `#${item.id}`}
                    </span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                      item.cond === 'New' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.cond}
                    </span>
                  </div>
                  <h3 className="text-md font-black text-brand-maroon truncate uppercase">
                    {item.name}
                  </h3>
                </div>

                {/* Price Grid */}
                <div className="flex gap-2">
                  <PriceBox label="MSU" price={item.prices?.msu} highlight />
                  <PriceBox label="eBay" price={item.prices?.ebay} icon={<Globe size={10}/>} />
                  <PriceBox label="Amazon" price={item.prices?.amazon} icon={<ShoppingCart size={10}/>} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

/**
 * PriceBox Component
 * Handles formatting and missing data internally to keep main loop clean.
 */
function PriceBox({ label, price, highlight, icon }) {
  return (
    <div className={`w-20 p-2 rounded-xl text-center border transition-colors ${
      highlight 
        ? 'bg-brand-maroon border-brand-maroon text-white' 
        : 'bg-slate-50 border-slate-100 text-slate-500'
    }`}>
      <p className={`text-[8px] font-black uppercase mb-1 flex items-center justify-center gap-1 ${
        highlight ? 'text-brand-gold' : 'text-slate-400'
      }`}>
        {icon} {label}
      </p>
      <p className="font-mono font-bold text-xs">
        {price !== null && price !== undefined ? `$${price}` : 'N/A'}
      </p>
    </div>
  );
}
