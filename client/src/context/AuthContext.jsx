import { createContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser) {
            setUser(JSON.parse(storedUser));
        };
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
                const response = await api.post("/auth/login/", {
                    email,
                    password
                })
                if(response.status === 200) {
                    setUser(response.data.loggedInUser);
                    localStorage.setItem("user", JSON.stringify(response.data.loggedInUser));
                    return {success: true, user: response.data.loggedInUser, message: response.data.message}
                }
        } catch (err) {
            return {success: false}
        }
    }

    const logout = async (navigate) => {
        try {
            await api.get("/auth/logout/")
            setUser(null);
            localStorage.removeItem("user");
            navigate("/login")
        } catch (error) {
            console.log("Logout Failed", error);
        }
    }

    const register = async (name, email, password) => {
        try {
            const response = await api.post("/auth/register/", {
                name,
                email,
                password
            });

            if (response.status === 201) {
                setUser(response.data.user);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                return { success: true, user: response.data.user };
            }
        } catch (err) {
            return { success: false };
        }
    };


    return (
        <AuthContext.Provider value={{user, login, logout, register, loading}}>
            {children}
        </AuthContext.Provider>
    )
}