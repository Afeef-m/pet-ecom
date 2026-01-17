import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBoxOpen, FaUsersCog, FaClipboardList } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div
  className="card shadow-lg p-4 mx-auto"
  style={{
    maxWidth: "1140px",        
    width: "100%",             
    borderRadius: "12px",
    backgroundColor: "#e6bc81c7",
  }}>

        <h2 className="text-center fw-bold mb-4">⚙️ Admin Dashboard</h2>

        <div className="row justify-content-center g-4">
          <div className="col-md-4">
            <div
              className="card shadow-sm text-center p-4 border-0 h-100">
              <FaBoxOpen size={50} className="text-primary mb-3  d-block mx-auto" />
              <h4 className="fw-semibold">Product Management</h4>
              <p className="text-muted">
                 Manage the products.
              </p>
              <button
                className="btn btn-primary w-100"
                onClick={() => navigate("/admin-manage-product")}>
                Manage Products
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card shadow-sm text-center p-4 border-0 h-100">
             <FaUsersCog size={50} className="text-success mb-3 d-block mx-auto" />
              <h4 className="fw-semibold">User Management</h4>
              <p className="text-muted">
                 Manage the registered users.
              </p>
              <button
                className="btn btn-success w-100"
                onClick={() => navigate("/admin-manage-user")}
              >
                Manage Users
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card shadow-sm text-center p-4 border-0 h-100"
            >
              <FaClipboardList size={50} className="text-warning mb-3  d-block mx-auto" />
              <h4 className="fw-semibold">Order Management</h4>
              <p className="text-muted">Manage the all user orders.</p>
              <button
                className="btn btn-warning w-100"
                onClick={() => navigate("/admin-orders")}
              >
                Manage Orders
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-danger px-4 py-2 w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
