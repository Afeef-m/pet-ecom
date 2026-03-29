import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { SlArrowRightCircle } from "react-icons/sl";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

 const handleLogin = async (e) => {
  e.preventDefault();

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
    toast.error("Enter a valid email");
    return;
  }

  if (trimmedPassword.length < 4) {
    toast.error("Password must be at least 4 characters");
    return;
  }

  try {
    setLoading(true);

    const res = await api.post("/auth/login", {
      email: trimmedEmail,
      password: trimmedPassword,
    });

    const { user, token } = res.data;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    toast.success(`Welcome ${user.name}!`);

    if (location.state?.from) {
      navigate(location.state.from.pathname, { replace: true });
    } else if (user.role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }

  } catch (error) {
    if (!error.response) {
      toast.error("Server not reachable");
    } else {
      toast.error(error.response.data?.message || "Login failed");
    }
  } finally {
    setLoading(false);
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
        <h2 className="text-center mb-4 text-primary fw-bold">Login Here</h2>

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
            style={{
              padding: "10px 0",
              fontSize: "1rem",
              borderRadius: "8px",
              transition: "all 0.3s ease",
            }}
            disabled={loading}
          >
            {loading ? ( "Signing in..." )
            :(
              <>
              Sign in
              <SlArrowRightCircle size={20} />
              </>
            )}
          </button>

          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-decoration-none">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
