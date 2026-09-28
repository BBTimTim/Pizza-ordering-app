import { useState } from "react";
import Loader from "../common/Loader";
import Errors from "../common/Errors";
import { useParams } from "react-router-dom";
import {useGetProductQuery, useUpdateProductMutation} from "../redux/products/productSlice";

import config from "../../../config";
const { img_url } = config;

export default function Editproduct() {

 const {id} = useParams();

  const [edit, setEdit] = useState({
    name: "",
    description: "",
    status: "",
    is_featured: "no",
    price: 0,
    image: null,
  });

const {data: product, isLoading, error, isSuccess} = useGetProductQuery(id);

const [updateProduct, { data } ] = useUpdateProductMutation();

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setEdit({ ...edit, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setEdit({ ...edit, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("name", edit.name);
  formData.append("description", edit.description);
  formData.append("status", edit.status);
  formData.append("is_featured", edit.is_featured);
  formData.append("price", edit.price);

  if (edit.image) {
    formData.append("image", edit.image);
  }

  try {
    await updateProduct({id, body: formData }).unwrap();
  } catch (error) {
    console.log(error);
  }
};

  // Az űrlap a termék (újra)betöltésekor töltődik ki – renderelés közben, effekt nélkül
  const [loadedProduct, setLoadedProduct] = useState(null);
  if (product && product !== loadedProduct) {
    setLoadedProduct(product);
    setEdit({
        name: product.name || "",
        description: product.description || "",
        status: product.status || "",
        is_featured: product.is_featured || "no",
        price: product.price || 0,
        image: null,
    });
    setImagePreview(
      product.image
        ? `${img_url}/products/${product.image}`
        : null
    );
  }


  return (
    <div className="py-5">
      <h2 className="text-center font-bold md:text-xl">Termék módosítása</h2>
      {isLoading && <Loader />}
      {isSuccess && (
        <div className="flex justify-center m-5 px-5">
          <div
            className="text-green-900 px-5 py-2 font-medium bg-green-200 rounded-full"
            role="alert"
          >
            <p className="text-green-900 font-bold">{data?.success}</p>
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
              className="file-input"
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
                  className="w-[200px] h-[200px] object-cover rounded-lg m-4"
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
