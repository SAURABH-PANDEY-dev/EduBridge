import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            alert("Invalid credentials as :- ", error);
        }
    };

    return (
        <div className="login-page">
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Login</button>
                </form>

                <p className="register-text">
                    Don't have an account?{" "}
                    <Link to="/register" className="register-link">
                        Register here
                    </Link>
                </p>
            </div>
        </div>

    );
}

export default Login;