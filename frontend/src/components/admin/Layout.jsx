import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";


export default function Layout() {
  return (
    <div className="w-full">
      <Header />
      <div className="relative md:flex-row w-full">
        <section className="flex items-center justify-center">
          <main className="w-full py-2 max-w-[1350px] min-h-[calc(100vh-150px)] md:shadow-md md:rounded-xl bg-white">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
}
  