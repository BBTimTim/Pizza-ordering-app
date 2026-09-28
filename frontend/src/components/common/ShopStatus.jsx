import { useGetShopStatusQuery } from "../redux/shop/shopSlice";

// Nyitva/zárva jelzés percenként frissítve, pl. „Nyitva 22:00-ig” vagy „Zárva – nyitás: kedd 11:00”
export default function ShopStatus({ showHours = false }) {
  const { data: status } = useGetShopStatusQuery(undefined, { pollingInterval: 60000 });

  if (!status) return null;

  return (
    <div className="flex flex-col gap-2">
      <span
        className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${
          status.open ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${status.open ? "bg-green-600" : "bg-gray-500"}`} aria-hidden="true"></span>
        {status.message}
      </span>

      {showHours && (
        <ul className="text-sm">
          {status.hours.map((row) => (
            <li key={row.day} className="flex justify-between gap-6 capitalize">
              <span>{row.day}</span>
              <span>{row.hours}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
