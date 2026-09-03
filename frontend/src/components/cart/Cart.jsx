import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FaTrashAlt from "react-icons/fa";
import config from "../../../config";
import Errors from "../common/Errors";
import Loader from "../common/Loader";
import { setCart } from "../redux/cartSlice";

const { api_url } = config;

export default function Cart() {
  const cart = useSelector((state) => state.cart);
 
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchCart = async () => {
    setErrors(null);
    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch(`${api_url}/cart`);
      const result = await res.json();

      if (!res.ok) {
        setErrors(result.errors);
        return;
      }
      dispatch(setCart(result.data));
      setSuccess(result.success);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <>
    <div>
      {cart.products.length > 0 ? (
        <div>
          <h3>Kosár</h3>
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
          <div>
            <div>
              <div>
                <p>Termékek</p>
                <div>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>Eltávolítás</p>
                </div>
                <div>
                  {cart.products.map((product) => (
                    <div key={product.id}>
                      <div>
                        <img src={product.image} alt="product-image" />
                        <div>
                          <h3>{product.name}</h3>
                        </div>
                      </div>
                      <div>
                        <p> {product.price} Ft</p>

                        <div className="flex">
                          <button>-</button>
                          <div className="flex">
                            <button>-</button>
                            <p>{product.quantity}</p>
                            <button>+</button>
                          </div>

                        </div>
                        <p>
                          {(product.quantity * product.price).toFixed(2)} Ft
                        </p>

                        <button>
                          <FaTrashAlt classNametext-red-500 hover:text-red-700/>
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
    <div>
        <h3>Rendelés összesítése</h3>
        <div>
            <span>Termékek:</span>
            <span>{cart.totalQuantity}</span>
        </div>
        <div>
            <p></p>
        </div>
    </div>
        </div>
        
      ) : (
        !loading && (
          <div className="text-center text-bold flex justify-center">
            <h1>A kosarad üres</h1>
          </div>
        )
      )}
    </div>
</>
  );
}
