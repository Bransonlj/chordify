import { Outlet, NavLink } from "react-router-dom";
import "../styles/routes/Root.css"

const Root = () => {
    return ( 
        <div className="root">
            <div className="root__header">
                <h1>Chordify!</h1>
                <nav className="root__navBar">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/songs">Songs</NavLink>
                    <NavLink to="/about">About</NavLink>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </div>

     );
}
 
export default Root;