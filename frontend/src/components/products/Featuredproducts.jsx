import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setProducts } from "../redux/productSlice";
import config from "../../../config";
import Errors from "../common/Errors";
import Loader from "../common/Loader";
import { addToCart } from "../redux/cartSlice";

const { api_url } = config;

export default function Featuredproducts() {

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const product = useSelector((state) => state.products);

  const fetchProducts = async () => {
    setErrors(null);
    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch(`${api_url}/featured-products`);
      const result = await res.json();

      if (!res.ok) {
        setErrors(result.errors);
        return;
      }
      dispatch(setProducts(result.data));
      setSuccess(result.success);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
     e.stopPropagation()
     e.preventDefault()
     dispatch(addToCart(product))
     alert("Sikeresen kosárhoz adva")
  }

  return (
    <>
      <div>
        {loading && <Loader />}
        {success && (
          <div className="flex justify-center m-5">
            <div
              className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2"
              role="alert"
            >
              <p className="text-green-900 font-bold ">{success}</p>
            </div>
          </div>
        )}
        {errors && <Errors errors={errors} />}

        <div className="w-screen" overflow-x-scroll text-red-500>
          <div className="w-max flex">

            {product.map((item) => (
            <div key={item.id} className="w-screen h-[60vh] flex-col items-center text-center justify-around p-4 hover:bg-fuchsia-50 transision-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]">
              <div className="relative flex-1 w-full hover:rotate-[60deg] transition-all duration-500">
               {item.image && <img src={item.image} alt={item.name} fill className="object-contain" />}
              </div>
              <div className="flex-1 flex-col gap-4 items-center justify-center">
                <h1 className="text-xl font-vold uppercase xl:text-2xl 2xl:text-3xl">{item.name}</h1>
                <p className="p-4 2xl:p-8">{item.description}</p>
                <span className="text-xl font-bold">{item.price} Ft</span>
                <button onClick={(e) => handleAddToCart(e, product)} className="bg-red-500 text-white p-2 rounded-full">
                  Kosárba
                </button>
              </div>
            </div>
           ))}

        </div>
        </div>
      </div>
    </>
  );
}