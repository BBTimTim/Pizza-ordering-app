import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../config";
import {
  useGetPopularProductsQuery,
  useGetProductsQuery,
  useSearchDataQuery,
} from "../redux/products/productSlice";
import { useGetSizesQuery } from "../redux/size/sizeSlice";
import { useGetToppingsQuery } from "../redux/toppings/toppingSlice";
import { addItemToCart } from "../redux/cart/cartSlice";
import { ModalContext } from "../context/ModalContext";
import { useSearchParams } from "react-router-dom";
import Loader from "../common/Loader";
import Errors from "../common/Errors";
import { GrCaretPrevious } from "react-icons/gr";
import { GrCaretNext } from "react-icons/gr";
import NoResult from "./NoResult";

const { img_url } = config;

export default function Products() {
  const { handleConfirmationOpen } = useContext(ModalContext);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const {
    data: results,
    isLoading,
    error,
    isFetching,
  } = useSearchDataQuery({ search, page });

  const { data: products } = useGetProductsQuery(page);
  const { data: popular } = useGetPopularProductsQuery(page);
  const { data: sizes } = useGetSizesQuery();
  const { data: toppings } = useGetToppingsQuery();

  const displayedProducts = search
    ? results?.data?.data || []
    : products?.data?.data || [];

  const dispatch = useDispatch();

  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedToppings, setSelectedToppings] = useState({});
  const [success, setSuccess] = useState("");

  const handleSelect = (productId, e) => {
    const { value, checked } = e.target;
    const current = selectedToppings[productId] || [];

    if (checked) {
      setSelectedToppings({
        ...selectedToppings,
        [productId]: [...current, value],
      });
    } else {
      setSelectedToppings({
        ...selectedToppings,
        [productId]: current.filter((id) => id !== value),
      });
    }
  };

  const cart = useSelector((state) => state.cart);
  const cartItems = cart.items;

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    const selectedToppingIds = selectedToppings[product.id] || [];

    const alreadyInCart = cartItems.some((item) => item.id === product.id);

    if (alreadyInCart) {
      const confirmed = window.confirm(
        "Ez a termék már a kosárban van. Biztosan hozzáadod még egyszer?",
      );

      if (!confirmed) return;
    }

    dispatch(
      addItemToCart({
        ...product,
        selectedSize,
        selectedToppings: selectedToppingIds,
        sizes: sizes?.data || [],
        toppings: toppings?.data || [],
      }),
    );

    setTimeout(() => {
      setSuccess("Kosárba helyezve!");
      handleConfirmationOpen();
    }, 1000);
  };

  const [sort, setSort] = useState("");

  const sortedProducts =  [...displayedProducts]?.sort((a, b) => {
    if (sort === "name") {
      return a.name.localeCompare(b.name);
    } else if (sort === "nameRev") {
      return b.name.localeCompare(a.name);
    }
    if (sort === "price") {
      return Number(a.price) - Number(b.price);
    } else if (sort === "priceRev") {
      return Number(b.price) - Number(a.price);
    }
    if(sort === "popular") {
        return popular?.data?.data;
    }
    return;
  });

  return (
    <>
      {isLoading && <Loader />}
      {error && <Errors errors={error?.data?.errors} />}

      {success && (
        <div className="flex justify-center m-5">
          <div
            className="text-green-900 font-medium bg-green-200 rounded-full px-5 py-2"
            role="alert"
          >
            <p className="text-green-900 font-bold">{success}</p>
          </div>
        </div>
      )}

      {displayedProducts && displayedProducts.length < 0 ? (
        <NoResult />
      ) : (

        <>
          <div className="flex justify-end px-2">
              <select
                className="select h-[30px]"
                defaultValue={""}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Szűrés</option>
                <option value="name">Név [A-Z]</option>
                <option value="nameRev">Név [Z-A]</option>
                <option value="price">Ár szerint növekvő</option>
                <option value="priceRev">Ár szerint csökkenő</option>
                <option value="popular">Népszerűség szerint</option>
              </select>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:p-3">
            {sortedProducts?.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md py-5 flex flex-col"
              >
                <img
                  className="w-full max-w-[300px] h-auto object-cover mx-auto"
                  src={`${img_url}/products/${item?.image}`}
                  alt={item.name}
                />

                <div className="p-4 text-sm flex flex-col flex-1">
                  <div>
                    <p className="text-slate-800 text-base font-bold my-1.5">
                      {item.name}
                    </p>

                    <p className="text-slate-500 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4">
                    <label
                      className="text-gray-700 text-sm font-bold block mb-2"
                      htmlFor={`size-${item.id}`}
                    >
                      Méretek:
                    </label>

                    <select
                      name="size"
                      id={`size-${item.id}`}
                      value={selectedSizes[item.id] || ""}
                      className="select w-full"
                      onChange={(e) =>
                        setSelectedSizes({
                          ...selectedSizes,
                          [item.id]: e.target.value,
                        })
                      }
                    >
                      {sizes?.data?.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.name} cm -
                          {(item.price * size.price_multiplier).toFixed(0)} Ft
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    {toppings?.data?.map((topping) => (
                      <label
                        className="flex items-center gap-2 py-1"
                        htmlFor={`topping-${item.id}-${topping.id}`}
                        key={topping.id}
                      >
                        <input
                          type="checkbox"
                          className="checkbox"
                          id={`topping-${item.id}-${topping.id}`}
                          name="toppings"
                          value={topping.id}
                          onChange={(e) => handleSelect(item.id, e)}
                        />

                        <span className="text-sm">
                          {topping.name} (+{topping.price} Ft)
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 text-center">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                    >
                      Kosárba
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8 mb-5">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1 || isFetching}
              className="rounded-md border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50"
            >
              <GrCaretPrevious />
            </button>

            <span className="px-3">{page}</span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isFetching}
              className="rounded-md border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50"
            >
              <GrCaretNext />
            </button>
          </div>
        </>
      )}
    </>
  );
}
