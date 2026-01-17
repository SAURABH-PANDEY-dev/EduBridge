import { Navigate } from "react-router-dom";

/*
 ProtectedRoute
 - Checks JWT token existence
 - Redirects to login if not authenticated
*/
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;