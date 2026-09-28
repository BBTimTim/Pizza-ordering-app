import { useContext } from 'react'
import { ModalContext } from '../context/ModalContext'
import { RxQuestionMarkCircled } from "react-icons/rx";

export default function Modal({ children, onConfirm }) {

    const {handleClose} = useContext(ModalContext);

  return (
     <div onClick={(e) => {
            if (e.target.className === "modal-wrapper") {
              handleClose();
            }
          }}
          className="modal-wrapper mx-auto fixed inset-5 z-[9999] top-55 flex flex-col items-center justify-center bg-white shadow-md rounded-xl py-5 px-4 w-[300px] h-[180px] sm:w-[370px] sm:h-[200px] md:w-[460px] md:h-[250px] border border-gray-200">
        <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
           <RxQuestionMarkCircled className='text-red-700'/>
        </div>
        <div>
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">{children}</h2>
        </div>
        <div className="flex items-center justify-center gap-4 mt-5 w-full">
            <button onClick={handleClose} type="button" className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition">
                Mégsem
            </button>
            <button onClick={onConfirm} type="button" className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition">
                Igen
            </button>
        </div>
     </div>
  )
}
