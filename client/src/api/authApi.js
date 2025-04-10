import { useEffect, useContext } from "react";
import request from "../utils/request";
import { UserContext } from "../contexts/UserContext";

const baseUrl = 'http://localhost:3030/users';

export const useLogin = () => {
    const login = async (email, password) => {
        return request.post(`${baseUrl}/login`, { email, password });
    };

    return { login };
};

export const useRegister = () => {
    const register = async (email, username, password) => {

        return request.post(`${baseUrl}/register`, { email, username, password });
    };

    return { register };
};

export const useLogout = () => {
    const { accessToken, userLogoutHandler } = useContext(UserContext);

    useEffect(() => {
        if (!accessToken) return;

        const options = {
            headers: {
                'X-Authorization': accessToken,
            },
        };

        request.get(`${baseUrl}/logout`, null, options)
            .then(userLogoutHandler)
            .catch((err) => console.error("Logout failed:", err));
    }, [accessToken, userLogoutHandler]);

    return { isLoggedOut: !!accessToken };
};
