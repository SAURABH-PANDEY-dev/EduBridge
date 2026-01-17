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
        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });
    
            const token = response.data; // backend returns raw JWT string
            localStorage.setItem("token", token);
    
            //fetch proflie to get role 
            const profileRes = await api.get("/api/users/profile");
            
            const userData = profileRes.data;
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
    
            return true;
            
        } catch (err) {
            throw new Error(`Login Failed due to :-  ${err.message}`);
        }
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