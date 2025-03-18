import { Link } from "react-router";

export default function Header() {
    return (
    <header>
        <h1><Link className="home" to="/">Trip Planner</Link></h1>
        <nav>
            <Link to="/trips">All trips</Link>

            <div id="user">
                <Link to="/trips/create">Create trip</Link>
                <Link to="/logout">Logout</Link>
            </div>

            <div id="guest">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </nav>
    </header>
    );
}