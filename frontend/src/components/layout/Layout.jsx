import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
 

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 py-8">
        <main className="w-full max-w-[1350px] min-h-[calc(100vh-450px)] md:shadow-md mx-auto md:py-5 md:rounded-xl bg-white">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
