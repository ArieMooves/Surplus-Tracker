"use client"
import { useEffect, useState } from "react"
import { getAssets } from "../lib/api"
import Layout from "../components/Layout"
import Link from "next/link"

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

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Surplus Assets
          </h1>
          <p className="text-gray-500 text-sm">
            Manage and track surplus inventory
          </p>
        </div>

        <Link
          href="/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Asset
        </Link>
      </div>

      {/* STATES */}
      {loading ? (
        <div className="text-gray-500 text-center mt-10">
          Loading assets...
        </div>

      ) : error ? (
        <div className="text-red-500 text-center mt-10">
          {error}
        </div>

      ) : assets.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">
          No assets yet. Click "Add Asset" to get started.
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.asset_id}  
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition border"
            >
              {/* NAME */}
              <h3 className="text-lg font-semibold text-gray-800">
                {asset.item_name}
              </h3>

              {/* DESCRIPTION */}
              {asset.description && (
                <p className="text-sm text-gray-400 mt-1">
                  {asset.description}
                </p>
              )}

              {/* CONDITION */}
              <p className="text-sm text-gray-500 mt-2">
                Condition: {asset.condition || "N/A"}
              </p>

              {/* LOCATION */}
              {asset.location && (
                <p className="text-sm text-gray-500">
                  Location: {asset.location}
                </p>
              )}

              {/* STATUS BADGE */}
              <span
                className={`mt-3 inline-block px-3 py-1 text-sm rounded-full ${
                  asset.current_status === "disposed"
                    ? "bg-red-100 text-red-600"
                    : asset.current_status === "surplus"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {asset.current_status}
              </span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
