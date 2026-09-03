import React from "react";
import { Link} from "react-router-dom";
import { FaHome, FaPizzaSlice, FaList } from 'react-icons/fa';
import { IoMdResize } from "react-icons/io";
import { BsCartPlus } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
     <div className="w-64 shadow-lg">
      <div className="bg-slate-800" py-5 px-6>
        <Link className="text-3xl text-white font-semibold">
        <span className="text-red-500">Pizza</span>
        </Link>
         </div>
         <div className="flex flex-col mt-5 text-slate-800 font-medium px-4">
          <Link className="flex items-center gap-3 hover:bg-gray-300 rounded px-3 py-2">
          <FaHome />
          Dashboard
          </Link>
          <Link className="flex items-center gap-3 hover:bg-gray-300 rounded px-3 py-2">
          <FaPizzaSlice />
          Pizzák
          </Link>
          <Link className="flex items-center gap-3 hover:bg-gray-300 rounded px-3 py-2">
          <IoAddCircleSharp />
          Pizza hozzáadása
          </Link>
          <Link className="flex items-center gap-3 hover:bg-gray-300 rounded px-3 py-2">
          <FaList />
          Feltétek
          </Link>
          <Link className="flex items-center gap-3 hover:bg-gray-300 rounded px-3 py-2">
          <IoMdResize />
          Méretek
          </Link>
          <Link className="flex items-center gap-3 hover:bg-gray-300 rounded px-3 py-2">
          <BsCartPlus />
          Rendelések
          </Link>
         </div>
     </div>
     <div className="flex-1">
   <div className="bg-white px-4 py-[20px] border-b border-gray-200 mb-7 flex justify-center items-center shadow border-b border-gray-200">
<div>
  <span className="font-semibold"></span>
</div>
   </div>
     </div>
    </div>
  );
}
