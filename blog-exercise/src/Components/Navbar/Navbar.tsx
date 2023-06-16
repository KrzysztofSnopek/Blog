import { Link } from "react-router-dom";
import { useAuthStore } from "../Auth/AuthStore";

export function Navbar() {
  const AuthStore = useAuthStore();

  return (
    <div className="bg-orange-400 p-6 text-lg text-slate-700 font-bold flex justify-between h-20">
      <Link to="/">Main</Link>
      <Link to="/leaderboards">Leaderboards</Link>
      <Link to="/addpicture">Add picture</Link>
      <Link to="/viewyours">View your pictures</Link>
      <Link to="/signout">Sign In</Link>
      <button onClick={AuthStore.signUserOut}>Log out</button>
    </div>
  );
}
