import React  from "react";
import { VscEditSparkle } from "react-icons/vsc";
import { MdDeleteForever } from "react-icons/md";
import config from "../../../config";
import { useGetProductsQuery, useRemoveProductMutation } from "../redux/products/productSlice";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import Errors from "../common/Errors";

const { img_url } = config;

export default function Products() {
  const { data: products } = useGetProductsQuery();

  const handleDelete = async (id) => {
    try {
      await removeProduct(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

const [ removeProduct, {isLoading, isSuccess, error, data }] = useRemoveProductMutation();

  return (
    <div>
      <h2 className="p-3 indent-4 bg-red-100 rounded-full text-lg font-bold text-red-700 tracking-wide">
        Pizzák:
      </h2>
      {isLoading && <Loader />}
      {error && <Errors errors={error?.data?.errors} />}

    {isSuccess && (
  <div className="flex justify-center m-5">
    <div
      className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2"
      role="alert"
    >
      <p className="text-green-900 font-bold">
        {data?.success}
      </p>
    </div>
  </div>
)}

      {products?.data?.map((pizza) => (
        <ul key={pizza.id} className="list">
          <li className="list-row">
            <div>
              {pizza.image && (
                <img
                  className="size-12 rounded-sm"
                  alt={pizza.name}
                  src={`${img_url}/products/${pizza?.image}`}
                />
              )}
            </div>
            <div>
              <div className="text-red-700 font-semibold">{pizza.name}</div>
              <div className="text-xs font-normal opacity-60">
                {pizza.description}
              </div>
            </div>
            <p>
              {pizza?.status == "active" && <span className="text-green-600">Aktív</span> }
              {pizza?.status == "block" && <span className="text-red-600">Inaktív</span> }
            </p>
            <button className="btn btn-square btn-ghost text-lg">
              <Link to={`/admin/editproduct/${pizza.id}`}>
                <VscEditSparkle className="text-red-500" />
              </Link>
            </button>
            <button
              onClick={() => handleDelete(pizza.id)}
              className="btn btn-square btn-ghost text-2xl"
            >
              <MdDeleteForever className="text-red-500" />
            </button>
          </li>
        </ul>
      ))}
    </div>
  );
}
