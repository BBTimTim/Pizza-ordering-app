import React, { useEffect, useState } from "react";
import { VscEditSparkle } from "react-icons/vsc";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../config";
import { removeProduct, setProducts } from "../redux/productSlice";
import { selectCurrentToken } from "../redux/auth/authSlice";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import Errors from "../common/Errors";

const { api_url, img_url } = config;

export default function Products() {
  const products = useSelector((state) => state.products.products);
  const token = useSelector(selectCurrentToken);

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchProducts = async () => {
    const res = await fetch(`${api_url}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();
    dispatch(setProducts(result.data));
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    setErrors(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch(`${api_url}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok) {
        setErrors(result.errors);
        return;
      }
      dispatch(removeProduct(id));
      await fetchProducts();
      setSuccess(result.success);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="p-3 indent-4 bg-red-100 rounded-full text-lg font-bold text-red-700 tracking-wide">
        Pizzák:
      </h2>
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

      {products.map((pizza) => (
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
