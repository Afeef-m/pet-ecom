import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUserEdit,
  FaSignOutAlt,
  FaBoxOpen,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import { api } from "../../api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      setName(storedUser.name);
      setEmail(storedUser.email);
      setPassword(storedUser.password);
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedUser = { ...user, name, email, password };
      await api.patch(`/users/${user._id}`, updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditMode(false);
      toast.success(" Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-primary">
        <FaUserEdit className="me-2" />
        My Profile
      </h2>

      <div className="card p-4 shadow-sm">
        {editMode ? (
          <>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="d-flex flex-column flex-md-row gap-2">
              <button
                className="btn btn-success"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Status:</strong> {user.status}</p>

            <button
              className="btn btn-outline-secondary mt-3"
              onClick={() => setEditMode(true)}
            >
              <FaUserEdit className="me-2" />
              Edit Profile
            </button>
          </>
        )}

        <button className="btn btn-danger mt-3" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />
          Logout
        </button>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => navigate("/orders")}
        >
          <FaBoxOpen className="me-2" />
          My Orders
        </button>
        <button
          className="btn btn-outline-success me-2"
          onClick={() => navigate("/wishlist")}
        >
          <FaHeart className="me-2" />
          My Wishlist
        </button>
        <button
          className="btn btn-outline-warning"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart className="me-2" />
          My Cart
        </button>
      </div>
    </div>
  );
}

export default Profile;
