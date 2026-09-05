import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  removeItemFromCart,
  setCart,
} from "../redux/cartSlice";
import { FaTrashAlt } from "react-icons/fa";

import config from "../../../config";

const { api_url, img_url } = config;

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [success, setSuccess] = useState(null);

  const dispatch = useDispatch();

  const fetchCart = async () => {
    const res = await fetch(`${api_url}/cart`);
    const result = await res.json();

    dispatch(setCart(result.data));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div>
      <div>
        <h2>Kosár</h2>

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

        {cartItems.length === 0 ? (
          <p>A kosarad üres.</p>
        ) : (
          <div>
      
            <div>
              {cartItems.map((product) => (
                <div key={product.id}>
                  <div>
                    <img
                      src={`${img_url}/products/${product?.image}`}
                      alt={product.name}
                    />

                    <div>
                      <h3>{product.name}</h3>
                    </div>
                  </div>

                  <div>
                    <p>{product.price} Ft</p>

                    <div className="flex">
                      <button>-</button>

                      <div className="flex">
                        <button>-</button>

                        <p>{product.quantity}</p>

                        <button>+</button>
                      </div>
                    </div>

                    <p>
                      {(product.quantity * product.price)} Ft
                    </p>

                    <button onClick={() => removeItemFromCart(product.id)}>
                      <FaTrashAlt className="text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        <div>
          <h3>Rendelés összesítése</h3>

          <div>
            <span>Termékek:</span>
            <span>{totalQuantity}</span>
          </div>

          <div>
            <span>Részösszeg:</span>
            <span>{totalAmount} Ft</span>
          </div>

          <button onClick={() => dispatch(clearCart())}>
            Kosár ürítése
          </button>
        </div>
      </div>
    </div>
  );
}