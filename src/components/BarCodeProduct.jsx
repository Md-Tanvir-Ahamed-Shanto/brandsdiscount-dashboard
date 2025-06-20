/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import { Plus, Minus, ShoppingCart, CircleMinus } from "lucide-react"

// Mock hooks for demonstration - replace with your actual implementations
const useBulkUpdateMutation = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  const updateBulk = async (data) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    return { unwrap: () => Promise.resolve({ success: true }) }
  }
  
  return [updateBulk, { isLoading }]
}

const useMultipleProductData = (skus) => {
  // Mock product data - replace with your actual hook
  return skus.map(sku => ({
    sku,
    title: `Product ${sku}`,
    itemLocation: `Location ${sku}`,
    brandName: `Brand ${sku}`,
    salePrice: Math.random() * 100 + 10,
    stockQuantity: Math.floor(Math.random() * 50) + 1
  }))
}

// Mock toast for demonstration
const toast = {
  success: (message) => {
    console.log('Success:', message)
    // You can replace this with your preferred notification system
  },
  error: (message) => {
    console.log('Error:', message)
    // You can replace this with your preferred notification system
  }
}

const BarCodeProductList = ({ initialScannedSkus = [] }) => {
  // State for all scanned products
  const [scannedProducts, setScannedProducts] = useState([])

  // State for quantities, using SKU as key
  const [quantities, setQuantities] = useState({})

  // State for quantities, using SKU as key
  const [deletedSkus, setDeletedSkus] = useState(new Set())

  const handleDelete = sku => {
    setDeletedSkus(prev => new Set(prev).add(sku))
  }

  // Audio ref for check sound
  const audioRef = useRef(null)
  
  // Function to play check sound
  const playCheckSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(error => {
        console.error("Error playing sound:", error)
      })
    }
  }

  const [updateBulk, { isLoading }] = useBulkUpdateMutation()

  // Combine all product data
  const allProducts = useMultipleProductData(initialScannedSkus)

  useEffect(() => {
    // Run only if initialScannedSkus is non-empty
    if (initialScannedSkus.length === 0) return

    initialScannedSkus.forEach((sku, i) => {
      setTimeout(() => {
        playCheckSound()
        setScannedProducts(prev => [...prev, sku])
        setQuantities(prev => ({ ...prev, [sku]: 1 }))
        toast.success(`Product ${sku} scanned`)
      }, (i + 1) * 3000) // staggered delay
    })
  }, [initialScannedSkus])

  // Function to increase quantity
  const increaseQuantity = sku => {
    setQuantities(prev => ({
      ...prev,
      [sku]: (prev[sku] || 1) + 1
    }))
  }

  // Function to decrease quantity, but not below 1
  const decreaseQuantity = sku => {
    setQuantities(prev => ({
      ...prev,
      [sku]: Math.max(1, (prev[sku] || 1) - 1)
    }))
  }

  // Function to confirm all products
  const confirmAllProducts = async () => {
    if (allProducts.length === 0) return

    // Create the product objects array
    const productsData = allProducts
      ?.filter(product => !deletedSkus.has(product.sku))
      ?.map(product => ({
        sku: product.sku,
        quantity: quantities[product.sku] || 1
      }))

    // Log the data format
    console.log({
      data: productsData
    })

    try {
      const response = await updateBulk({
        data: productsData
      }).unwrap() // Ensure id is passed

      if (response?.success) {
        // Show success toast
        toast.success(`${productsData.length} products checkout successfully!!`)
        playCheckSound()

        // ✅ Reset quantities to 0 for only scanned products
        setQuantities(prev => {
          const updatedQuantities = { ...prev }
          scannedProducts.forEach(sku => {
            updatedQuantities[sku] = 0 // or delete if you want to completely remove
          })
          return updatedQuantities
        })

        // ✅ Optionally clear scanned products
        setScannedProducts([])
        window.location.reload()
      }
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to update product"
      toast.error(errorMessage)
      console.error("Error updating product:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {/* Audio element for check sound */}
      <audio ref={audioRef} src="/sounds/check.mp3" />

      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl text-white font-bold">Product Scanner</h1>
        <button
          onClick={confirmAllProducts}
          disabled={allProducts?.length === 0}
          className="ml-auto flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> 
          Confirm All Products
        </button>
      </div>

      {allProducts.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">Waiting for products...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-500">
                <th className="border border-gray-300 px-4 py-2 text-left text-white">SKU</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-white">Product Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-white">Location</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-white">Brand</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-white">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-white">Stock</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-white">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts
                ?.filter(product => !deletedSkus.has(product?.sku))
                .map(product => (
                  <tr key={product?.sku} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{product?.sku}</td>
                    <td className="border border-gray-300 px-4 py-2">{product?.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{product?.itemLocation}</td>
                    <td className="border border-gray-300 px-4 py-2">{product?.brandName}</td>
                    <td className="border border-gray-300 px-4 py-2">${product?.salePrice?.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">{product?.stockQuantity}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(product?.sku)}
                          disabled={(quantities[product?.sku] || 1) <= 1}
                          className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4 text-black" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quantities[product?.sku] || 1}
                        </span>
                        <button
                          onClick={() => increaseQuantity(product?.sku)}
                          className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-4 w-4 text-black" />
                        </button>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center justify-center">
                        <button
                          className="p-1 hover:bg-red-50 rounded transition-colors"
                          onClick={() => handleDelete(product?.sku)}
                        >
                          <CircleMinus className="h-5 w-5 hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BarCodeProductList