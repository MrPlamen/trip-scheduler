import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";

export default function Header() {
    const { email } = useContext(UserContext);

    return (
        <header>
            <h1><Link className="hero-home" to="/">Trip Planner</Link></h1>
            <nav className="hero-nav">
                <Link to="/trips">All trips</Link>

                {email ? (
                    <>
                        <Link to="/trips/create">Create trip</Link>
                        <Link to="/logout">Logout</Link>
                    </>
                )
                : (
                     <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

            </nav>
        </header>
    );
}