import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { ModalContext } from "../context/ModalContext";

export default function Header() {
  const user = useSelector(selectCurrentUser);
  const {handleOpen} = useContext(ModalContext);
    const cartItems = useSelector((state) => state.cart.items);

  return (
    <header className="bg-white md:m-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link to="/">
              <div className="flex items-center md:gap-2">
                <img src="images/slice.png" alt="logo" className="w-[60px]" />
                <h1 className="text-3xl font-bold text-heading md:text-5xl lg:text-2xl">
                  <span className="text-transparent px-2 bg-clip-text bg-gradient-to-r to-red-500 from-red-200">
                    One More
                  </span>
                  Slice
                </h1>
              </div>
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li className="search relative hidden sm:block">
                  <input
                    type="text"
                    name=""
                    placeholder="Keresés"
                    className="transition-all duration-300 rounded-full border border-red-300 px-3 py-1 focus:outline-none"
                  />
                  <IoMdSearch className="text-gray-500 absolute top-1 translate-y-1/3 right-4" />
                </li>
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

                <li className="flex items-center space-x-4">
                  <Link to="/cart" className="relative transition hover:text-red-700/75 text-lg select-none">
                    <FaShoppingCart className="text-xl" />
                     {cartItems.length > 0 ? (
                      cartItems.length
                    ) : (
                      <span className="absolute bottom-3 text-xs w-3 h-4 left-3 p-2 bg-red-600 rounded-full flex justify-center items-center text-white">
                        {cartItems.length}
                      </span>
                    )} 
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
                        onClick={() => handleOpen("logOut")}
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
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
