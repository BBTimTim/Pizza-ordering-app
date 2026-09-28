import { RiSettings3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FaHome, FaPizzaSlice, FaList, FaReceipt } from "react-icons/fa";
import { IoMdResize } from "react-icons/io";
import { IoAddCircleSharp } from "react-icons/io5";

export default function SettingsButton() {

  return ( 
  <div className="dropdown dropdown-hover">
  <div
    tabIndex={0}
    role="button"
    className="text-2xl text-black hover:text-red-700/75 transition cursor-pointer"
  >
    <RiSettings3Fill className="relative text-3xl top-0.5"/>
  </div>

  <ul
    tabIndex={-1}
    className=" dropdown-content menu bg-base-100 rounded-box z-[9999] w-56 p-2 shadow-lg"
  >
    <li>
      <Link
        to="/"
        className="flex items-center gap-3 text-red-600 hover:bg-red-50"
      >
        <FaHome />
        Home
      </Link>
    </li>

    <li>
      <Link
        to="/admin/orders"
        className="flex items-center gap-3 text-red-600 hover:bg-red-50"
      >
        <FaReceipt />
        Rendelések
      </Link>
    </li>

    <li>
      <Link
        to="/admin/products"
        className="flex items-center gap-3 text-red-600 hover:bg-red-50"
      >
        <FaPizzaSlice />
        Pizzák
      </Link>
    </li>

    <li>
      <Link
        to="/admin/addproducts"
        className="flex items-center gap-3 text-red-600 hover:bg-red-50"
      >
        <IoAddCircleSharp />
        Pizza hozzáadása
      </Link>
    </li>

    <li>
      <Link
        to="/admin/addtoppings"
        className="flex items-center gap-3 text-red-600 hover:bg-red-50"
      >
        <FaList />
        Feltétek hozzáadása
      </Link>
    </li>

    <li>
      <Link
        to="/admin/addsizes"
        className="flex items-center gap-3 text-red-600 hover:bg-red-50"
      >
        <IoMdResize />
        Méretek hozzáadása
      </Link>
    </li>

   <li>
      <Link
        to="/admin/sizes"
        className="flex items-center gap-3 text-red-600 hover:bg-red-50"
      >
        <IoMdResize />
        Méretek 
      </Link>
    </li>

   <li>
      <Link
        to="/admin/toppings"
        className="flex items-center gap-3 text-red-600 hover:bg-red-50"
      >
        <IoMdResize />
        Feltétek 
      </Link>
    </li>
  </ul>
</div>
  );
}