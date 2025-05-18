import React, { useEffect } from 'react'

export const Modal = ({title,children,onClose,isSuccess=false, isError=false}) => {
    useEffect(()=>{
        const handleEscape = (event) => {
            if(event.key === 'Escape'){
                onClose();
            } 
        };

        document.addEventListener('keydown',handleEscape);

        return()=>{
            document.removeEventListener('keydown',handleEscape);
        };
    },[onClose])
    let headerClass = 'bg-gray-100 text-gray-800';
    if(isSuccess){
        headerClass = 'bg-green-500 text-white';
    }
    else if(isError){
        headerClass = 'bg-red-500 text-white';
    }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md mx-auto overflow-hidden">

        <div className={`px-6 py-4 ${headerClass} flex justify-between items-center`}>
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-xl font-semibold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-4">
          {children}
        </div>

        <div className="px-6 py-3 bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
