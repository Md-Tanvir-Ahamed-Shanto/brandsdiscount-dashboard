import React, { useEffect, useState } from "react";
import { SCANDIT_KEY } from "../config/env";
import BarCodeProductList from "./BarCodeProduct";
import { toast } from "react-toastify";

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState(null);
  const [buffer, setBuffer] = useState(""); 
  const [lastKeyTime, setLastKeyTime] = useState(Date.now()); 
  
  
  const [scannedSkusFromScanner, setScannedSkusFromScanner] = useState([]); 
  
  const [scanditSDK, setScanditSDK] = useState(null); 

  // Load Scandit SDK via CDN (for camera-based scanning if implemented)
  useEffect(() => {
    const loadScanditSDK = async () => {
      try {
        if (!window.ScanditSDK) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/browser/index.js';
          script.onload = async () => {
            try {
              await window.ScanditSDK.configure(SCANDIT_KEY, {
                engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/'
              });
              setScanditSDK(window.ScanditSDK);
              console.log("Scandit SDK loaded via CDN");
            } catch (error) {
              console.error("Scandit configuration failed:", error);
              toast.error("Scandit SDK configuration failed. Check console.");
            }
          };
          script.onerror = () => {
            console.error("Failed to load Scandit SDK from CDN");
            toast.error("Failed to load Scandit SDK. Check internet or CDN path.");
          };
          document.head.appendChild(script);
        } else {
          // SDK already loaded, re-configure (safe to call multiple times)
          await window.ScanditSDK.configure(SCANDIT_KEY, {
            engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/'
          });
          setScanditSDK(window.ScanditSDK);
          console.log("Scandit SDK already loaded and configured.");
        }
      } catch (error) {
        console.error("Scandit setup failed:", error);
        toast.error("Scandit SDK setup failed.");
      }
    };

    loadScanditSDK();
  }, []);

 
  useEffect(() => {
    const handleKeyDown = e => {
      const now = Date.now();

      if (now - lastKeyTime > 100) { 
        setBuffer(""); 
      }

      if (e.key === "Enter") {
        if (buffer) {
          const scannedSku = buffer.trim();
          if (scannedSku) {
            setScannedCode(scannedSku); 
         
            setScannedSkusFromScanner(prev => {
               
                const newSkus = new Set(prev);
                if (!newSkus.has(scannedSku)) {
                    return [...prev, scannedSku];
                }
                return prev; 
            });
          }
        }
        setBuffer(""); // Clear buffer after Enter key
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setBuffer(prev => prev + e.key);
      }

      setLastKeyTime(now); 
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [buffer, lastKeyTime]); 

  return (
    <>
      <h3 className="text-3xl text-white text-center mb-4">Barcode Scanner Input</h3>
      <div className="flex flex-col items-center">
        <div className="text-xl text-white font-semibold">
          {scannedCode
            ? `✅ Last Scanned SKU: ${scannedCode}`
            : "🔍 Waiting for barcode scan..."}
        </div>

        <p className="mt-2 text-sm text-gray-200">
          Ready for keyboard-based barcode scanner input (or manual typing followed by Enter).
        </p>
        
        {/* SDK Status for camera scanning, if applicable */}
        <p className="mt-1 text-xs text-gray-200">
          {scanditSDK ? "✅ Scandit SDK Ready" : "⏳ Loading Scandit SDK for camera scanning..."}
        </p>
      </div>
      <hr className="mt-6 rounded border-gray-700" />
      
      {/* Pass the unique scanned SKUs to the product list component */}
      <BarCodeProductList scannedSkusFromScanner={scannedSkusFromScanner} />
    </>
  );
};

export default BarcodeScanner;