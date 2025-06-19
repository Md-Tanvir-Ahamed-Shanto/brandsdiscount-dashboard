import { CheckCircle, Store, UploadCloud } from "lucide-react";

const Inventory = ({ currentUser }) => {
  return (
    <div className="p-4 md:p-6 text-gray-300">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Inventory Management (Physical Store Sales)
      </h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Store size={24} className="mr-3 text-indigo-400" /> Point of Sale -
          Item Scan (Future Functionality)
        </h3>
        <p className="text-gray-400 mb-3">
          This section is designated for processing sales from the physical
          store. When an item is sold, the cashier will scan its barcode using a
          POS scanner.
        </p>
        <div className="border border-dashed border-gray-600 rounded-lg p-8 text-center my-6">
          <UploadCloud size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-500">Item scanning interface will be here.</p>
          <p className="text-xs text-gray-600 mt-2">
            (Simulated: Barcode scanner input)
          </p>
        </div>
        <h4 className="text-lg font-semibold text-white mt-6 mb-2">
          Process Flow:
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>Cashier scans the item's barcode.</li>
          <li>
            The system identifies the product and its current inventory count.
          </li>
          <li>
            Upon completion of the sale:
            <ul className="list-circle list-inside ml-6 mt-1 space-y-1 text-gray-500">
              <li>
                The product will be marked as **sold from the Physical Store**.
              </li>
              <li>
                Inventory for this item will be **deducted by one (or scanned
                quantity)**.
              </li>
              <li>
                An order will be generated in the "Orders" section, marked with
                "Physical Store" as the source.
              </li>
              <li>
                A **notification will be triggered** (e.g., "Item XYZ sold from
                Physical Store, inventory updated").
              </li>
              <li>
                The system will then (conceptually) **update the inventory
                levels on connected platforms**: eBay1, eBay2, eBay3, Walmart,
                SHEIN, and WooCommerce to ensure synchronization.
              </li>
            </ul>
          </li>
        </ul>
        {currentUser.role === "Cashier" && (
          <div className="mt-6 p-4 bg-green-800/30 border border-green-700 rounded-lg">
            <p className="text-green-300 font-medium">
              <CheckCircle size={20} className="inline mr-2" /> As a Cashier,
              you will primarily use this section to record in-store sales.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
