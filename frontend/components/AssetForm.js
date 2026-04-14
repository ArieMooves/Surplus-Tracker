"use client";

import { useState } from "react";

export default function AssetForm() {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    asset_tag: "",
    item_name: "",
    description: "",
    condition: "Good",
    current_status: "surplus",
    location: ""
  });

  const handleGenerateDescription = async () => {
    if (!formData.item_name) {
      alert("Please enter an Item description");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          item_name: formData.item_name, 
          condition: formData.condition || "Good" 
        }),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      if (data.description) {
        setFormData({ ...formData, description: data.description });
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      alert("Failed to connect to Gemini. Make sure your backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting to MSU Database:", formData);
    // You can add your fetch('http://localhost:8000/assets') call here later
  };

  // 4. The View (JSX)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Item Name Input */}
      <div className="flex flex-col">
        <label className="font-bold text-slate-700 text-sm mb-1 uppercase tracking-wider">Item Name</label>
        <input
          type="text"
          className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          value={formData.item_name}
          onChange={(e) => setFormData({...formData, item_name: e.target.value})}
          placeholder="e.g. Dell Latitude 5420"
          required
        />
      </div>

      {/* Description Area with Gemini Button */}
      <div className="flex flex-col">
        <label className="font-bold text-slate-700 text-sm mb-1 uppercase tracking-wider">Description</label>
        <div className="flex items-start gap-2">
          <textarea
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-black"
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Enter details or use the AI generator..."
          />
          
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={loading}
            className="whitespace-nowrap bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:bg-slate-400 shadow-sm font-bold text-xs uppercase tracking-widest"
          >
            {loading ? "Thinking..." : "Auto-fill"}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-maroon-700 text-white py-3 rounded-lg font-black uppercase tracking-widest hover:bg-maroon-800 transition shadow-md mt-4"
      >
        Register Asset
      </button>
    </form>
  );
}
