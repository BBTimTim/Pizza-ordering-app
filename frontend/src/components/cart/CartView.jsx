import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeItemFromCart } from "../redux/cartSlice";

export default function CartView() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const dispatch = useDispatch();

  return (
    <div>
      <h2>Kosár</h2>

      {cartItems.length === 0 ? (
        <p>A kosarad üres.</p>
      ) : (
        <div>
        {cartItems.map((item) => (
  <ul key={item.id}>
    <li>
      {item.name} (x{item.quantity}) - $
      {item.totalPrice}

      <button
        onClick={() =>
          dispatch(removeItemFromCart(item.id))
        }
      >
        Remove One
      </button>
    </li>
  </ul>
))}

          <h1>Rendelés összesítése:</h1>

          <p>Termékek: {totalQuantity}</p>

          <p>
            Részösszeg: ${totalAmount}
          </p>

          <button onClick={() => dispatch(clearCart())}>
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}