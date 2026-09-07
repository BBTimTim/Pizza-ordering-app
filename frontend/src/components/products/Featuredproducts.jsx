import React from "react";
import { useDispatch } from "react-redux";
import config from "../../../config";
import { addItemToCart } from "../redux/cartSlice";
import { useGetFeaturedProductsQuery } from "../redux/products/productSlice";

const { img_url } = config;

export default function Featuredproducts() {
  const { data: products } = useGetFeaturedProductsQuery();

  const dispatch = useDispatch();
  const handleAddToCart = (product) => { dispatch(addItemToCart(product)); };

  return (
    <>
      <div>
        <h2 className="p-2 mt-5 indent-4 bg-red-100 w-40 sm:w-45 rounded-full text-l xl:text-lg font-bold text-red-700 tracking-wide">
          Kedvenceitek
        </h2>

        <div className="flex mt-2 min-h-[150px]">
          <div className="w-full text-red-500 mx-auto">
            <div
              id="slider"
              className="flex overflow-x-scroll space-x-4 rounded-lg no-scrollbar select-none"
            >
              {products?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center justify-around p-4 hover:bg-red-50 transision-all duration-300 flex-shrink-0 scroll-ml-6 md:w-[10vw] xl:w-[15vw] xl:h-[60vh]"
                >
                  <div className="relative w-[200px] h-[220px] sm:w-[300px] sm:h-[300px] object-cover hover:rotate-[60deg] transition-all duration-500">
                    {item.image && (
                      <img
                        src={`${img_url}/products/${item?.image}`}
                        alt={item.name}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-col gap-4 items-center justify-center">
                    <h1 className="text-xl font-vold uppercase sc:text-l xl:text-2xl 2xl:text-3xl">
                      {item.name}
                    </h1>
                    <p className="p-4 2xl:p-8">{item.description}</p>
                    <span className="text-l font-bold">{item.price} Ft</span>
                    <div className="py-2">
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
          </div>
        </div>
      </div>
    </>
  );
}
