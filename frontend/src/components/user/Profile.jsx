import usePageTitle from "../services/usePageTitle";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useGetMyOrdersQuery } from "../redux/order/orderSlice";
import Loader from "../common/Loader";
import { ORDER_STATUSES, PAYMENT_STATUSES, formatDate, formatPrice } from "../order/orderStatus";

export default function Profile() {
  usePageTitle("Profilom");
  const user = useSelector(selectCurrentUser);
  const { data: orders, isLoading, isError } = useGetMyOrdersQuery();

  return (
    <div className="min-h-screen">
      <div className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[800px] mx-auto">
        <div className="relative inline-block mb-8">
          <span className="text-2xl md:text-3xl font-bold">
            Üdvözöllek a profilodon, {user?.name}!
          </span>
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-600 rounded-full"></span>
        </div>

        <h2 className="text-xl font-bold mb-4">Rendeléseim</h2>

        {isLoading && <Loader />}
        {isError && (
          <p className="bg-red-100 text-red-700 font-medium px-5 py-2 rounded-full">
            A rendelések betöltése nem sikerült.
          </p>
        )}
        {orders?.data?.length === 0 && (
          <p className="text-slate-500">Még nincs rendelésed.</p>
        )}

        <div className="space-y-4">
          {orders?.data?.map((order) => (
            <article key={order.id} className="border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="font-bold">#{order.id} rendelés</p>
                  <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`badge ${ORDER_STATUSES[order.status]?.className}`}>
                    {ORDER_STATUSES[order.status]?.label}
                  </span>
                  <span className={`badge ${PAYMENT_STATUSES[order.payment_status]?.className}`}>
                    {PAYMENT_STATUSES[order.payment_status]?.label}
                  </span>
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
      </div>
    </div>
  );
}
