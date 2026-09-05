import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setProducts } from "../redux/productSlice";
import config from "../../../config";
import { addItemToCart } from "../redux/cartSlice";
import { selectCurrentToken } from "../redux/auth/authSlice";

const { api_url, img_url  } = config;

export default function Products() {

  const token = useSelector(selectCurrentToken);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

const handleAddToCart = (product) => {
    dispatch(addItemToCart(product));
  };

 const fetchProducts = async () => {
    const res = await fetch(`${api_url}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();
    dispatch(setProducts(result.data));
};

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
   <div className="gap-5 grid sm:grid-cols-4 grid-col-2 sm:p-3">
        {products.map((item) => (
          <div key={item.id} className="bg-white shadow-md py-5">
            <img
              className="w-70 sm:w-75 object-cover mx-auto"
              src={`${img_url}/products/${item?.image}`}
              alt={item.name}
            />
            <div className="p-4 text-sm">
              <p className="text-slate-800 text-base font-bold my-1.5">
                {item.name}
              </p>
              <p className="text-slate-500">{item.description}</p>
               <p className="text-slate-600 mt-5">{item.price} Ft</p>
              <div className="mt-3 text-center sm:mt-10">
                <button
                  onClick={() => handleAddToCart(item.id)}
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

