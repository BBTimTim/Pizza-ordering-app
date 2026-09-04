import { createContext, useState } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/auth/authSlice";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    setModalType(null);
  };

  const handleOpen = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleLogout = () => {
    dispatch(logOut());
    handleClose();
  };

//   const handleDelete = () => {
//     deleteProfile();
//     handleClose();
//     navigate("/home", { replace: true });
//   };

  return (
    <ModalContext.Provider
      value={{
        handleClose,
        handleOpen,
        open,
        handleLogout,
        modalType,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
