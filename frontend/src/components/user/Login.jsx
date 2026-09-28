import { useState } from "react";
import Loader from "../common/Loader";
import { useNavigate } from "react-router-dom";
import Errors from "../common/Errors";

import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/auth/authSlice";
import { useLoginMutation } from "../redux/auth/authApiSlice";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(data).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.token,
        }),
      );

      if (result.user?.status === "admin") {
        navigate("/admin/profile", { replace: true });
      } else {
        navigate("/user/profile", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h2 className="text-center font-bold md:text-xl">Belépés</h2>
      {isLoading && <Loader />}
      {error && <Errors errors={error?.data?.errors} />}

      <div>
        <form
          onSubmit={handleSubmit}
          className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[600px] mx-auto"
        >
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
              value={data.email}
              placeholder="Email"
            />
          </div>
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
              value={data.password}
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              type="submit"
            >
              Belépés
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/forgetpassword"
            >
              Elfelejtetted a jelszavad?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
