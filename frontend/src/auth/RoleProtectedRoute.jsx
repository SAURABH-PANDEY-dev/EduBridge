import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

/*
 RoleProtectedRoute
 - Checks authentication
 - Checks required role
*/
const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RoleProtectedRoute;