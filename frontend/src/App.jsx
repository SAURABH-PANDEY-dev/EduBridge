import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleProtectedRoute from "./auth/RoleProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Users */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Only 
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPanel />
            </RoleProtectedRoute>
          }
        />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;