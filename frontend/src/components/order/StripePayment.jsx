import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useConfirmPaymentMutation } from "../redux/order/orderSlice";
import { formatPrice } from "./orderStatus";

const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = publicKey ? loadStripe(publicKey) : null;

function PaymentForm({ orderId, amount, onPaid }) {
  const stripe = useStripe();
  const elements = useElements();
  const [confirmPayment] = useConfirmPaymentMutation();
  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setMessage(null);

    // A kártyaadatok közvetlenül a Stripe-hoz mennek, a saját szerverünk nem látja őket
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: { return_url: `${window.location.origin}/addorder` },
    });

    if (error) {
      setMessage(error.message);
      setProcessing(false);
      return;
    }

    try {
      const result = await confirmPayment(orderId).unwrap();
      onPaid(result.data);
    } catch (err) {
      setMessage(err?.data?.errors?.payment?.[0] || "A fizetés ellenőrzése nem sikerült.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement options={{ layout: "tabs" }} />

      {message && (
        <p className="bg-red-100 text-red-700 font-medium text-center px-5 py-2 rounded-full">{message}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full rounded-lg bg-blue-600 py-3 px-4 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? "Feldolgozás..." : `Fizetés ${formatPrice(amount)}`}
      </button>
    </form>
  );
}

export default function StripePayment({ clientSecret, orderId, amount, onPaid }) {
  if (!stripePromise) {
    return (
      <p className="bg-red-100 text-red-700 font-medium text-center px-5 py-2 rounded-full">
        Az online fizetés nincs beállítva (hiányzik a VITE_STRIPE_PUBLIC_KEY).
      </p>
    );
  }

  return (
    <section className="border border-slate-300 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold mb-2">Bankkártyás fizetés</h2>
      <p className="text-sm text-slate-500 mb-6">
        Teszt mód: használd a <strong>4242 4242 4242 4242</strong> kártyaszámot, tetszőleges jövőbeli lejárattal és CVC-vel.
      </p>
      <Elements stripe={stripePromise} options={{ clientSecret, locale: "hu" }}>
        <PaymentForm orderId={orderId} amount={amount} onPaid={onPaid} />
      </Elements>
      <div className="text-center text-sm text-slate-500 pt-4">
        A fizetést a Stripe dolgozza fel titkosítva, a kártyaadatok nem kerülnek a szervereinkre.
      </div>
    </section>
  );
}
