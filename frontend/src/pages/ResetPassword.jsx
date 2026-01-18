import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/userApi";
import "../styles/ResetPassword.css";

function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get("token");

    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await resetPassword({
                token,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            });

            alert("Password reset successful");
            navigate("/");
        } catch (err) {
            console.log(err);
            alert("Password reset failed");
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-card">
                <h2>Reset Password</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>

    );
}

export default ResetPassword;