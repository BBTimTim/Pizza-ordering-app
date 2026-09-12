import React from "react";
import { MdDeleteForever } from "react-icons/md";
import Loader from "../common/Loader";
import Errors from "../common/Errors";
import {
  useGetSizesQuery,
  useRemoveSizeMutation,
} from "../redux/size/sizeSlice";

export default function Products() {
  const { data: sizes } = useGetSizesQuery();

  const handleDelete = async (id) => {
    try {
      await removeSize(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const [removeSize, { isLoading, isSuccess, error, data }] =
    useRemoveSizeMutation();

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 shadow-md rounded-lg border-t-2 border-red-400 dark:bg-gray-900 dark:text-white">
      <h2 className="px-3 py-2 mb-2 indent-4 bg-red-100 rounded-full text-lg font-bold text-red-700 tracking-wide">
        Méretek:
      </h2>
      {isLoading && <Loader />}
      {error && <Errors errors={error?.data?.errors} />}

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

      {sizes?.data?.map((size) => (
        <ul key={size.id} className="flex flex-col pl-1 list">
          <li className="border-b py-2 dark:border-gray-600">
            <div className="flex justify-between">
              <p>
                {size.name} cm - Ár szorzó: {size.price_multiplier} %
              </p>
              <button
                onClick={() => handleDelete(size.id)}
                className="btn btn-square btn-ghost text-2xl"
              >
                <MdDeleteForever className="text-red-500" />
              </button>
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
}
