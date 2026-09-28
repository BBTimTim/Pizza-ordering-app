import { useContext } from "react";
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
      className="flex py-2 px-4 md:px-8 bg-white border-b border-red-300 min-h-[68px] relative z-20"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 lg:gap-8 w-full">
        <Link
          to="/"
          className="min-w-9 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded shrink-0"
        >
          <div className="flex items-center md:gap-2">
            <img
              src="images/slice.png"
              alt="logo"
              className="w-[30px] md:w-[60px]"
            />
            <h1 className="text-lg font-bold text-heading md:text-5xl lg:text-2xl">
              <span className="text-transparent px-2 bg-clip-text bg-gradient-to-r to-red-500 from-red-200">
                One More
              </span>
              Slice
            </h1>
          </div>
        </Link>
        <input type="checkbox" id="menu-toggle" className="hidden peer" />
        <div
          id="collapseMenu"
          tabIndex="-1"
          className="hidden peer-checked:block lg:flex lg:items-center rounded-bl-lg max-lg:bg-white max-lg:w-1/2 max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:h-[350px] max-lg:shadow-md max-lg:overflow-auto max-sm:w-[180px] z-50 outline-none"
        >
          <div className="flex justify-end p-4 lg:hidden">
            <label
              htmlFor="menu-toggle"
              className="cursor-pointer focus:outline-none"
            >
              <span className="sr-only">Close main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 fill-slate-900"
                viewBox="0 0 329.269 329"
              >
                <path d="M194.8 164.5l127.5-127.5c9.1-9.1 9.1-23.8 0-32.9-9.1-9.1-23.8-9.1-32.9 0L161.9 131.6 34.4 4.1c-9.1-9.1-23.8-9.1-32.9 0-9.1 9.1-9.1 23.8 0 32.9L129 164.5 1.5 292c-9.1 9.1-9.1 23.8 0 32.9 4.5 4.5 10.5 6.8 16.4 6.8s11.9-2.3 16.4-6.8l127.5-127.5 127.5 127.5c4.5 4.5 11.9 4.5 16.4 0 9.1-9.1 9.1-23.8 0-32.9L194.8 164.5z" />{" "}
              </svg>
            </label>
          </div>
          <ul className="flex flex-col gap-4 font-normal text-sm lg:flex-row lg:items-center max-lg:p-6 lg:ml-12">
                <li>
              <Link
                className="text-red-600 transition hover:text-red-500/75"
                to=""
              >
                Kezdőoldal
              </Link>
            </li>
            <li>
              <Link
                className="text-red-600 transition hover:text-red-500/75"
                to="about"
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
                <span className="absolute -right -top-2 md:-top-2 md:-right-2 md:min-w-5 md:h-5 px-1 bg-red-600 rounded-full md:flex md:justify-center items-center text-white text-xs">
                  {cartItems.length}
                </span>
              </Link>
            </li>
            {user ? (
              <>
              <li>
                  <Link
                    className="transition hover:text-red-700/75 text-3xl md:text-xl"
                    to="/user/profile"
                  >
                    <CgProfile />
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpen("logout")}
                    className="group flex items-center md:h-8 md:w-8 h-6 w-7 hover:w-26 overflow-hidden rounded-full bg-red-600 text-white transition-all duration-300 ease-in-out"
                  >
  
                    <div className="flex min-w-8 items-center justify-center">
        
                      <RiLogoutCircleRFill className="text-xl" />
                    </div>
                    <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pr-3 hover:text-red-100">
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
        <div className="flex items-center gap-4 ml-auto shrink-0">
      
          <div className="hidden md:block">
            <Searchinput />
          </div>
          <label
            htmlFor="menu-toggle"
            className="cursor-pointer lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="size-7 fill-slate-900"
              aria-hidden="true"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
      </div>
    </nav>
  );
}
