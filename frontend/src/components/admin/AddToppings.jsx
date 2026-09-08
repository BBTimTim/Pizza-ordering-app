import React, { useState } from "react";
import Errors from "../common/Errors";
import Loader from "../common/Loader";
import { useAddToppingMutation } from "../redux/toppings/toppingSlice";

export default function AddToppings() {
  const [toppings, setToppings] = useState({
    name: "",
    price: 0,
  });

  const [AddToppings, { isLoading, isSuccess, data, error }] =
    useAddToppingMutation();

  const handleChange = (e) => {
    setToppings({ ...toppings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toppings.name.trim()) return;

    try {
      await AddToppings({
        name: toppings.name.trim(),
        price: Number(toppings.price),
      }).unwrap();

      setToppings({ 
        name: "", 
        price: 0 
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
              Feltét
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={toppings.name}
              placeholder="Feltét"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Ár (Ft)
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              name="price"
              value={toppings.price}
              placeholder="Forint"
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
