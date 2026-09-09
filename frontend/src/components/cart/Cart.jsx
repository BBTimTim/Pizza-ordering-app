import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, clearCart, removeItemFromCart} 
from "../redux/cart/cartSlice";
import config from "../../../config";
import EmptyCart from "./EmptyCart";
import { Link } from "react-router-dom";

const { img_url } = config;

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const shippingCharge = useSelector((state) => state.cart.shippingCharge);
  const grandTotal = useSelector((state) => state.cart.grandTotal);

  const dispatch = useDispatch();

  return (
    <>
        {cartItems.length === 0 ? (
         <EmptyCart />
        ) : (
          <section className="px-4 md:px-8 mt-6">
            <div className="max-w-2xl mx-auto lg:max-w-7xl">
              <div className="mb-12">
                <h1 className="text-2xl font-bold text-slate-900">Kosár</h1>
              </div>

              <div className="grid gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ul className="space-y-12 sm:space-y-8">
                    {cartItems.map((item, i) => (
                      <li
                        className="grid sm:grid-cols-3 items-start gap-4"
                        key={i}
                      >
                        <div className="flex flex-col sm:items-center sm:flex-row gap-4 sm:col-span-2">
                          <div className="shrink-0 bg-gray-100 p-2 rounded-md sm:w-28 sm:h-28 dark:bg-neutral-800">
                            <img
                              className="w-full h-full object-contain"
                              alt={item.name}
                              src={`${img_url}/products/${item?.image}`}
                            />
                          </div>
                          
                          <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                              {item.name} 
                            </h3>

                             <div className="mt-1">
                               {item.sizes.filter(size => item.selectedSize?.includes(String(size.id)))
                                  .map(size => (
                                    <p className="text-sm italic" key={size.id}>
                                     Méret: {size.name} cm
                                    </p>
                                  ))}
                                <h5 className="font-semibold text-sm">Extra feltétek:</h5>
                                {item?.toppings.filter(topping => item.selectedToppings.includes(String(topping.id)))
                                  .map(topping => (
                                    <p className="text-sm italic" key={topping.id}>
                                      {topping.name} - {topping.price} Ft
                                    </p>
                                  ))}
                             </div>
                          
                            <div className="flex gap-2">
                              <div className="flex items-center px-2.5 py-1.5 border border-slate-300 text-slate-900 font-medium text-xs rounded-md sm:mt-6 dark:border-neutral-700 dark:text-slate-50 dark:bg-neutral-800">
                                <button
                                  onClick={() => dispatch(removeItemFromCart(item))}
                                  type="button"
                                  aria-label="Decrease quantity"
                                  className="cursor-pointer focus:outline-none focus-visible:ring-2
                                    focus-visible:ring-blue-500 rounded"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-2.5 fill-current"
                                    viewBox="0 0 124 124"
                                  >
                                    <path
                                      d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                                      data-original="#000000"
                                    ></path>
                                  </svg>
                                </button>
                                <span className="mx-3">{item.quantity} db</span>
                                <button
                                  onClick={() =>
                                    dispatch(addItemToCart(item))
                                  }
                                  type="button"
                                  aria-label="Increase quantity"
                                  className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-2.5 fill-current"
                                    viewBox="0 0 42 42"
                                  >
                                    <path
                                      d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                                      data-original="#000000"
                                    ></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="sm:ml-auto">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                            {item.price} Ft
                          </h3>
                        </div>
                      </li>
                    ))}

                  </ul>
                </div>

                <div className="bg-gray-100 border border-slate-200 rounded-md p-6 h-max md:sticky md:top-0">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Rendelés részletei
                  </h2>

                  <ul className="text-slate-600 font-medium mt-8 space-y-4">
                    <li className="flex flex-wrap gap-4 text-sm">
                      Szállítási költség
                      <span className="ml-auto text-slate-900 font-semibold">
                        {shippingCharge} Ft
                      </span>
                    </li>

                    <li className="flex flex-wrap gap-4 text-sm text-slate-900">
                      Részösszeg:
                      <span className="ml-auto font-semibold">
                        {totalAmount} Ft
                      </span>
                    </li>

                     <li className="flex flex-wrap gap-4 text-sm text-slate-900">
                      Fizetendő:
                      <span className="ml-auto font-semibold">
                        {grandTotal} Ft
                      </span>
                    </li>
                  </ul>

                  <div className="mt-8 space-y-3 text-center">
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-white text-sm font-semibold rounded-md cursor-pointer bg-blue-600 hover:bg-blue-700"
                    >
                      <Link to="/addorder">
                       Rendelés véglegesítése
                      </Link>
                      
                    </button>
                    <button
                      onClick={() => dispatch(clearCart())}
                      type="button"
                      className="w-full px-4 py-2.5 text-white text-sm font-semibold rounded-md cursor-pointer bg-gray-600 hover:bg-gray-700"
                    >
                      Kosár ürítése
                    </button>
                    <a
                      href="/products"
                      className="inline-block text-blue-700 text-sm font-semibold"
                    >
                      Folytatom a vásárlást
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
    </>
  );
}
