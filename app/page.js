"use client"
import { useEffect, useState } from "react"
import { getAssets } from "../lib/api"
import Layout from "../components/Layout" // make sure you created Layout.js
import Link from "next/link"

export default function Home() {
  const [assets, setAssets] = useState([])

  useEffect(() => {
    loadAssets()
  }, [])

  async function loadAssets() {
    const data = await getAssets()
    setAssets(data)
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Surplus Assets</h1>
        <Link
          href="/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Asset
        </Link>
      </div>

      {assets.length === 0 ? (
        <p className="text-gray-600">No assets found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white shadow rounded p-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{asset.item_name}</h3>
              <p className="text-gray-600">Condition: {asset.condition}</p>
              <p className="text-gray-600">Status: {asset.current_status}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
