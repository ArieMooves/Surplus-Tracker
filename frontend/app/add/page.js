"use client";

import Layout from "../../components/Layout";
import AssetForm from '../../components/AssetForm';
import BackButton from "../../components/BackButton";
// Import the graphic icon
import { FilePlus2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pt-6 px-4">
        <BackButton />
      </div>

      <div className="max-w-2xl mx-auto py-10 px-4">
        {/* MATCHED HEADING DESIGN */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-brand-maroon italic tracking-tighter flex items-center gap-3 uppercase">
            <FilePlus2 size={32} className="text-brand-gold" />
            New Registration
          </h1>
          <p className="text-slate-500 font-medium">
            Add a new item to the MSU Surplus database. Use Gemini to generate professional descriptions.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
           <AssetForm /> 
        </div>
      </div>
    </Layout>
  );
}
