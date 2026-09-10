import React, { useState } from "react";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { useAddOrderMutation } from "../redux/order/orderSlice";
import Loader from "../common/Loader";
import Errors from "../common/Errors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";

export default function AddOrder() {

  const cart = useSelector((state) => state.cart);
  const cartItems = cart.items;

  const [order, setOrder] = useState({
    name: "",
    email: "",
    zip: "",
    address: "",
    phone: "+36",
    city: "",
    county: "",
    grand_total: 0,
    sub_total: 0,
    delivery_charges: 0,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const [success, setSuccess] = useState(null);

  const [AddOrder, { isLoading, error }] = useAddOrderMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await AddOrder({
        ...order,
        sub_total: cart.totalAmount,
        delivery_charges: cart.shippingCharge,
        grand_total: cart.grandTotal,
        items: cartItems,
        status: "pending",
        payment_method: "card",
        payment_status: "paid",
      }).unwrap();

      dispatch(clearCart());

      setOrder({
        name: "",
        email: "",
        zip: "",
        address: "",
        phone: "+36",
        city: "",
        county: "",
        grand_total: 0,
        sub_total: 0,
        delivery_charges: 0,
      });

      setTimeout(() => {
        setSuccess("Sikeres Rendelés");
        navigate("/", { replace: true });
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="text-center font-bold md:text-xl">
        Rendelés véglegesítése
      </h2>
      {isLoading && <Loader />}

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

      {error && <Errors errors={error?.data?.errors} />}

  <div>
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
      <span>{cart.totalAmount} Ft</span>
    </div>

    <div className="flex justify-between mb-3">
      <span className="font-bold">Szállítás:</span>
      <span>{cart.shippingCharge} Ft</span>
    </div>

    <div className="flex justify-between text-green-700 text-lg">
      <span className="font-bold">Végösszeg:</span>
      <span className="font-bold">{cart.grandTotal} Ft</span>
    </div>
  </div>
 <section className="border border-slate-300 rounded-2xl p-6 md:p-8">
  <h2 className="text-xl font-bold mb-6">
    Bankkártyás fizetés
  </h2>
  <div className="flex gap-4 mb-6">
    <img
      src="https://readymadeui.com/images/visa.webp"
      className="w-16"
      alt="Visa"
    />

    <img
      src="https://readymadeui.com/images/american-express.webp"
      className="w-16"
      alt="American Express"
    />

    <img
      src="https://readymadeui.com/images/master.webp"
      className="w-16"
      alt="Mastercard"
    />
  </div>

  <div className="space-y-5">
    <div>
      <label
        htmlFor="cardholder-name"
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        Kártyatulajdonos neve
      </label>

      <input
        type="text"
        id="cardholder-name"
        name="cardholder-name"
        placeholder="Kovács Júlia"
        required
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
    <div>
      <label
        htmlFor="card-number"
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        Kártya száma
      </label>

      <input
        type="text"
        id="card-number"
        name="card-number"
        placeholder="1234 5678 9012 3456"
        maxLength="19"
        required
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">

      <div>
        <label
          htmlFor="expiry-date"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Lejárat dátuma
        </label>

        <input
          type="text"
          id="expiry-date"
          name="expiry-date"
          placeholder="MM/YY"
          maxLength="5"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="cvv"
          className="block text-sm font-medium text-slate-700 mb-2"
        > CVV</label>
        <input
          type="text"
          id="cvv"
          name="cvv"
          placeholder="123"
          maxLength="4"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
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
          href="#"
          className="underline font-medium text-blue-700"
        >
          Felhasználási feltételeket {""}
        </a>
        és az {""}
        <a
          href="#"
          className="underline font-medium text-blue-700"
        >
          Adatvédelmi szabályzatot
        </a>
        .
      </label>
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-lg bg-blue-600 py-3 px-4 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading
        ? "Feldolgozás..." 
        : `Fizetés ${cart.grandTotal} Ft`}
    </button>
    <div className="text-center text-sm text-slate-500 pt-2">
      Fizetési adatai biztonságosan, titkosítva kerülnek
      feldolgozásra. Bankkártyaadatait nem tároljuk
      szervereinken.
    </div>

  </div>
</section>
</form>
    </div>
        </div>
  );
}
