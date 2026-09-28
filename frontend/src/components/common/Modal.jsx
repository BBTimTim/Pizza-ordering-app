import { useContext } from 'react'
import { ModalContext } from '../context/ModalContext'
import { RxQuestionMarkCircled } from "react-icons/rx";
import ModalShell from './ModalShell';

// Igen/Mégsem kérdés. Alapból a közös ModalContext zárja be, helyi használatnál (pl. törlés) onCancel adható.
export default function Modal({ children, onConfirm, onCancel, confirmLabel = "Igen", cancelLabel = "Mégsem" }) {

    const {handleClose} = useContext(ModalContext);
    const close = onCancel ?? handleClose;

  return (
    <ModalShell onClose={close}>
      {(titleId) => (
        <>
        <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
           <RxQuestionMarkCircled className='text-red-700'/>
        </div>
        <div>
            <h2 id={titleId} className="text-gray-900 text-center font-semibold mt-4 text-xl">{children}</h2>
        </div>
        <div className="flex items-center justify-center gap-4 mt-5 w-full">
            <button onClick={close} type="button" className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition">
                {cancelLabel}
            </button>
            <button onClick={onConfirm} type="button" className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition">
                {confirmLabel}
            </button>
        </div>
        </>
      )}
    </ModalShell>
  )
}
