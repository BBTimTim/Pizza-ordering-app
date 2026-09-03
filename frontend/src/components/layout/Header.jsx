import React from "react";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import SettingsButton from "../admin/SettingsButton";
import { selectCurrentUser } from "../redux/auth/authSlice";

export default function Header() {
  const user = useSelector(selectCurrentUser);

  // const product = useSelector((state) => state.cart.cart.products);

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
                  <a
                    className="text-red-600 transition hover:text-red-500/75"
                    href="#"
                  >
                    Rólunk
                  </a>
                </li>
                <li>
                  <a
                    className="text-red-600 transition hover:text-red-500/75"
                    href="/contact"
                  >
                    Üzenj nekünk
                  </a>
                </li>
                <li>
                  <a
                    className="text-red-600 transition hover:text-red-500/75"
                    href="#"
                  >
                    Pizzák
                  </a>
                </li>

                <li className="flex items-center space-x-4">
                  <Link className="relative">
                    <FaShoppingCart className="text-lg" />
                    {/* {product.length > 0 ? (
                      product.length
                    ) : (
                      <span className="absolute top-0 text-xs w-3 left-3 bg-red-600 rounded-full flex justify-center items-center text-white">
                        {product.length}
                      </span>
                    )} */}
                  </Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <Link
                        className="transition hover:text-red-700/75"
                        to="/profile"
                      >
                        Profilom
                      </Link>
                    </li>

                    {user.role === "admin" && (
                      <li>
                        <SettingsButton />
                      </li>
                    )}

                    <li>
                      <Link className="transition hover:text-red-700/75" to="/">
                        Kilépés
                      </Link>
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
