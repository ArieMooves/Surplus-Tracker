"use client";
import useSWR from 'swr';
import Layout from "../../components/Layout";
import { ShoppingCart, Globe, AlertCircle } from 'lucide-react';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`Server Error: ${res.status}`);
  return res.json();
});

export default function MarketDashboard() {
  const { data, error, isLoading } = useSWR('/api/market', fetcher, {
    refreshInterval: 60000, 
    revalidateOnFocus: true,
    fallbackData: []         
  });

  // Show placeholders only when truly loading/empty
  const marketList = (() => {
    const apiData = Array.isArray(data) && data.length > 0 ? data : [];
    
    // If the API has returned our 25 items, use them
    if (apiData.length > 0) {
      return apiData;
    }

    // Otherwise, generate 25 placeholders for the "Searching..." state
    return Array.from({ length: 25 }, (_, i) => ({
      id: `---`,
      name: "Awaiting Live Market Data...",
      cond: "SCANNING",
      prices: { msu: 0, ebay: null, amazon: null }
    }));
  })();

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-3 uppercase">
            <ShoppingCart size={32} className="text-brand-gold" />
            Market Intelligence
          </h1>
          <p className="text-slate-500 font-medium">
            Live valuation analysis for the MSU Surplus Division
          </p>
        </div>
        
        {/* Visual indicator for the Google Search browsing delay */}
        <div className="bg-brand-gold/10 px-4 py-2 rounded-full border border-brand-gold/20 flex items-center gap-2">
          {isLoading && <div className="h-2 w-2 bg-brand-maroon rounded-full animate-ping" />}
          <span className="text-brand-maroon font-black text-xs uppercase tracking-widest">
            {isLoading ? "Browsing Web Listings..." : "● Live Analysis Active"}
          </span>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center p-20 bg-red-50 rounded-3xl border border-red-100 text-red-600">
          <AlertCircle size={40} className="mb-4" />
          <p className="font-black uppercase tracking-widest">Feed Connection Error</p>
          <p className="text-xs mt-2 opacity-70">{error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {marketList.map((item, index) => {
            // Check if it's a placeholder by ID or by the isLoading state
            const isPlaceholder = isLoading || item.id === '---';
            
            return (
              <div 
                key={item.id === '---' ? `loading-${index}` : item.id} 
                className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md transition-all ${
                  isPlaceholder ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'
                } ${isLoading ? 'animate-pulse' : ''}`}
              >
                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-300">
                      #{item.id}
                    </span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                      item.cond === 'New' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.cond}
                    </span>
                  </div>
                  <h3 className="text-md font-black text-brand-maroon truncate uppercase leading-tight">
                    {item.name}
                  </h3>
                </div>

                {/* Price Comparisons */}
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

function PriceBox({ label, price, highlight, icon }) {
  return (
    <div className={`w-20 p-2 rounded-xl text-center border transition-colors ${
      highlight 
        ? 'bg-brand-maroon border-brand-maroon text-white shadow-sm' 
        : 'bg-slate-50 border-slate-100 text-slate-500'
    }`}>
      <p className={`text-[8px] font-black uppercase mb-1 flex items-center justify-center gap-1 ${
        highlight ? 'text-brand-gold' : 'text-slate-400'
      }`}>
        {icon} {label}
      </p>
      <p className="font-mono font-bold text-xs">
        {/* Ensuring we never show $null or $undefined */}
        {typeof price === 'number' ? `$${Math.round(price)}` : '---'}
      </p>
    </div>
  );
}
