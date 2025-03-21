import { Link } from "react-router";

export default function Header() {
    return (
        <header>
            <h1><Link className="hero-home" to="/">Trip Planner</Link></h1>
            <nav className="hero-nav">
                <Link to="/trips">All trips</Link>

                <Link to="/trips/create">Create trip</Link>
                <Link to="/logout">Logout</Link>

                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>

            </nav>
        </header>
    );
}