"use client";
import { useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function BarcodeScanner({ onScanSuccess }) {
  useEffect(() => {
    // Supporting a wide range of university-standard barcodes and QR codes
    const formatsToSupport = [
      Html5QrcodeSupportedFormats.QR_CODE,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.CODE_93,
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.ITF,
      Html5QrcodeSupportedFormats.CODABAR,
    ];

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      formatsToSupport,
      rememberLastUsedCamera: true, 
    });

    scanner.render(onScanSuccess, (err) => {
      // Errors are typically "No code found in frame" - we ignore these for UX
    });

    return () => {
      scanner.clear().catch((e) => console.error("Scanner clear failed", e));
    };
  }, [onScanSuccess]);

  return (
    <div className="border-4 border-dashed border-brand-gold/30 rounded-3xl p-4 bg-slate-50">
      <div id="reader" className="rounded-2xl overflow-hidden shadow-inner"></div>
    </div>
  );
}
