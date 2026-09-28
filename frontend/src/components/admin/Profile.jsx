import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";

export default function Profile() {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="max-h-screen">
      <div className="bg-white px-8 pt-6 pb-8 mb-4 max-w-[650px] mx-auto">
        <div class="relative inline-block">
          <span class="text-2xl md:text-3xl font-bold">
            Üdvözöllek kedves admin, {user?.name}!
          </span>
          <span class="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-600 rounded-full"></span>
        </div>
      </div>
    </div>
  );
}
