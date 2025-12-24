import React, { useState } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { SlArrowRightCircle } from "react-icons/sl";


function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "user", status: "active" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    const { name, email, password } = user;

    if (!name || !email || !password) {
      toast.info("Fill all fields!");
      return;
    }

    if (!email.includes("@gmail.com")) {
      toast.warning("Please enter a valid Gmail address.");
      return;
    }

    if (password.length < 4) {
      toast.warning("Password must be at least 4 characters.");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
      toast.warning("Password must contain letters and numbers.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/users", user);
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error", err);
      toast.error("Registration failed.");
    }
  };


  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `url("/images/bg.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.46)",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          color: "#000",
        }}
      >
        <h3 className="text-center mb-4 text-success fw-bold">Register Here</h3>

        <div className="mb-3">
          <label className="form-label fw-semibold">Enter Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            autoComplete="off"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Enter Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            autoComplete="off"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Create Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            autoComplete="off"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>

        <button className="btn btn-success w-100 fw-semibold"
          style={{
            padding: "10px 0",
            fontSize: "1rem",
            borderRadius: "8px",
            transition: "all 0.3s ease",
          }}
          onClick={handleRegister}>
          Sign Up
          <SlArrowRightCircle size={20} style={{ marginLeft: "8px" }} />
        </button>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
