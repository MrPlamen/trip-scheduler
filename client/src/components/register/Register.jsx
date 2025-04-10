import { useContext, useState } from "react";
import { useRegister } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useRegister();
    const { userLoginHandler } = useContext(UserContext);

    const [formData, setFormData] = useState({
        email: "",
        username: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email" || name === "username") {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const registerHandler = async (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const email = form.get("email");
        const username = form.get("username");
        const password = form.get("password");
        const confirmPassword = form.get("confirm-password");

        if (password !== confirmPassword) {
            setErrorMessage("Password mismatch!");
            setFormData(prev => ({
                ...prev,
                password: "",
                confirmPassword: "",
            }));
            return;
        }

        try {
            const authData = await register(email, username, password);

            if (authData.message === "A user with the same email already exists") {
                setErrorMessage("Email already exists!");
                return;
            }

            userLoginHandler(authData);
            navigate("/");
        } catch (error) {
            console.error("Error during registration: ", error);
            setErrorMessage("Registration failed! Please try again.");
        }
    };

    return (
        <section id="register-page" className="content auth">
            <form id="register" onSubmit={registerHandler}>
                <div className="container">
                    <div className="brand-logo"></div>
                    <h1>Register</h1>

                    <label className="auth-label" htmlFor="email"> Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="johndoe@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label className="auth-label" htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <label className="auth-label" htmlFor="register-password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        id="register-password"
                        required
                    />

                    <label className="auth-label" htmlFor="confirm-password">Confirm Password:</label>
                    <input
                        type="password"
                        name="confirm-password"
                        value={formData.confirmPassword}
                        id="confirm-password"
                        required
                    />

                    {errorMessage && (
                        <p className="auth-error"><b>{errorMessage}</b></p>
                    )}

                    <input className="btn submit" type="submit" value="Register" />

                    <p className="field">
                        <span><Link to="/login">Or log in here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
}
