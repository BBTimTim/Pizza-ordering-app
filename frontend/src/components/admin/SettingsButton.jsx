import React from 'react'

export default function SettingsButton() {
  return (
    <div>
     <div className="hidden origin-top-left absolute left-0 
                        mt-2 w-56 rounded-md shadow-lg bg-white
                        ring-1 ring-black ring-opacity-5 
                        animate-fadeIn"
                 id="dropdownMenuLeft">
                <a href="#" className="block px-4 py-2 text-sm 
                                   text-gray-700 
                                   hover:bg-gray-100">
                  Pizzák
                  </a>
                <a href="#" className="block px-4 py-2 text-sm
                                   text-gray-700 
                                   hover:bg-gray-100">
                  Pizza hozzáadása
                  </a>
                <a href="#" className="block px-4 py-2 text-sm
                                   text-gray-700 
                                   hover:bg-gray-100">
                  Feltétek
                  </a>
                   <a href="#" className="block px-4 py-2 text-sm
                                   text-gray-700 
                                   hover:bg-gray-100">
                  Méretek
                  </a>
            </div>
    </div>
  )
}
