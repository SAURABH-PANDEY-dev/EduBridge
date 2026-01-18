import { useState } from "react";
import { forgotPassword } from "../api/userApi";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            alert("Reset link sent to your email");
            setEmail("");
        } catch (err) {
            console.log(err);
            alert("Failed to send reset link");
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-card">
                <h2>Forgot Password</h2>
                <p>Enter your email and we'll send you a link to reset your password.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button type="submit">Send Reset Link</button>
                </form>

            </div>
        </div>

    );
}

export default ForgotPassword;