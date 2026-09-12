import React, { useState } from "react";
import Loader from "../common/Loader";
import Errors from "../common/Errors";
import { useRegisterMutation } from "../redux/auth/authApiSlice";

export default function Register() {

  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  const [registerUser, { isLoading, data, error, isSuccess }] = useRegisterMutation();

  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await registerUser(register).unwrap();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div>
        <h2 className="text-center font-bold md:text-xl">Regisztráció</h2>
      {isLoading && <Loader />}
      {isSuccess && (
        <div className="flex justify-center m-5">
            <div className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2" role="alert">
              <p className="text-green-900 font-bold ">{data?.success}</p>
            </div>
        </div>
      )}
      {error && <Errors errors={error?.data?.errors} />}

          <div>
              <form
                onSubmit={handleSubmit}
                className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[600px] mx-auto"
              >
                  <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Név
                  </label>
                  <input
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    name="name"
                    value={register.name}
                    placeholder="Név"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    name="email"
                    value={register.email}
                    placeholder="Email"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Jelszó
                  </label>
                  <input
                    onChange={handleChange}
                    className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    name="password"
                    type="password"
                    value={register.password}
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
                    value={register.password_confirmation}
                    className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    placeholder="******************"
                  />
                </div>
                   <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    type="submit"
                  >
                    Regisztráció
                  </button>
                  <a
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    href="/login"
                  >
                    Belépés
                  </a>
                </div>
              </form>
          </div>
      </div>
  );
}
