import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { ModalContext } from "../context/ModalContext";
import Searchinput from "./Searchinput";

export default function Header() {
  const user = useSelector(selectCurrentUser);
  const { handleOpen } = useContext(ModalContext);
  const cartItems = useSelector((state) => state.cart.items);
  
  return (
<nav
   className="flex py-2 px-4 md:px-8 bg-white border-b border-slate-300 min-h-[68px] relative z-20"
   aria-label="Main navigation">
   <div className="max-w-7xl mx-auto flex items-center gap-4 w-full">
       <Link to="/"  className="min-w-9 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded shrink-0">
          <div className="flex items-center md:gap-2">
                <img src="images/slice.png" alt="logo" className="w-[30px] md:w-[60px]" />
                <h1 className="text-lg font-bold text-heading md:text-5xl lg:text-2xl">
                  <span className="text-transparent px-2 bg-clip-text bg-gradient-to-r to-red-500 from-red-200">
                    One More
                  </span>
                  Slice
                </h1>
              </div>
      </Link>

      <div id="collapseMenu" tabindex="-1"
         className="hidden lg:block max-lg:bg-white max-lg:border-l max-lg:border-slate-300 max-lg:w-1/2 max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto max-sm:w-full z-50 outline-none">

         <div
            className="py-2 px-4 flex items-center justify-between border-b border-slate-300 sticky top-0 bg-white lg:hidden max-lg:min-h-[68px]">
            <Link href="#"
               className="min-w-9 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
               <span className="sr-only">Your Company</span>
               <img src="https://readymadeui.com/logo-alt.svg" alt="readymadeui logo on dialog" className="h-9 w-auto" />
            </Link>
            <button type="button" aria-controls="collapseMenu" id="toggleClose"
               className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
               <span className="sr-only">Close main menu</span>
               <svg xmlns="http://www.w3.org/2000/svg" className="size-4 fill-slate-900"
                  aria-hidden="true" viewBox="0 0 329.269 329">
                  <path
                     d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0"
                     data-original="#000000" />
               </svg>
            </button>
         </div>

         <ul
            className="flex flex-col gap-8 font-semibold text-sm text-slate-900 lg:flex-row max-lg:p-6 lg:ml-12">
            <li>
                 <Link
                                   className="text-red-600 transition hover:text-red-500/75"
                                   to=""
                                 >
                                   Rólunk
                                 </Link>
            </li>
            <li>
              <Link
                                 className="text-red-600 transition hover:text-red-500/75"
                                 to="/contact"
                               >
                                 Üzenj nekünk
                               </Link>
            </li>
            <li>
                   <Link
                                   className="text-red-600 transition hover:text-red-500/75"
                                   to="/products"
                                 >
                                   Pizzák
                                 </Link>
            </li>
            <li>
               <Link
                                 to="/cart"
                                 className="relative transition hover:text-red-700/75 text-lg select-none"
                               >
                                 <FaShoppingCart className="text-xl" />
             
                                 <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1  bg-red-600 rounded-full flex justify-center items-center text-white text-xs ">
                                   {cartItems.length}
                                 </span>
                               </Link>
            </li>
            {user ? (
             <>
                              <li>
                                <Link
                                  className="transition hover:text-red-700/75 text-xl"
                                  to="/user/profile"
                                >
                                  <CgProfile />
                                </Link>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => handleOpen("logout")}
                                  className="group flex items-center h-8 w-8 hover:w-26 overflow-hidden rounded-full bg-red-600 text-white transition-all duration-300 ease-in-out"
                                >
                                  <div className="flex min-w-8 items-center justify-center">
                                    <RiLogoutCircleRFill className="text-xl" />
                                  </div>
                                  <span className="whitespace-now rapopacity-0 group-hover:opacity-100 transition-opacity duration-200 pr-3 hover:text-red-100">
                                    Kilépés
                                  </span>
                                </button>
                              </li>
                            </>
                             ) : (
                                <>
                                                  <li>
                                                    <Link
                                                      className="transition hover:text-red-700/75"
                                                      to="/login"
                                                    >
                                                      Belépés
                                                    </Link>
                                                  </li>
                              
                                                  <li>
                                                    <Link
                                                      className="transition hover:text-red-700/75"
                                                      to="/register"
                                                    >
                                                      Regisztráció
                                                    </Link>
                                                  </li>
                                                </>
                                              )}
         </ul>
      </div>

      <div className="flex items-center gap-4 ml-auto">
         <form className="max-w-xs" role="search">
            <div
               className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-white outline-1 -outline-offset-1 outline-slate-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600">
                <Searchinput/>
            </div>
         </form>

         <button type="button" aria-controls="collapseMenu" aria-expanded="false" aria-haspopup="true" id="toggleOpen"
            className="cursor-pointer lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
            <span className="sr-only">Open main menu</span>
            <svg className="size-7 fill-slate-900" aria-hidden="true" viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg">
               <path fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"></path>
            </svg>
         </button>
      </div>
   </div>
</nav>
  );
}
