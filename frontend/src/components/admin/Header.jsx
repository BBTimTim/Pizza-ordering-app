import { useContext } from "react";
import { IoMdSearch } from "react-icons/io";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { ModalContext } from "../context/ModalContext";
import SettingsButton from "./SettingsButton";

export default function Header() {
  const { handleOpen } = useContext(ModalContext);

  return (
    <header className="bg-white md:m-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
              <div className="flex items-center md:gap-2">
                <h1 className="text-3xl font-bold text-heading md:text-5xl lg:text-2xl">
                  <span className="text-transparent px-2 bg-clip-text bg-gradient-to-r to-red-500 from-red-200">
                    Admin
                  </span>
                  Oldal
                </h1>
              </div>
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
                  <SettingsButton/>
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
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
