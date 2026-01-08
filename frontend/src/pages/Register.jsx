import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";


function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(
                form.name,
                form.email,
                form.password,
                form.role
            );
            alert("Registration successful");
            navigate("/");
        } catch (error) {
            alert("Registration failed as :- ",error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>

            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

            <select name="role" onChange={handleChange}>
                <option value="STUDENT">STUDENT</option>
                <option value="ADMIN">ADMIN</option>
            </select>

            <button type="submit">Register</button>
        </form>
    );
}

export default Register;