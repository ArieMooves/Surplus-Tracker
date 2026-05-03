"use client"
import { useEffect, useState } from "react"
import { getAssets } from "../lib/api"
import Layout from "../components/Layout"
import Link from "next/link"
import { LayoutDashboard, Plus, Package, ShieldCheck, PieChart, Trash2 } from 'lucide-react'

export default function Home() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAssets()
  }, [])

  async function loadAssets() {
    try {
      const data = await getAssets()
      setAssets(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError("Failed to load assets. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const totalAssets = assets.length
  const activeCount = assets.filter(a => a.current_status === "active").length
  const surplusCount = assets.filter(a => a.current_status === "surplus").length
  const disposedCount = assets.filter(a => a.current_status === "disposed").length

  return (
    <Layout>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-3 uppercase">
            <LayoutDashboard size={32} className="text-brand-gold" />
            System Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Monitor and manage MSU asset lifecycles in real-time.
          </p>
        </div>

        <Link
          href="/add"
          className="inline-flex items-center bg-brand-maroon hover:bg-brand-dark text-white font-black py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 uppercase text-xs tracking-widest"
        >
          <Plus size={18} className="mr-2" /> Add New Asset
        </Link>
      </div>

  
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Assets" value={totalAssets} icon={<Package size={24}/>} color="bg-slate-800" />
          <StatCard title="Active Use" value={activeCount} icon={<ShieldCheck size={24}/>} color="bg-green-600" />
          <StatCard title="In Surplus" value={surplusCount} icon={<PieChart size={24}/>} color="bg-brand-gold" />
          <StatCard title="Disposed" value={disposedCount} icon={<Trash2 size={24}/>} color="bg-brand-maroon" />
        </div>
      )}

      {/* CONTENT STATES */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-maroon"></div>
          <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest text-xs">Loading MSU Database...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-100 text-red-700 px-6 py-8 rounded-3xl text-center">
          <p className="font-black uppercase tracking-tight">{error}</p>
          <button onClick={loadAssets} className="mt-2 text-sm font-bold underline hover:text-red-800">Try again</button>
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No assets registered in the system.</p>
          <Link href="/add" className="text-brand-maroon font-black hover:underline mt-4 inline-block uppercase text-xs">
            Register your first asset →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.asset_id}
              className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                  TAG: {asset.asset_tag || asset.asset_id}
                </div>
                <span
                  className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${
                    asset.current_status === "disposed"
                      ? "bg-brand-maroon/10 text-brand-maroon"
                      : asset.current_status === "surplus"
                      ? "bg-brand-gold/20 text-brand-maroon"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {asset.current_status}
                </span>
              </div>

              <h3 className="text-xl font-black text-brand-maroon uppercase leading-tight group-hover:text-brand-gold transition-colors">
                {asset.item_name}
              </h3>

              <p className="text-slate-500 text-sm mt-3 line-clamp-2 h-10 italic font-medium">
                {asset.description || "No description provided."}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Condition</p>
                  <p className="text-sm font-bold text-slate-700">{asset.condition || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Location</p>
                  <p className="text-sm font-bold text-slate-700">{asset.location || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

// Internal Helper Component for Stats 
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
      <div className={`${color} absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full`}></div>
      <div className={`${color} text-white p-3 rounded-2xl w-fit mb-4 shadow-lg`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-slate-800">{value}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{title}</div>
    </div>
  );
}
