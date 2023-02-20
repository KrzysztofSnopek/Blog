import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div>
      <Link to="/">Main</Link>
      <Link to="/leaderboards">Leaderboards</Link>
      <Link to="/addpicture">Add picture</Link>
      <Link to="/viewyours">View your pictures</Link>
    </div>
  );
}
