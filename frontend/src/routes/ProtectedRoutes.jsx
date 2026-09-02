import { Outlet, Navigate } from "react-router-dom";
import React from 'react';
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../components/redux/auth/authSlice";

export default function ProtectedRoutes() {
   const  token  = useSelector(selectCurrentToken)

    if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
