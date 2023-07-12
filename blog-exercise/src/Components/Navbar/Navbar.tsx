import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../Auth/AuthStore";

export function Navbar() {
  const AuthStore = useAuthStore();
  const location = useLocation();

  return (
    <div className="bg-blue-50 p-6 text-lg text-slate-700 flex justify-between h-20 font-body">
      <div>
        <NavLink
          to="/"
          className={`p-8 ${
            location.pathname === "/"
              ? "font-extrabold"
              : "font-normal hover:underline hover:decoration-double"
          }`}
        >
          GALLERY
        </NavLink>
        <NavLink
          to="/leaderboards"
          className={`p-8 ${
            location.pathname === "/leaderboards"
              ? "font-extrabold"
              : "font-normal hover:underline hover:decoration-double"
          }`}
        >
          LEADERBOARDS
        </NavLink>
      </div>
      <div
        className={`border rounded-2xl bg-blue-200 shadow-md hover:scale-125 transition duration-500 hover:shadow-2xl ${
          location.pathname === "/addpicture"
            ? "font-extrabold scale-125 shadow-2xl"
            : "font-normal "
        }`}
      >
        <NavLink to="/addpicture" className="p-8">
          ADD PICTURE
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/viewyours"
          className={`p-8 ${
            location.pathname === "/viewyours"
              ? "font-extrabold"
              : "font-normal hover:underline hover:decoration-double"
          }`}
        >
          VIEW YOURS
        </NavLink>
        <NavLink
          to="/"
          onClick={AuthStore.signUserOut}
          className="p-8 hover:underline hover:decoration-double"
        >
          LOG OUT
        </NavLink>
      </div>
    </div>
  );
}
