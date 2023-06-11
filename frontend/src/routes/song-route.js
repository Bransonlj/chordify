import { NavLink, Outlet } from "react-router-dom";
import "../styles/routes/SongRoute.css";

export default function SongRoute() {
  return (
    <div className="songRoutes">
      <div className="songRoutes__navBar">
        <NavLink to="/songs/list">All songs</NavLink>
        <NavLink to="/songs/create">Add Song</NavLink>
        <NavLink to="/songs/create2">Add Song2</NavLink>
      </div>

        <Outlet />
    </div>
  )
}
