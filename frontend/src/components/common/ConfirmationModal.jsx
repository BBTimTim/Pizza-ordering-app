import { useContext } from 'react'
import { ModalContext } from '../context/ModalContext'
import { BsFillCartCheckFill } from "react-icons/bs";
import ModalShell from './ModalShell';

export default function ConfirmationModal({ children, onConfirm }) {

    const {handleClose} = useContext(ModalContext);

  return (
    <ModalShell onClose={handleClose}>
      {(titleId) => (
        <>
        <div className="flex items-center justify-center p-4 bg-green-100 rounded-full">
           <BsFillCartCheckFill className='text-green-700 text-3xl'/>
        </div>
        <div>
            <h2 id={titleId} className="text-gray-900 text-center font-semibold mt-4 text-xl">{children}</h2>
        </div>
        <div className="flex items-center justify-center gap-4 mt-5 w-full">
            <button onClick={handleClose} type="button" className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition">
                Vásárlás folytatása
            </button>
            <button onClick={onConfirm} type="button" className="w-full md:w-36 h-10 rounded-md text-white bg-green-600 font-medium text-sm hover:bg-green-700 active:scale-95 transition">
                Rendelés leadása
            </button>
        </div>
        </>
      )}
    </ModalShell>
  )
}
