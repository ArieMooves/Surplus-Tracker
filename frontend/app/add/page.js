"use client"

import { useState } from "react"
import { addAsset } from "../../lib/api"
import Layout from "../../components/Layout"
import BackButton from "../../components/BackButton"
import { useRouter } from "next/navigation"

export default function AddAsset() {
  const router = useRouter()

  // Updated state: removed 'id' as Postgres handles this automatically
  const [form, setForm] = useState({
    asset_tag: "",
    item_name: "",
    condition: "Good", // Defaulting to Good
    current_status: "surplus", // Defaulting to surplus for this tracker
  })

  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await addAsset(form)
      
      if (result) {
        alert("Asset added successfully!")
        router.push("/") // Redirect to dashboard
      }
    } catch (err) {
      // Improved error display using the detailed message from api.js
      alert("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <BackButton />
      
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-brand-maroon mb-6 uppercase tracking-tight">
          Register New Asset
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Asset Tag */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Asset Tag / Barcode</label>
            <input
              name="asset_tag"
              placeholder="e.g. MSU-10045"
              onChange={handleChange}
              required
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-maroon outline-none transition-all"
            />
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Item Name</label>
            <input
              name="item_name"
              placeholder="e.g. Dell Latitude Laptop"
              onChange={handleChange}
              required
              className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-maroon outline-none transition-all"
            />
          </div>

          {/* Condition Dropdown (Better than text input for data consistency) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Condition</label>
            <select
              name="condition"
              onChange={handleChange}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold"
            >
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor/Broken</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
            <select
              name="current_status"
              onChange={handleChange}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-brand-gold"
            >
              <option value="active">Active</option>
              <option value="surplus">Surplus</option>
              <option value="disposed">Disposed</option>
            </select>
          </div>

          {/* Submit Button - Branded Maroon */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-maroon text-white font-bold py-3 rounded-lg hover:bg-brand-dark transition-all shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Registering..." : "Add Asset to Database"}
          </button>
        </form>
      </div>
    </Layout>
  )
}
