import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";


export default function ProtectedRoutes() {
   const  token  = useSelector(selectCurrentToken)

    if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
