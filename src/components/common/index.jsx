import React, { useState, useEffect } from 'react';
import { XCircle, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = "lg" }) => {
  if (!isOpen) return null;
  const sizeClasses = { 
    sm: 'max-w-sm', 
    md: 'max-w-md', 
    lg: 'max-w-lg', 
    xl: 'max-w-xl', 
    '2xl': 'max-w-2xl', 
    '3xl': 'max-w-3xl', 
    '4xl': 'max-w-4xl', 
    '5xl': 'max-w-5xl' 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out">
      <div className={`bg-gray-800 p-6 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 animate-modalPopIn`}>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const ImageWithFallback = ({ src, fallbackSrc, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  useEffect(() => { 
    setImgSrc(src); 
  }, [src]);

  return (
    <img 
      src={imgSrc || fallbackSrc} 
      alt={alt} 
      className={className} 
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;
  
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) { 
    pageNumbers.push(i); 
  }

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
      <div className="mb-2 sm:mb-0">
        Showing <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium text-white">{totalItems}</span> results
      </div>
      <div className="flex items-center">
        <label htmlFor="itemsPerPage" className="mr-2">Show:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-gray-700 text-white rounded-md p-1.5 focus:ring-indigo-500 focus:border-indigo-500 mr-3 text-xs"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        {totalPages > 1 && (
          <nav className="flex items-center space-x-1">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50">
              <ChevronsLeft size={16}/>
            </button>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50">
              <ChevronLeft size={16}/>
            </button>
            {pageNumbers.slice(Math.max(0, currentPage-2), Math.min(totalPages, currentPage+1)).map(num => (
              <button 
                key={num} 
                onClick={() => onPageChange(num)} 
                className={`px-3 py-1.5 rounded-md ${currentPage === num ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'}`}
              >
                {num}
              </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50">
              <ChevronRight size={16}/>
            </button>
            <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50">
              <ChevronsRight size={16}/>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

// Add modal animation styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes modalPopIn { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .animate-modalPopIn { animation: modalPopIn 0.2s ease-out forwards; }
  .notification-critical { font-weight: bold; color: #F87171; } 
`;
document.head.appendChild(styleSheet);