import React, { useEffect, useState } from "react"
import BarCodeProductList from "./BarCodeProduct"
import { SCANDIT_KEY } from "../config/env"

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState(null)
  const [buffer, setBuffer] = useState("")
  const [lastKeyTime, setLastKeyTime] = useState(Date.now())
  const [scannedSkus, setScannedSkus] = useState([])

  useEffect(() => {
    const loadScandit = async () => {
      try {
        // Dynamically load the UMD bundle
        await import("https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/scandit-sdk.min.js")

        // Now Scandit is available as window.ScanditSDK
        await window.ScanditSDK.configure(SCANDIT_KEY, {
          engineLocation: "https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/"
        })

        console.log("Scandit SDK loaded (camera not used)")
      } catch (error) {
        console.error("Scandit setup failed:", error)
      }
    }

    loadScandit()
  }, [])

  useEffect(() => {
    const handleKeyDown = e => {
      const now = Date.now()

      if (now - lastKeyTime > 100) setBuffer("")

      if (e.key === "Enter") {
        if (buffer) {
          setScannedCode(buffer)
          setScannedSkus(prev => [...prev, buffer])
        }
        setBuffer("")
      } else if (e.key.length === 1) {
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
        <p className="mt-2 text-sm text-gray-200">Scanner ready. Just scan any code.</p>
      </div>
      <hr className="mt-6 rounded" />
      <BarCodeProductList initialScannedSkus={scannedSkus} />
    </>
  )
}

export default BarcodeScanner