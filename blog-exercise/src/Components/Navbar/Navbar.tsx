import { Link } from "react-router-dom";
import { useAuthStore } from "../Auth/AuthStore";

export function Navbar() {
  const AuthStore = useAuthStore();

  return (
    <div className="bg-blue-50 p-6 text-lg text-slate-700 font-bold flex justify-between h-20">
      <div>
        <Link to="/">GALLERY</Link>
        <Link to="/leaderboards">LEADERBOARDS</Link>
      </div>
      <div>
        <Link to="/addpicture">ADD PICTURE</Link>
      </div>
      <div>
        <Link to="/viewyours">VIEW YOURS</Link>
        <button onClick={AuthStore.signUserOut}>LOG OUT</button>
      </div>
    </div>
  );
}
