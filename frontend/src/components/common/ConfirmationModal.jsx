import React, { useContext } from 'react'
import { ModalContext } from '../context/ModalContext'
import { BsFillCartCheckFill } from "react-icons/bs";

export default function Modal({ children, onConfirm }) {

    const {handleClose} = useContext(ModalContext);
    
  return (
     <div onClick={(e) => {
            if (e.target.className === "modal-wrapper") {
              handleClose();
            }
          }}
          className="modal-wrapper mx-auto fixed inset-5 z-[9999] top-55 flex flex-col items-center justify-center bg-white shadow-md rounded-xl py-5 px-4 w-[300px] h-[180px] sm:w-[370px] sm:h-[200px] md:w-[460px] md:h-[250px] border border-gray-200">
        <div className="flex items-center justify-center p-4 bg-green-100 rounded-full">
           <BsFillCartCheckFill className='text-green-700 text-3xl'/>
        </div>
        <div>
            <h2 className="text-gray-900 text-center font-semibold mt-4 text-xl">{children}</h2>
        </div>
        <div className="flex items-center justify-center gap-4 mt-5 w-full">
            <button onClick={handleClose} type="button" className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition">
                Vásárlás folytatása
            </button>
            <button onClick={onConfirm} type="button" className="w-full md:w-36 h-10 rounded-md text-white bg-green-600 font-medium text-sm hover:bg-green-700 active:scale-95 transition">
                Rendelés leadása
            </button>
        </div>
     </div>
  )
}
