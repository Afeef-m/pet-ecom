import React from "react";
import { useRef, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaShoppingCart, FaHeart, FaBoxOpen, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import "./navbar.css";

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navbar = useRef(null);

    useEffect(() => {
    const user = localStorage.getItem("user");
    setLoggedIn(!!user);
  }, [location]);
  
  const isAdminRoute = [
    "/admin-dashboard",
    "/admin-manage-user",
    "/admin-manage-product",
    "/admin-orders"
  ].some((path) => location.pathname.startsWith(path));

  if (isAdminRoute) {
    return null;
  }



  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    setLoggedIn(false);
    navigate("/");
  };

  const collapseNavbar = () => {
    const navCollapse = document.getElementById("navbarContent");
    const Collapse = window.bootstrap.Collapse.getInstance(navCollapse);
    if (Collapse && navCollapse.classList.contains("show")) {
      Collapse.hide();
    }
  };

  return (
    <nav
      className="navbar custom-navbar navbar-expand-lg px-3 py-2 sticky-top shadow-sm"
      ref={navbar}
    >
      <div className="container-fluid">
        <img src="/images/logo-nav.png" alt="Logo" height="50" />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarContent"
        >
          <div
            className="mx-auto my-2 my-lg-0 text-center"
            onClick={collapseNavbar}
          >
            <span className="navbar-brand mb-0 h1 fw-bold text-dark">
              PETS PLUS
            </span>
          </div>

          <div className="d-flex flex-column flex-lg-row align-items-center gap-3 ms-auto fs-4">
            <Link to="/" className="btn" onClick={collapseNavbar} title="Home">
              <FaHome size={30}/>
            </Link>
            <Link
              to="/cart"
              className="btn"
              onClick={collapseNavbar}
              title="Cart"
            >
              <FaShoppingCart size={30}/>
            </Link>
            <Link
              to="/wishlist"
              className="btn"
              onClick={collapseNavbar}
              title="Wishlist"
            >
              <FaHeart size={30}/>
            </Link>

            {loggedIn && (
              <>
                <Link
                  to="/orders"
                  className="btn"
                  onClick={collapseNavbar}
                  title="Orders"
                >
                  <FaBoxOpen size={30}/>
                </Link>
                <Link
                  to="/profile"
                  className="btn"
                  onClick={collapseNavbar}
                  title="Profile"
                >
                  <FaUser size={30}/>
                </Link>
              </>
            )}

            {!loggedIn && (
              <>
                <Link
                  to="/login"
                  className="btn btn-success"
                  onClick={collapseNavbar}
                  title="Login"
                >
                  <FaSignInAlt size={20}/>
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={collapseNavbar}
                  title="Register"
                >
                  <FaUserPlus size={20}/>
                </Link>
              </>
            )}

            {loggedIn && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  collapseNavbar();
                  handleLogout();
                }}
                title="Logout"
              >
                <FaSignOutAlt size={25}/>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
