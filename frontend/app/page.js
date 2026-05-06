"use client"
import { useEffect, useState } from "react"
import { getAssets } from "../lib/api"
import Layout from "../components/Layout"
import Link from "next/link"
import { LayoutDashboard, Plus, Package, ShieldCheck, PieChart, Trash2, MapPin, Info } from 'lucide-react'

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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-3 uppercase">
            <LayoutDashboard size={32} className="text-brand-gold" />
            System Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Real-time management of the MSU Surplus Registry.
          </p>
        </div>

        <Link
          href="/add"
          className="inline-flex items-center bg-brand-maroon hover:bg-brand-dark text-white font-black py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 uppercase text-xs tracking-widest"
        >
          <Plus size={18} className="mr-2" /> Add New Asset
        </Link>
      </div>

      {/* Stats Section */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Assets" value={totalAssets} icon={<Package size={24}/>} color="bg-slate-800" />
          <StatCard title="Active Use" value={activeCount} icon={<ShieldCheck size={24}/>} color="bg-green-600" />
          <StatCard title="In Surplus" value={surplusCount} icon={<PieChart size={24}/>} color="bg-brand-gold" />
          <StatCard title="Disposed" value={disposedCount} icon={<Trash2 size={24}/>} color="bg-brand-maroon" />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Info size={14} />
          Recently Synced Inventory
        </h2>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-maroon"></div>
          <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-100 text-red-700 px-6 py-8 rounded-3xl text-center">
          <p className="font-black uppercase tracking-tight">{error}</p>
          <button onClick={loadAssets} className="mt-2 text-sm font-bold underline">Try again</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.slice(0, 9).map((asset) => (
            <div
              key={asset.asset_id}
              className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                  TAG: {asset.asset_tag}
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

              <h3 className="text-lg font-black text-brand-maroon uppercase leading-tight group-hover:text-brand-gold transition-colors line-clamp-1">
                {asset.item_name}
              </h3>

              {/* show description from the Inventory/Seeder */}
              <p className="text-slate-500 text-xs mt-3 italic font-medium leading-relaxed flex-grow">
                {asset.description}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Audit Status</p>
                  <p className="text-xs font-bold text-slate-700">{asset.condition}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Department</p>
                  <p className="text-xs font-bold text-brand-maroon flex items-center gap-1">
                    <MapPin size={10} className="text-brand-gold" />
                    {asset.location}
                  </p>
                </div>
              </div>
              
              <Link 
                href="/inventory"
                className="mt-5 w-full flex justify-center py-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-brand-maroon border border-transparent group-hover:border-slate-100 rounded-xl transition-all"
              >
                Inspect Asset Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
      <div className={`${color} absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full`}></div>
      <div className={`${color} text-white p-3 rounded-2xl w-fit mb-4 shadow-lg`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-slate-800 tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{title}</div>
    </div>
  );
}
