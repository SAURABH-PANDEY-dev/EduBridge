import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css"


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
            console.log(error);
            alert("Registration failed ");
        }
    };

    return (
        <div className="RegBox">
        <form onSubmit={handleSubmit} className="RegForm">
            <h2>Register</h2>

                <label>Name</label>
            <input name="name" placeholder="Enter your Name" onChange={handleChange} required />
            <label>Email</label>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <label>Password</label>
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <label>Role</label>
            <select name="role" onChange={handleChange}>
                <option value="STUDENT">STUDENT</option>
            </select>
            <br></br>
            <button type="submit">Register</button>
        </form>

        
            <p  className="SwitchPage">
                Already have an account?{" "}
                <Link to="/" >
                    Log in here
                </Link>
            </p>
        </div>
    );
}

export default Register;