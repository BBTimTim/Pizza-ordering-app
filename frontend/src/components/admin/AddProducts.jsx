import { useState } from "react";
import Loader from "../common/Loader";
import Errors from "../common/Errors";
import { useAddProductMutation } from "../redux/products/productSlice";

export default function AddProducts() {
  const [add, setAdd] = useState({
    name: "",
    description: "",
    status: "",
    is_featured: "no",
    image: null,
    price: 0
  });

  const [addProduct, { isLoading, isSuccess, error, data }] =
    useAddProductMutation();
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

  const formData = new FormData();
  formData.append("name", add.name);
  formData.append("description", add.description);
  formData.append("status", add.status);
  formData.append("is_featured", add.is_featured);
  formData.append("price", add.price);

  if (add.image) {
    formData.append("image", add.image);
  }
  try {
    await addProduct(formData).unwrap();
    setAdd({
      name: "",
      description: "",
      status: "",
      price: 0,
      is_featured: "no",
      image: null,
    });

    setImagePreview(null);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="py-5">
      <h2 className="text-center font-bold md:text-xl">Új termék hozzáadása</h2>
      {isLoading && <Loader />}

      {isSuccess && (
        <div className="flex justify-center m-5">
          <div
            className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2"
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
              Ár
            </label>
             <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              name="price"
              value={add.price}
              placeholder="Ft"
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
              Mentés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
