import { useState } from "react";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { useCheckoutMutation } from "../redux/order/orderSlice";
import Loader from "../common/Loader";
import Errors from "../common/Errors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";
import { selectCurrentUser } from "../redux/auth/authSlice";
import StripePayment from "./StripePayment";
import { sendOrderConfirmation } from "./OrderConfirmation";
import { formatPrice } from "./orderStatus";

export default function AddOrder() {

  const cart = useSelector((state) => state.cart);
  const cartItems = cart.items;
  const user = useSelector(selectCurrentUser);

  const [order, setOrder] = useState({
    name: user?.name || "",
    email: user?.email || "",
    zip: "",
    address: "",
    phone: "+36",
    city: "",
    county: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const [success, setSuccess] = useState(null);
  // A szerver által létrehozott, fizetésre váró rendelés (a végösszeget is a szerver számolta)
  const [payment, setPayment] = useState(null);

  const [checkout, { isLoading, error }] = useCheckoutMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Árat nem küldünk: csak azt, mit és hány darabot kér a vásárló
      const result = await checkout({
        ...order,
        items: cartItems.map((item) => ({
          product_id: item.id,
          size_id: item.selectedSize ? Number(item.selectedSize) : null,
          topping_ids: item.selectedToppings.map(Number),
          quantity: item.quantity,
        })),
      }).unwrap();

      setPayment({
        orderId: result.data.id,
        clientSecret: result.client_secret,
        amount: result.data.grand_total,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // A visszaigazolás a szerver által kiszámolt, már kifizetett rendelés adataiból megy ki (EmailJS)
  const handlePaid = async (paidOrder) => {
    const emailSent = await sendOrderConfirmation(paidOrder);
    dispatch(clearCart());
    setPayment(null);
    setSuccess(
      emailSent
        ? "Sikeres rendelés! A visszaigazolást e-mailben elküldtük."
        : "Sikeres rendelés! A visszaigazoló e-mail küldése nem sikerült, a rendelést a profilodban találod.",
    );
    setTimeout(() => {
      navigate(user ? "/user/profile" : "/", { replace: true });
    }, 2500);
  };

  if (success) {
    return (
      <div className="flex justify-center m-5">
        <div
          className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2"
          role="alert"
        >
          <p className="text-green-900 font-bold">{success}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center font-bold md:text-xl">
        Rendelés véglegesítése
      </h2>
      {isLoading && <Loader />}

      {error && <Errors errors={error?.data?.errors} />}

      {payment ? (
        <div className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[600px] mx-auto">
          <StripePayment
            clientSecret={payment.clientSecret}
            orderId={payment.orderId}
            amount={payment.amount}
            onPaid={handlePaid}
          />
          <button
            type="button"
            onClick={() => setPayment(null)}
            className="w-full mt-4 text-sm underline text-slate-600"
          >
            Vissza a szállítási adatokhoz
          </button>
        </div>
      ) : (
  <form  onSubmit={handleSubmit} className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[600px] mx-auto">
  <div className="mb-4">
    <label
      htmlFor="name"
      className="block text-gray-700 text-sm font-bold mb-2"
    >Név </label>

    <input
      type="text"
      id="name"
      name="name"
      value={order.name}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4">
    <label
      htmlFor="email"
      className="block text-gray-700 text-sm font-bold mb-2"
    > Email </label>

    <input
      type="email"
      id="email"
      name="email"
      value={order.email}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4">
    <label
      htmlFor="city"
      className="block text-gray-700 text-sm font-bold mb-2"
    > Város </label>

    <input
      type="text"
      id="city"
      name="city"
      value={order.city}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4">
    <label
      htmlFor="zip"
      className="block text-gray-700 text-sm font-bold mb-2"
    > Irányítószám</label>

    <input
      type="text"
      id="zip"
      name="zip"
      value={order.zip}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4">
    <label
      htmlFor="address"
      className="block text-gray-700 text-sm font-bold mb-2"
    >  Cím </label>

    <input
      type="text"
      id="address"
      name="address"
      value={order.address}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-4">
    <label
      htmlFor="county"
      className="block text-gray-700 text-sm font-bold mb-2"
    > Megye</label>

    <input
      type="text"
      id="county"
      name="county"
      value={order.county}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div className="mb-6">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Telefonszám
    </label>

    <PhoneInput
      defaultCountry="hu"
      value={order.phone || ""}
      onChange={(value) =>
        setOrder({...order, phone: value})}
      inputClass="form-control"
    />
  </div>

  <div className="mb-8 border-t border-b py-5">
    <div className="flex justify-between mb-3">
      <span className="font-bold">Részösszeg:</span>
      <span>{cart.totalAmount.toFixed(0)} Ft</span>
    </div>

    <div className="flex justify-between mb-3">
      <span className="font-bold">Szállítás:</span>
      <span>{cart.shippingCharge} Ft</span>
    </div>

    <div className="flex justify-between text-green-700 text-lg">
      <span className="font-bold">Végösszeg:</span>
      <span className="font-bold">{cart.grandTotal.toFixed(0)} Ft</span>
    </div>
  </div>
      <div className="flex items-start gap-2">
        <input
          id="terms"
          type="checkbox"
          required
          className="mt-1"
        />
  
        <label
          htmlFor="terms"
          className="text-sm text-slate-700"
        >
          Elfogadom a {""}
          <a
            href="/aszf"
            className="underline font-medium text-blue-700"
          >
            Felhasználási feltételeket {""}
          </a>
          és az {""}
          <a
            href="/privacy"
            className="underline font-medium text-blue-700"
          >
            Adatvédelmi szabályzatot
          </a>
          .
        </label>
      </div>

    <button
      type="submit"
      disabled={isLoading || cartItems.length === 0}
      className="w-full mt-6 rounded-lg bg-blue-600 py-3 px-4 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? "Feldolgozás..." : `Tovább a fizetéshez (${formatPrice(cart.grandTotal)})`}
    </button>
</form>
      )}
    </div>
  );
}
