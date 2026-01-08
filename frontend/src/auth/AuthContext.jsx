import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

/*
 Central authentication provider
 Handles login, register, logout
*/
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    // LOGIN
    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        const token = response.data; // backend returns raw JWT string

        localStorage.setItem("token", token);

        // decode not required now; user details fetched later
        setUser({ email });

        return true;
    };

    // REGISTER
    const register = async (name, email, password, role) => {
        const response = await api.post("/auth/register", {
            name,
            email,
            password,
            role, // STUDENT or ADMIN
        });

        return response.data;
    };

    // LOGOUT
    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};