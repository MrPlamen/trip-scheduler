import { useContext, useState } from "react";
import { useRegister } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useRegister();
    const { userLoginHandler } = useContext(UserContext);

    const [errorMessage, setErrorMessage] = useState("");

    const registerHandler = async (formData) => {
        const { email, username, password } = Object.fromEntries(formData);

        const confirmPassword = formData.get('confirm-password');

        if (password !== confirmPassword) {
            setErrorMessage("Password missmatch!");
            return;
        }

        try {
            const authData = await register(email, username, password);

            if (authData.message === "A user with the same email already exists") {
                setErrorMessage("Email already exists!");
                return;
            }

            userLoginHandler(authData);
            navigate('/');
        } catch (error) {
            setErrorMessage("Registration failed! Please try again.");
            console.error("Error during registration: ", error);
        }
    }

    return (
        <section id="register-page" className="content auth">
            <form id="register" action={registerHandler}>
                <div className="container">
                    <div className="brand-logo"></div>
                    <h1>Register</h1>

                    <label className="auth-label" htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="johndoe@email.com" required />

                    <label className="auth-label" htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label className="auth-label" htmlFor="pass">Password:</label>
                    <input type="password" name="password" id="register-password" required />

                    <label className="auth-label" htmlFor="con-pass">Confirm Password:</label>
                    <input type="password" name="confirm-password" id="confirm-password" required />

                    {errorMessage && (
                        <p className="auth-error"><b>{errorMessage}</b></p>
                    )}

                    <input className="btn submit" type="submit" value="Register" />

                    <p className="field">
                        <span><Link to="/login">If you already have profile click here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
}