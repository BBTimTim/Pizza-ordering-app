import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import config from "../../../config";
import Errors from "../common/Errors";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/auth/authSlice";
import { useParams } from "react-router-dom";
import { setProducts } from "../redux/productSlice";

const { api_url } = config;

export default function Editproduct() {
  const [edit, setEdit] = useState({
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
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setEdit({ ...edit, [e.target.name]: e.target.value });
  };

  const {id} = useParams();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setEdit({ ...edit, image: file });
    setImagePreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);
    setSuccess(null);

    try {
      const formData = new FormData();

      formData.append("name", edit.name);
      formData.append("price", edit.price);
      formData.append("description", edit.description);
      formData.append("status", edit.status);
      formData.append("is_featured", edit.is_featured);
      if (edit.image) {
        formData.append("image", edit.image);
      }
      const res = await fetch(`${api_url}/editproduct/${id}`, {
        method: "PATCH",
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
      setEdit({
        name: "",
        description: "",
        status: "",
        is_featured: "no",
        price: 0,
        image: null,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${api_url}/products/${id}`,{
         headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const result = await res.json();
      dispatch(setProducts(result.data));
      setEdit({
        name: result.name || "",
        description: result.description || "",
        status: result.status || "",
        is_featured: result.is_featured || "no",
        price: result.price || 0,
        image: result.image || null
      });
    }
      fetchData()
    }, [id])


  return (
    <div className="py-5">
      <h2 className="text-center font-bold md:text-xl">Termék módosítása</h2>
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
              value={edit.name}
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
              value={edit.description}
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
              value={edit.price}
            />
          </div>
          <div className="mb-4 flex items-center gap-4">
            <label className="text-gray-700 text-sm font-bold" htmlFor="status">
              Status:
            </label>

            <select
              name="status"
              id="status"
              value={edit.status}
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
                checked={edit.is_featured === "yes"}
                onChange={(e) =>
                  setEdit({
                    ...edit,
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
              className="file-input n"
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
              Módosítások mentése
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
