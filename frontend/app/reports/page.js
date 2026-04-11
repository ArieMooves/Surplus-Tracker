"use client";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";

export default function ReportsPage() {
  return (
    <Layout>
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-maroon uppercase tracking-tight">
          Surplus Reports
        </div>
        <p className="text-slate-500">Generate and view asset analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-brand-gold">
          <h3 className="font-bold text-slate-700">Monthly Summary</h3>
          <p className="text-sm text-slate-500 mt-2 italic">Report data generating soon...</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-brand-gold">
          <h3 className="font-bold text-slate-700">Disposal Analytics</h3>
          <p className="text-sm text-slate-500 mt-2 italic">No data available yet.</p>
        </div>
      </div>
    </Layout>
  );
}
