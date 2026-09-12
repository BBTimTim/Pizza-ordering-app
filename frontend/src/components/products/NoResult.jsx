import React from "react";
 
export default function NoResult() {
  return (
    <div className="flex justify-center mx-auto py-5">
      <div className="max-w-md text-center">
        <svg
          fill="#000000"
          viewBox="0 0 36 36"
          version="1.1"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <title>sad-face-line</title>{" "}
            <path
              d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"
              className="clr-i-outline clr-i-outline-path-1"
            ></path>
            <circle
              cx="25.16"
              cy="14.28"
              r="1.8"
              className="clr-i-outline clr-i-outline-path-2"
            ></circle>
            <circle
              cx="11.41"
              cy="14.28"
              r="1.8"
              className="clr-i-outline clr-i-outline-path-3"
            ></circle>
            <path
              d="M18.16,20a9,9,0,0,0-7.33,3.78,1,1,0,1,0,1.63,1.16,7,7,0,0,1,11.31-.13,1,1,0,0,0,1.6-1.2A9,9,0,0,0,18.16,20Z"
              className="clr-i-outline clr-i-outline-path-4"
            ></path>{" "}
            <rect
              x="0"
              y="0"
              width="36"
              height="36"
              fillOpacity="0"
            ></rect>{" "}
          </g>
        </svg>

        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          A keresett szóra nincs találat{" "}
        </h2>

        <a
          href="/products"
          className="mt-6 block w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Vissza a termék oldalra
        </a>
      </div>
    </div>
  );
}
