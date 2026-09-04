import React, { useState } from "react";
import { RiSettings3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FaHome, FaPizzaSlice, FaList } from "react-icons/fa";
import { IoMdResize } from "react-icons/io";
import { BsCartPlus } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";

export default function SettingsButton() {
  const [open, setOpen] = useState(false);

  return ( 
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-2xl text-black hover:text-red-700/75 transition"
      >
        <RiSettings3Fill />
      </button>

      {open && (
        <div
          className="absolute left-0 mt-2 w-56 rounded-md bg-white shadow-lg
                     ring-1 ring-black/5 animate-fadeIn z-[9999]"
        >
                       <Link
                        to="/"
                        className="flex items-center gap-3 hover:bg-red-50 text-red-600 rounded px-3 py-2 transition"
                      >
                        <FaHome />
                        Home
                      </Link>
                      <Link
                        to="/admin/products"
                        className="flex items-center gap-3 hover:bg-red-50 text-red-600 rounded px-3 py-2 transition"
                      >
                        <FaPizzaSlice />
                        Pizzák
                      </Link>
                      <Link
                        to="/admin/addproducts"
                        className="flex items-center gap-3 hover:bg-red-50 text-red-600 rounded px-3 py-2 transition"
                      >
                        <IoAddCircleSharp />
                        Pizza hozzáadása
                      </Link>
          
                      <Link
                        to="/admin/toppings"
                        className="flex items-center gap-3 hover:bg-red-50 text-red-600 rounded px-3 py-2 transition"
                      >
                        <FaList />
                        Feltétek
                      </Link>
                      <Link
                        to="/admin/sizes"
                        className="flex items-center gap-3 hover:bg-red-50 text-red-600 rounded px-3 py-2 transition"
                      >
                        <IoMdResize />
                        Méretek
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="flex items-center gap-3 hover:bg-red-50 text-red-600 rounded px-3 py-2 transition"
                      >
                        <BsCartPlus />
                        Rendelések
                      </Link>
          </div>
      )}
    </div>
  );
}