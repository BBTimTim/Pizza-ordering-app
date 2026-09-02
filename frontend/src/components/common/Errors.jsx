import React  from "react";

export default function Errors({ errors }) {

function errorDisplay(errors) {
  let result = [];

  for (const key in errors) {
    result.push(
      <span
        key={key}
        className="bg-red-100 text-red-700 font-medium text-center px-5 py-2 rounded-full"
      >
        {errors[key][0]}
      </span>
    );
  }

  return result;
}

if (!errors) return null; 

     return ( 
     <div className="flex flex-col justify-center items-center gap-2 py-5 mb-2">
         {errorDisplay(errors)} 
    </div> 
   ); 
}