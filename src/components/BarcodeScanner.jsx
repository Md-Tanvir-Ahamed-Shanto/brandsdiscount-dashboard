// SOLUTION 1: Use CDN-based approach (Recommended)
// This avoids bundler issues entirely

import React, { useEffect, useState } from "react"
import { SCANDIT_KEY } from "../config/env"
import BarCodeProductList from "./BarCodeProduct"

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState(null)
  const [buffer, setBuffer] = useState("")
  const [lastKeyTime, setLastKeyTime] = useState(Date.now())
  const [scannedSkus, setScannedSkus] = useState([])
  const [scanditSDK, setScanditSDK] = useState(null)

  // Load Scandit SDK via CDN
  useEffect(() => {
    const loadScanditSDK = async () => {
      try {
        // Load Scandit SDK from CDN
        if (!window.ScanditSDK) {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/browser/index.js'
          script.onload = async () => {
            try {
              await window.ScanditSDK.configure(SCANDIT_KEY, {
                engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/'
              })
              setScanditSDK(window.ScanditSDK)
              console.log("Scandit SDK loaded via CDN")
            } catch (error) {
              console.error("Scandit configuration failed:", error)
            }
          }
          script.onerror = () => {
            console.error("Failed to load Scandit SDK from CDN")
          }
          document.head.appendChild(script)
        } else {
          // SDK already loaded
          await window.ScanditSDK.configure(SCANDIT_KEY, {
            engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/'
          })
          setScanditSDK(window.ScanditSDK)
          console.log("Scandit SDK already loaded")
        }
      } catch (error) {
        console.error("Scandit setup failed:", error)
      }
    }

    loadScanditSDK()
  }, [])

  // Listen for keyboard-based scanning (hardware scanner)
  useEffect(() => {
    const handleKeyDown = e => {
      const now = Date.now()

      // Reset buffer if delay is long
      if (now - lastKeyTime > 100) setBuffer("")

      if (e.key === "Enter") {
        if (buffer) {
          setScannedCode(buffer)
          setScannedSkus(prev => [...prev, buffer])
        }
        setBuffer("")
      } else if (e.key.length === 1) {
        // Only add printable characters
        setBuffer(prev => prev + e.key)
      }

      setLastKeyTime(now)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [buffer, lastKeyTime])

  return (
    <>
      <h3 className="text-3xl text-white text-center mb-4">Barcode Scanner</h3>
      <div className="flex flex-col items-center">
        <div className="text-xl text-white font-semibold">
          {scannedCode
            ? `✅ Scanned SKU: ${scannedCode}`
            : "🔍 Waiting for scan..."}
        </div>

        <p className="mt-2 text-sm text-gray-200">
          Scanner ready. Just scan any code.
        </p>
        
        {/* SDK Status */}
        <p className="mt-1 text-xs text-gray-200">
          {scanditSDK ? "✅ SDK Ready" : "⏳ Loading SDK..."}
        </p>
      </div>
      <hr className="mt-6 rounded" />
      <BarCodeProductList initialScannedSkus={scannedSkus} />
    </>
  )
}

export default BarcodeScanner