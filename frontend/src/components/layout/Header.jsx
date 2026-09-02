import React from "react";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";

export default function Header() {
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

                <li>
                  <a
                    className="text-red-600 transition hover:text-red-500/75"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    className="text-red-600 transition hover:text-red-500/75"
                    href="/login"
                  >
                    Belépés
                  </a>
                </li>
                <li>
                  <a
                    className="text-red-600 transition hover:text-red-500/75"
                    href="/register"
                  >
                    Regisztráció
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
