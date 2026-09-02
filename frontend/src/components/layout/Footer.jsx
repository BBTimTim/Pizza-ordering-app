import React from "react";

export default function Footer() {
  return (
    <>
        <footer className="bottom-0 bg-[#C32323] w-full max-w-[1350px] mx-auto text-white pt-8 lg:pt-8 px-4 sm:px-8 md:px-16 lg:px-24 rounded-tl-3xl rounded-tr-3xl overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 md:gap-12">
            <div className="lg:col-span-2">
               <a href="/" className="block">
                   <img
                  src="images/slice.png"
                  alt="logo"
                  className="w-[60px]"
                />
              </a>
            </div>
  
          <div className="lg:col-span-3 md:gap-8 flex items-start">
              <div>
                <h3 className="font-medium text-sm mb-4">Térkép</h3>
              </div>
  
              <div>
                <ul className="space-y-3 text-sm font-medium">
                  <li>
                    <a href="#" className="hover:text-neutral-300">
                      Rólunk
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-neutral-300">
                      ÁSZF
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-neutral-300">
                      Szállítás és fizetés
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="hover:text-neutral-300">
                      Kapcsolat
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
  
          <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-white flex justify-between items-center">
            <p className="text-neutral-200 text-xs mb-2">© 2026 One More Slice</p>
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
