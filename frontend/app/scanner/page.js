import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";

export default function ScannerPage() {
  return (
    <Layout>
      <BackButton />
      <h1 className="text-2xl font-bold text-slate-800">Barcode Scanner</h1>
      <p className="text-slate-500 mt-2">
        Point your camera at an MSU Asset Tag to begin.
      </p>
      
      {/* Scanner logic will go here later */}
      <div className="mt-8 border-2 border-dashed border-slate-300 rounded-xl h-64 flex items-center justify-center bg-white">
        <span className="text-slate-400 italic">Camera Feed Placeholder</span>
      </div>
    </Layout>
  );
}
