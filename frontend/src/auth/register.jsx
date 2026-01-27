import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { SlArrowRightCircle } from "react-icons/sl";
import { api } from '../api';

export default function Register() {
   const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if( !name, !email, !password){
      toast.info("Fill all field")
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
      await api.post(`/auth/register`,{
        name, email, password
      });
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
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
            onChange={(e) => setName(e.target.value )}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Enter Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value )}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Create Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            autoComplete="off"
            onChange={(e) => setPassword( e.target.value)}
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


