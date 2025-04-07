import { useContext, useState } from "react";
import { useRegister } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useRegister();
    const { userLoginHandler } = useContext(UserContext);

    const [errorMessage, setErrorMessage] = useState("");

    const registerHandler = async (formData) => {
        const {email, password} = Object.fromEntries(formData);

        const confirmPassword = formData.get('confirm-password');

        // if (useEmailExists(email)) {
        //     setErrorMessage("Email already exists!"); 
        //     return;
        // }

        if (password !== confirmPassword) {
            setErrorMessage("Password missmatch!"); 
            return;
        }

        const authData = await register(email, password);

        userLoginHandler(authData);

        navigate('/');
    }

    return (
        <section id="register-page" className="content auth">
            <form id="register" action={registerHandler}>
                <div className="container">
                    <div className="brand-logo"></div>
                    <h1>Register</h1>

                    <label className="auth-label" htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="maria@email.com" />

                    <label className="auth-label" htmlFor="pass">Password:</label>
                    <input type="password" name="password" id="register-password" />

                    <label className="auth-label" htmlFor="con-pass">Confirm Password:</label>
                    <input type="password" name="confirm-password" id="confirm-password" />
                    {errorMessage && errorMessage === "Password missmatch!" && (
                        <p className="auth-error"><b>Password missmatch!</b></p>
                    )}

                    <input className="btn submit" type="submit" value="Register" />

                    <p className="field">
                        <span>If you already have profile click <a href="#">here</a></span>
                    </p>
                </div>
            </form>
        </section>
    );
}