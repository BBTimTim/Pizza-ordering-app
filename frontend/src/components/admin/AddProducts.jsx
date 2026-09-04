import React, { useState } from "react";
import Loader from "../common/Loader";
import config from "../../../config";
import Errors from "../common/Errors";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";

const { api_url } = config;

export default function AddProducts() {
  const [add, setAdd] = useState({
    name: "",
    description: "",
    status: "",
    is_featured: "no",
    price: 0,
    image: null,
  });

  const token = useSelector(selectCurrentToken);
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setAdd({ ...add, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setAdd({ ...add, image: file });
    setImagePreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);
    setSuccess(null);

    try {
      const formData = new FormData();

      formData.append("name", add.name);
      formData.append("price", add.price);
      formData.append("description", add.description);
      formData.append("status", add.status);
      formData.append("is_featured", add.is_featured);
      if (add.image) {
        formData.append("image", add.image);
      }
      const res = await fetch(`${api_url}/addproducts`, {
        method: "POST",
         headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setErrors(result.errors);
        return;
      }
      setSuccess(result.success);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="py-5">
      <h2 className="text-center font-bold md:text-xl">Új termék hozzáadása</h2>
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
        <form
          onSubmit={handleSubmit}
          className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[600px] mx-auto"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Termék neve
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={add.name}
              placeholder="Termék neve"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Leírás
            </label>
            <textarea
              onChange={handleChange}
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={add.description}
              placeholder="Leírás"
            />
          </div>
             <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Ár Ft-ban
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="text"    
              name="price"
              value={add.price}
            />
          </div>
          <div className="mb-4 flex items-center gap-4">
            <label className="text-gray-700 text-sm font-bold" htmlFor="status">
              Status:
            </label>

            <select
              name="status"
              id="status"
              value={add.status}
              className="select"
              onChange={handleChange}
            >
              <option value="" disabled>
                Válassz
              </option>
              <option value="active">Aktív</option>
              <option value="block">Inaktív</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              className="label flex items-center gap-2"
              htmlFor="is_featured"
            >
              <input
                type="checkbox"
                className="checkbox"
                id="is_featured"
                name="is_featured"
                checked={add.is_featured === "yes"}
                onChange={(e) =>
                  setAdd({
                    ...add,
                    is_featured: e.target.checked ? "yes" : "no",
                  })
                }
              />
              Kiemelt termék
            </label>
          </div>
          <div className="mb-4 flex items-center gap-4">
            <label
              className="block mb-2 text-sm font-semibold text-heading"
              htmlFor="image"
            >
              Kép
            </label>
            <input
              className="text-sm text-stone-500
              file:mr-5 file:py-1 file:px-3 file:border-[1px]
              file:text-xs file:font-medium
              file:bg-stone-50 file:text-stone-700
              hover:file:cursor-pointer hover:file:bg-blue-50
              hover:file:text-blue-700"
              id="image"
              type="file"
              name="image"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Előnézet"
                  className="w-[200px] h-[200px] object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              type="submit"
            >
              Mentés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
