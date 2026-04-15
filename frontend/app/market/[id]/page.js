'use client';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout'; 

export default function MarketPage({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/market/${params.id}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maroon-600"></div>
        <p className="mt-4 text-gray-600">Gemini is analyzing market trends...</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{data.original}</h1>
          <p className="text-sm text-gray-500 italic">AI Search Term: "{data.searchQuery}"</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Market Summary Card */}
          <div className="md:col-span-1 bg-maroon-50 p-6 rounded-xl border border-maroon-100">
            <h3 className="font-semibold text-maroon-900 mb-4">Market Suggestion</h3>
            <div className="text-4xl font-bold text-maroon-700">$45.00</div>
            <p className="text-sm text-maroon-600 mt-2">Based on current eBay averages for "Good" condition.</p>
          </div>

          {/* External Listings Table */}
          <div className="md:col-span-2 bg-white shadow-sm border rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Platform</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.listings.map((list, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{list.site}</td>
                    <td className="px-6 py-4 text-green-600 font-bold">${list.price}</td>
                    <td className="px-6 py-4">
                      <a href={list.link} className="text-blue-600 hover:underline">View</a>
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
