import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="bg-orange-400 p-6 text-lg text-gray-500 font-bold flex justify-between">
      <Link to="/">Main</Link>
      <Link to="/leaderboards">Leaderboards</Link>
      <Link to="/addpicture">Add picture</Link>
      <Link to="/viewyours">View your pictures</Link>
      <Link to="/signin">Sign In</Link>
    </div>
  );
}
