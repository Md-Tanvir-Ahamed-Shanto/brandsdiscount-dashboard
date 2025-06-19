import { ChevronDown, ChevronRight, PlusCircle } from "lucide-react";
import { useState } from "react";

const Categories = ({ categoriesStructure }) => {
    const [expandedParent, setExpandedParent] = useState(null); 
    const [expandedSub, setExpandedSub] = useState(null);
    return (
      <div className="p-4 md:p-6">
        <h3 className="text-2xl font-semibold text-white mb-6">Product Categories</h3>
        <div className="space-y-4">
          {categoriesStructure.map(parentCat => (
            <div key={parentCat.parent} className="bg-gray-800 rounded-xl shadow-lg">
              <button onClick={() => setExpandedParent(expandedParent === parentCat.parent ? null : parentCat.parent)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700/50 rounded-t-xl">
                <span className="text-xl font-medium text-white">{parentCat.parent}</span>
                <ChevronDown size={24} className={`text-gray-400 transition-transform ${expandedParent === parentCat.parent ? 'rotate-180' : ''}`} />
              </button>
              {expandedParent === parentCat.parent && (
                <div className="p-4 border-t border-gray-700 space-y-3">
                  {parentCat.subCategories.map(subCat => (
                    <div key={subCat.id} className="bg-gray-750 rounded-lg">
                       <button onClick={() => setExpandedSub(expandedSub === subCat.id ? null : subCat.id)} className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-600/50 rounded-t-lg">
                          <span className="text-lg text-gray-200">{subCat.name}</span>
                          <ChevronRight size={20} className={`text-gray-500 transition-transform ${expandedSub === subCat.id ? 'rotate-90' : ''}`} />
                      </button>
                      {expandedSub === subCat.id && (
                          <div className="p-3 border-t border-gray-600">
                              <ul className="list-disc list-inside ml-4 text-gray-300 space-y-1">{subCat.types.map(type => (<li key={type.id}>{type.name} <span className="text-xs text-gray-500">(ID: {type.id.substring(0,8)}...)</span></li>))}</ul>
                               <button className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 flex items-center"><PlusCircle size={16} className="mr-1"/> Add New Type</button>
                          </div>
                      )}
                    </div>
                  ))} <button className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 flex items-center"><PlusCircle size={16} className="mr-1"/> Add New Sub-Category</button>
                </div>
              )}
            </div>
          ))}
        </div> <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center"><PlusCircle size={20} className="mr-2"/> Add Parent Category</button>
      </div>
    );
  };

  export default Categories;