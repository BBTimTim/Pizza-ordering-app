import { createContext, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    setModalType(null);
  };

  const handleOpen = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleConfirmationOpen = () => {
    setModalType("confirmation");
    setOpen(true);
  };

  
  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  const handleCart = () => {
    handleClose();
    navigate("/cart", { replace:true })
  };
 
  return (
    <ModalContext.Provider
      value={{
        handleClose,
        handleOpen,
        handleCart,
        open,
        handleLogout,
        modalType,
        handleConfirmationOpen
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
