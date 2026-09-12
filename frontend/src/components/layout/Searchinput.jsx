import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Searchinput() {

    const [search, setSearch] = useState("");
    const navigate = useNavigate()
    
const handleSubmit = (e) => {
    e.preventDefault();
    
    const searchValue = search.trim();
    if (!searchValue) return;
    navigate(`/products?search=${encodeURIComponent(searchValue)}`);
    setSearch("");
    }

  return (
    <>
   <form className="max-w-xs mx-auto" role="search" onSubmit={handleSubmit}>
   <div
      className="flex items-center gap-2.5 px-3 py-1 relative rounded-full bg-white outline-1 -outline-offset-1 outline-red-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-red-600">
      <label htmlFor="search" className="sr-only">Keresés</label>
      <input type="search" id="search" placeholder="Keresés..." required
         className="text-sm text-red-900 w-full outline-none pr-10" 
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         />
        
      <button type="submit" aria-label="Search"
         className="absolute right-0 h-full px-3 flex items-center justify-center bg-red-600 rounded-r-full cursor-pointer">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" className="size-4 fill-white"
            aria-hidden="true">
            <path
               d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
            </path>
         </svg>
      </button>
   </div>
</form>
    </>
  );
}
