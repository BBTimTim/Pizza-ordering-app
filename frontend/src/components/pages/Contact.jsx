import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import Loader from "../common/Loader";
import Errors from "../common/Errors";

export default function Contact() {
  const [data, setData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    setErrors(null);
    setLoading(true);
    setSuccess(null);
    try {
        await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: data.name,
          email: data.email,
          message: data.message,
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      );

      setSuccess("Az üzenet sikeresen elküldve!");
      setData({
        name: "",
        email: "",
        message: "",
      });
    } catch (e) {
      setErrors(e.message || "Hiba történt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={sendEmail}
        className="flex flex-col items-center text-sm text-slate-800"
      >
        <h1 className="md:text-4xl font-bold py-4 mb-5 text-center">
          Lépj velünk kapcsolatba
        </h1>

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

        <div className="max-w-96 w-full px-4">
          <label htmlFor="name" className="font-medium">
            Név
          </label>
          <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-red-400 transition-all overflow-hidden">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.311 16.406a9.64 9.64 0 0 0-4.748-4.158 5.938 5.938 0 1 0-7.125 0 9.64 9.64 0 0 0-4.749 4.158.937.937 0 1 0 1.623.938c1.416-2.447 3.916-3.906 6.688-3.906 2.773 0 5.273 1.46 6.689 3.906a.938.938 0 0 0 1.622-.938M5.938 7.5a4.063 4.063 0 1 1 8.125 0 4.063 4.063 0 0 1-8.125 0"
                fill="#475569"
              />
            </svg>
            <input
              onChange={handleChange}
              value={data.name}
              type="text"
              name="name"
              className="h-full px-2 w-full outline-none bg-transparent"
              placeholder="Név"
              required
            />
          </div>

          <label htmlFor="email" className="font-medium mt-4">
            Email cím
          </label>
          <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-red-400 transition-all overflow-hidden">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 3.438h-15a.937.937 0 0 0-.937.937V15a1.563 1.563 0 0 0 1.562 1.563h13.75A1.563 1.563 0 0 0 18.438 15V4.375a.94.94 0 0 0-.938-.937m-2.41 1.874L10 9.979 4.91 5.313zM3.438 14.688v-8.18l5.928 5.434a.937.937 0 0 0 1.268 0l5.929-5.435v8.182z"
                fill="#475569"
              />
            </svg>
            <input
              value={data.email}
              onChange={handleChange}
              name="email"
              type="email"
              className="h-full px-2 w-full outline-none bg-transparent"
              placeholder="Email cím"
              required
            />
          </div>

          <label htmlFor="message" className="font-medium mt-4">
            Üzenet
          </label>
          <textarea
            onChange={handleChange}
            value={data.message}
            name="message"
            rows="4"
            className="w-full mt-2 p-2 bg-transparent border border-slate-300 rounded-lg resize-none outline-none focus:ring-2 focus-within:ring-red-400 transition-all"
            placeholder="Üzenet írása"
            required
          ></textarea>

          <button
            type="submit"
            className="flex items-center justify-center gap-1 mt-5 bg-red-500 hover:bg-red-600 text-white py-2.5 w-full rounded-full transition"
          >
            Küldés
            <svg
              className="mt-0.5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m18.038 10.663-5.625 5.625a.94.94 0 0 1-1.328-1.328l4.024-4.023H3.625a.938.938 0 0 1 0-1.875h11.484l-4.022-4.025a.94.94 0 0 1 1.328-1.328l5.625 5.625a.935.935 0 0 1-.002 1.33"
                fill="#fff"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
