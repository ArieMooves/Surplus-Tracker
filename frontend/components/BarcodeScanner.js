"use client";
import { useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

export default function BarcodeScanner({ onScanSuccess }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 15, // Higher FPS for faster barcode capture
      qrbox: { width: 300, height: 150 }, 
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      // This forces the camera to ignore QR codes and focus on barcodes
      formatsToSupport: [ 1, 4, 5, 6, 7 ], // Code 39, Code 128, UPC-A, UPC-E, EAN-13
    }, false);

    scanner.render(onScanSuccess, (err) => { /* Ignore noisy errors */ });

    return () => {
      scanner.clear().catch((e) => console.error("Scanner clear failed", e));
    };
  }, [onScanSuccess]);

  return (
    <div className="overflow-hidden rounded-2xl border-4 border-brand-maroon/10">
      <div id="reader" className="w-full"></div>
      <style jsx global>{`
        #reader { border: none !important; }
        #reader__dashboard_section_csr button {
          background-color: #7D2242 !important; 
          color: white !important;
          border-radius: 12px !important;
          padding: 10px 20px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
        }
      `}</style>
    </div>
  );
}
