"use client"; 
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";

export default function InventoryPage() {
  return (
    <Layout>
      <BackButton />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-maroon">Inventory Management</h1>
        <p className="text-slate-500">View and manage all MSU surplus assets.</p>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-400 italic">Inventory list coming soon...</p>
      </div>
    </Layout>
  );
}
