import { useState } from "react";
import Modal from "../common/Modal";
import { MdDeleteForever } from "react-icons/md";
import Loader from "../common/Loader";
import Errors from "../common/Errors";
import {
  useGetToppingsQuery,
  useRemoveToppingMutation,
} from "../redux/toppings/toppingSlice";

export default function Products() {
  const { data: toppings } = useGetToppingsQuery();

  // Törlés előtt megerősítést kérünk
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    const id = deleteId;
    setDeleteId(null);
    try {
      await removeTopping(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const [removeTopping, { isLoading, isSuccess, error, data }] =
    useRemoveToppingMutation();

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 shadow-md rounded-lg border-t-2 border-red-400 dark:bg-gray-900 dark:text-white">
      <h2 className="px-3 py-2 mb-2 indent-4 bg-red-100 rounded-full text-lg font-bold text-red-700 tracking-wide">
        Feltétek:
      </h2>
      {deleteId && (
        <Modal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} confirmLabel="Törlés">
          Biztosan törlöd ezt a feltétet?
        </Modal>
      )}
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

      {toppings?.data?.map((topping) => (
        <ul key={topping.id} className="flex flex-col pl-1 list">
          <li className="border-b py-2 dark:border-gray-600">
            <div className="flex justify-between">
              <p>
                {topping.name} cm - Ár: {topping.price} Ft
              </p>
              <button
                onClick={() => setDeleteId(topping.id)}
              aria-label="Törlés"
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
