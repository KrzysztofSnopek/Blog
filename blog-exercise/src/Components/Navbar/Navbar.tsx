import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../Auth/AuthStore";

export function Navbar() {
  const AuthStore = useAuthStore();
  const location = useLocation();

  return (
    <div className="relative bg-blue-50 py-6 text-lg text-slate-700 flex justify-between h-20 font-body">
      <div>
        <NavLink
          to="/"
          className={`p-8 relative ${
            location.pathname === "/"
              ? "font-black bg-blue-300"
              : "font-bold hover:text-slate-950 before:absolute before:-z-10 before:bottom-0 before:left-[50%] before:w-0 before:h-0 before:bg-blue-200 hover:before:animate-fillNav hover:opacity-70"
          }`}
        >
          GALLERY
        </NavLink>
        <NavLink
          to="/leaderboards"
          className={`p-8 relative ${
            location.pathname === "/leaderboards"
              ? "font-black bg-blue-300"
              : "font-bold hover:text-slate-950 before:absolute before:-z-10 before:bottom-0 before:left-[50%] before:w-0 before:h-0 before:bg-blue-200 hover:before:animate-fillNav hover:opacity-70"
          }`}
        >
          LEADERBOARDS
        </NavLink>
      </div>
      <div
        className={`border bg-blue-200 hover:scale-150 transition duration-500 hover:shadow-2xl ${
          location.pathname === "/addpicture"
            ? "font-extrabold scale-150 shadow-2xl bg-blue-300"
            : "font-medium"
        }`}
      >
        <NavLink to="/addpicture" className="p-8">
          ADD PICTURE
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/viewyours"
          className={`p-8 relative ${
            location.pathname === "/viewyours"
              ? "font-black bg-blue-300"
              : "font-bold hover:text-slate-950 before:absolute before:-z-10 before:bottom-0 before:left-[50%] before:w-0 before:h-0 before:bg-blue-200 hover:before:animate-fillNav hover:opacity-70"
          }`}
        >
          VIEW YOURS
        </NavLink>
        <NavLink
          to="/"
          onClick={AuthStore.signUserOut}
          className="relative p-8 font-bold hover:text-slate-950 before:absolute before:-z-10 before:bottom-0 before:left-[50%] before:w-0 before:h-0 before:bg-blue-200 hover:before:animate-fillNav hover:opacity-70"
        >
          LOG OUT
        </NavLink>
      </div>
    </div>
  );
}
