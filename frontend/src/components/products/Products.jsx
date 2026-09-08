import React, { useState } from "react";
import { useDispatch } from "react-redux";
import config from "../../../config";
import { useGetProductsQuery } from "../redux/products/productSlice";
import { useGetSizesQuery } from "../redux/size/sizeSlice";
import { useGetToppingsQuery } from "../redux/toppings/toppingSlice";
import { addItemToCart } from "../redux/cart/cartSlice";

const { img_url } = config;

export default function Products() {
  
  const { data: products } = useGetProductsQuery();
  const { data: sizes } = useGetSizesQuery();
  const { data: toppings } = useGetToppingsQuery();

  const dispatch = useDispatch();

  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedToppings, setSelectedToppings] = useState({});
  const [success, setSuccess] = useState("");

  const handleSelect = (productId, e) => {
    const { value, checked } = e.target;
    const current = selectedToppings[productId] || [];

    if (checked) {
      setSelectedToppings({
        ...selectedToppings,
        [productId]: [...current, value],
      });
    } else {
      setSelectedToppings({
        ...selectedToppings,
        [productId]: current.filter((id) => id !== value),
      });
    }
  };

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    const selectedToppingIds = selectedToppings[product.id] || [];

    dispatch(
      addItemToCart({
        ...product,
        selectedSize,
        selectedToppings: selectedToppingIds,
        sizes: sizes?.data || [],
        toppings: toppings?.data || [],
      }),
    );

    setSuccess("Kosárba helyezve!");

    setTimeout(() => {
      setSuccess("");
    }, 2000);
  };

  return (
    <>
      {success && (
        <div className="flex justify-center m-5">
          <div
            className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2"
            role="alert"
          >
            <p className="text-green-900 font-bold">{success}</p>
          </div>
        </div>
      )}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:p-3">
  {products?.data?.map((item) => (
    <div
      key={item.id}
      className="bg-white shadow-md py-5 flex flex-col"
    >
      <img
        className="w-full max-w-[300px] h-auto object-cover mx-auto"
        src={`${img_url}/products/${item?.image}`}
        alt={item.name}
      />

      <div className="p-4 text-sm flex flex-col flex-1">
        <div>
          <p className="text-slate-800 text-base font-bold my-1.5">
            {item.name}
          </p>

          <p className="text-slate-500 line-clamp-3">
            {item.description}
          </p>
        </div>

        <div className="mt-4">
          <label
            className="text-gray-700 text-sm font-bold block mb-2"
            htmlFor={`size-${item.id}`}
          >
            Méretek:
          </label>

          <select
            name="size"
            id={`size-${item.id}`}
            value={selectedSizes[item.id] || ""}
            className="select w-full"
            onChange={(e) =>
              setSelectedSizes({
                ...selectedSizes,
                [item.id]: e.target.value,
              })
            }
          >
            <option value="" disabled>
              Válassz méretet:
            </option>

            {sizes?.data?.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name} cm -
                {(item.price * size.price_multiplier).toFixed(0)} Ft
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          {toppings?.data?.map((topping) => (
            <label
              className="flex items-center gap-2 py-1"
              htmlFor={`topping-${item.id}-${topping.id}`}
              key={topping.id}
            >
              <input
                type="checkbox"
                className="checkbox"
                id={`topping-${item.id}-${topping.id}`}
                name="toppings"
                value={topping.id}
                onChange={(e) => handleSelect(item.id, e)}
              />

              <span className="text-sm">
                {topping.name} (+{topping.price} Ft)
              </span>
            </label>
          ))}
        </div>

        <div className="mt-auto pt-6 text-center">
          <button
            onClick={() => handleAddToCart(item)}
            className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
          >
            Kosárba
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
    </>
  );
}
