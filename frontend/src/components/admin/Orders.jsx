import { useState } from "react";
import Loader from "../common/Loader";
import Errors from "../common/Errors";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "../redux/order/orderSlice";
import { ORDER_STATUSES, PAYMENT_STATUSES, formatDate, formatPrice } from "../order/orderStatus";

export default function Orders() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data: orders, isLoading, isFetching } = useGetOrdersQuery({ status, page });
  const [updateOrderStatus, { error }] = useUpdateOrderStatusMutation();

  const handleFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="px-3 py-2 mb-4 indent-4 bg-red-100 rounded-full text-lg font-bold text-red-700 tracking-wide">
        Rendelések
      </h2>

      <div role="tablist" className="tabs tabs-boxed mb-6 flex-wrap">
        <button role="tab" className={`tab ${status === "" ? "tab-active" : ""}`} onClick={() => handleFilter("")}>
          Összes
        </button>
        {Object.entries(ORDER_STATUSES).map(([key, { label }]) => (
          <button
            key={key}
            role="tab"
            className={`tab ${status === key ? "tab-active" : ""}`}
            onClick={() => handleFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {(isLoading || isFetching) && <Loader />}
      {error && <Errors errors={error?.data?.errors} />}
      {orders?.data?.length === 0 && <p className="text-center text-slate-500">Nincs ilyen rendelés.</p>}

      <div className="space-y-4">
        {orders?.data?.map((order) => (
          <article key={order.id} className="border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-bold">#{order.id} – {order.name}</p>
                <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
                <p className="text-sm">{order.zip} {order.city}, {order.address}</p>
                <p className="text-sm">{order.phone} · {order.email}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`badge ${PAYMENT_STATUSES[order.payment_status]?.className}`}>
                  {PAYMENT_STATUSES[order.payment_status]?.label}
                </span>
                <select
                  aria-label={`#${order.id} rendelés státusza`}
                  className="select select-bordered select-sm"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {Object.entries(ORDER_STATUSES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <ul className="text-sm divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between py-1 gap-4">
                  <span>
                    {item.quantity} × {item.name}
                    {item.size_name && ` (${item.size_name})`}
                    {item.toppings?.length > 0 && (
                      <span className="text-slate-500"> + {item.toppings.map((t) => t.name).join(", ")}</span>
                    )}
                  </span>
                  <span className="whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <p className="text-right font-bold mt-3">Végösszeg: {formatPrice(order.grand_total)}</p>
          </article>
        ))}
      </div>

      {orders?.last_page > 1 && (
        <div className="join flex justify-center mt-6">
          <button className="join-item btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>«</button>
          <span className="join-item btn btn-disabled">{page} / {orders.last_page}</span>
          <button className="join-item btn" disabled={page >= orders.last_page} onClick={() => setPage(page + 1)}>»</button>
        </div>
      )}
    </div>
  );
}
