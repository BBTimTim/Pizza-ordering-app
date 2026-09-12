import React from "react";
import ShowMap from "../map/ShowMap";

export default function Footer() {
  return (
    <>
      <footer className="bottom-0 bg-[#C32323] w-full max-w-[1350px] mx-auto text-white pt-8 lg:pt-8 px-4 sm:px-8 md:px-16 lg:px-24 rounded-tl-3xl rounded-tr-3xl overflow-hidden">
        <div className="flex flex-wrap justify-between">
          <div className="max-w-80">
            <a href="/" className="block">
              <img src="/images/slice.png" alt="logo" className="w-[60px]" />
            </a>
          </div>

          <div className="lg:col-span-2 md:space-y-12">
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <h4 className="py-1 text-lg">Kapcsolat:</h4>
                <p>Email: slice@codessence.fejlessz.hu</p>
                <p>Tel: +36 70 662 67 54</p>
              </li>
            </ul>
            <ul>
              <li>
                <a href="aszf">ÁSZF</a>
              </li>
              <li>
                <a href="privacy">Adatkezelési tájékoztató</a>
              </li>
            </ul>
          </div>

          <div className="max-w-80">
            <p className="text-lg py-1">Címünk:</p>
            <p className="text-sm">Budapest, 1136 Raoul Wallenberg u. 19</p>
            <div className="flex items-center mt-4">
              <div className="w-[full] h-[220px]">
                <ShowMap />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-white flex justify-between items-center">
          <p className="text-neutral-200 text-xs mb-2">
            © {new Date().getFullYear()} One More Slice
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-x-0 -bottom-4 mx-auto w-full max-w-3xl h-full max-h-64 bg-white rounded-full blur-[120px] pointer-events-none"></div>
          <h1 className="md:translate-y-2 text-center font-extrabold leading-[0.8] text-transparent text-[clamp(2rem,8vw,8rem)] [-webkit-text-stroke:1px_#FFFFFF]">
            One More Slice
          </h1>
        </div>
      </footer>
    </>
  );
}
