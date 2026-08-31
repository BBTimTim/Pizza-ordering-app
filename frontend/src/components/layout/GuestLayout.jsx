import React from 'react'
import { Outlet } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function GuestLayout() {
  return (
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
  )
}
