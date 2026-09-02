import React from "react";
import { useState } from "react";
import config from "../../../config";
import { useSearchParams } from "react-router-dom";
import Loader from "../common/Loader";
import Errors from "../common/Errors";

const { api_url } = config;

export default function Resetpassword() {
  const [password, setPassword] = useState({
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const handleChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors(null);
    setLoading(true);
    setSuccess(null);

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    try {
      const res = await fetch(`${api_url}/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          email: email,
          password: password.password,
          password_confirmation: password.password_confirmation,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrors(result.errors);
        return;
      }
      setSuccess(result.success);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div classNameName="container">
      <h1 classNameName="mt-5 text-center">Új jelszó beállítása</h1>
      {loading && <Loader />}
      {success && (
        <div className="flex justify-center m-5">
               <div className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2" role="alert">
              <p className="text-green-900 font-bold ">{success}</p>
            </div>
        </div>
      )}
     {errors && <Errors errors={errors} />}

      <div>
          <h2 className="text-center font-bold md:text-xl">Jelszó visszaállítása</h2>
          <form  className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[600px] mx-auto" onSubmit={handleSubmit}>
            <div className="space-y-6 max-w-md mx-auto">
              <div className="flex items-center">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Jelszó"
                  value={password.password}
                  onChange={handleChange}
                  className="px-1 py-2.5 text-sm text-slate-900 bg-white w-full border-b-2 border-slate-300 focus:border-blue-600 outline-none"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="Jelszó újra"
                  value={password.password_confirmation}
                  onChange={handleChange}
                  className="px-1 py-2.5 text-sm text-slate-900 bg-white w-full border-b-2 border-slate-300 focus:border-blue-600 outline-none"
                />
              </div>
              <button
                type="submit"
                className="!mt-2 py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Jelszó megerősítése!
              </button>
            </div>
          </form>
      </div>

      <div>
        <h2 className="text-center font-bold md:text-xl">Belépés</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[600px] mx-auto"
        >
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Jelszó
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              value={password.password}
              placeholder="******************"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password_confirmation"
            >
              Jelszó megerősítése
            </label>
            <input
              onChange={handleChange}
              value={password.password_confdirmation}
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              type="submit"
            >
              Megerősítés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
