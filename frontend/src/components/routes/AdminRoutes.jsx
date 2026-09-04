import { Outlet, Navigate } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../redux/auth/authSlice";

export default function AdminRoutes() {
  const  token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser)

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.status !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}