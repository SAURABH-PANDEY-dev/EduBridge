import { useState } from "react";
import { changePassword } from "../api/userApi";
import "../styles/ChangePassword.css";

function ChangePassword() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmationPassword: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmationPassword) {
            alert("New passwords do not match");
            return;
        }

        try {
            await changePassword(form);
            alert("Password changed successfully");
            setForm({
                currentPassword: "",
                newPassword: "",
                confirmationPassword: "",
            });
        } catch (err) {
            console.log(err);
            alert("Failed to change password");
        }
    };

    return (
        <div className="password-page">
            <div className="password-card">
                <h2>Change Password</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={form.currentPassword}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirmationPassword"
                        placeholder="Confirm New Password"
                        value={form.confirmationPassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">Update Password</button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;