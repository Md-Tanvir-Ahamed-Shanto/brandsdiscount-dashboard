import React, { useEffect, useState, useRef, useCallback } from "react"; // Add useRef, useCallback
import { SCANDIT_KEY } from "../config/env";
import { toast } from "react-toastify";
import BarCodeProductList from "./BarCodeProduct";
const SCAN_DEBOUNCE_TIME = 150;

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState(null);
  const [buffer, setBuffer] = useState("");
  const [scannedSkusFromScanner, setScannedSkusFromScanner] = useState([]);
  const [scanditSDK, setScanditSDK] = useState(null);

  const timeoutRef = useRef(null); 

  // Function to process a scanned SKU (memoized to prevent unnecessary re-renders)
  const processScannedSku = useCallback((sku) => {
    if (sku) {
      setScannedCode(sku); 
      setScannedSkusFromScanner(prev => {
       
        const currentUniqueSkus = new Set(prev);
        if (!currentUniqueSkus.has(sku)) {
          return [...prev, sku];
        }
        return prev;
      });
      toast.success(`Product added: ${sku}`); 
    }
    setBuffer(""); 
  }, []); 

  // Load Scandit SDK (existing code, no change needed for this part of the functionality)
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

  // Listen for keyboard-based scanning (hardware scanner or manual keyboard input)
  useEffect(() => {
    const handleKeyDown = e => {
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check if the key pressed is a single printable character (not a modifier key like Ctrl, Alt, Shift)
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Append character to the buffer
        setBuffer(prev => prev + e.key);

        
        timeoutRef.current = setTimeout(() => {
          processScannedSku(buffer + e.key); 
        }, SCAN_DEBOUNCE_TIME);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Clear timeout on component unmount to prevent memory leaks
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [buffer, processScannedSku]);

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
          Ready for keyboard-based barcode scanner input (auto-detects scan completion).
        </p>
        
        {/* SDK Status for camera scanning, if applicable */}
        <p className="mt-1 text-xs text-gray-200">
          {scanditSDK ? "✅ Scandit SDK Ready" : "⏳ Loading Scandit SDK for camera scanning..."}
        </p>
      </div>
      <hr className="mt-6 rounded border-gray-700" />
      
      <BarCodeProductList scannedSkusFromScanner={scannedSkusFromScanner} />
    </>
  );
};

export default BarcodeScanner;