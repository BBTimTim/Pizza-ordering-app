import React from "react";
import { useState } from "react";
import config from "../../../config";
import Loader from "../common/Loader";

const { api_url } = config;

const Forgetpassword = () => {

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await fetch(`${api_url}/forgetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrors(result.message);
        return;
      } 
      setSuccess(result.message);
      setEmail('')
      
    } catch (error) {
      console.log(error)
    }finally{
     setLoading(false)
    }
  };

  return (
    <div className="container">
          <h2 className="text-center font-bold md:text-xl">Jelszó visszaállítása</h2>
          {loading  && <Loader />}
          {success && (
            <div className="flex justify-center m-5">
               <div className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2" role="alert">
              <p className="text-green-900 font-bold ">{success}</p>
            </div>
        </div>
          )}
        {errors &&  <div className="flex justify-center m-5">
               <div className="text-red-900 font-medium bg-red-200 rounded-full px-5 py-2" role="alert">
              <p className="text-red-900 font-bold ">{errors}</p>
            </div>
          </div>
        }
        <div>
          <form  className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[600px] mx-auto" onSubmit={handleSubmit}>
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
                    value={email}
                    placeholder="Email"
                  />
                </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    type="submit">
            Küldés
          </button>
      </form>
       </div>
    </div>
  );
};

export default Forgetpassword;
