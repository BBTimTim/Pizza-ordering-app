import React, { useState } from "react";
import { useAddSizeMutation } from "../redux/size/sizeSlice";
import Errors from "../common/Errors";
import Loader from "../common/Loader";

export default function AddSizes() {
  const [size, setSize] = useState({
    name: "",
    price_multiplier: 1,
  });

  const [addSize, { isLoading, isSuccess, data, error }] = useAddSizeMutation();

  const handleChange = (e) => {
    setSize({ ...size, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!size.name) return;
    
    try {
      await addSize({
        name: Number(size.name),
        price_multiplier: Number(size.price_multiplier),
      }).unwrap();
      setSize({ 
        name: "", 
        price_multiplier: 1 
    });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-5">
      <h2 className="text-center font-bold md:text-xl">Új termék hozzáadása</h2>
      {isLoading && <Loader />}

      {isSuccess && (
        <div className="flex justify-center m-5">
          <div
            className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2"
            role="alert"
          >
            <p className="text-green-900 font-bold">{data?.success}</p>
          </div>
        </div>
      )}

      {error && <Errors errors={error?.data?.errors} />}

      <div>
        <form
          onSubmit={handleSubmit}
          className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[600px] mx-auto"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Méret (cm)
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="number"
              name="name"
              value={size.name}
              placeholder="Méret"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price_multiplier"
            >
              Szorzó
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price_multiplier"
              type="number"
              name="price_multiplier"
              value={size.price_multiplier}
              placeholder="Méret"
            />
          </div>

          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              type="submit"
            >
              Mentés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
