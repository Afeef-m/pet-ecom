import { HeartHandshake, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate()

useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchWishlist();
}, []);

const removeFromWishlist = async (productId) => {
  try {
    const res = await api.delete(`/wishlist/remove/${productId}`);
    setWishlist(res.data?.items || []);
    toast.warn("Item removed");
  } catch (err) {
    console.error(err);
  }
};

const addToCart = async (item) => {
  try {
    await api.post("/cart/add", {
      productId: item.productId._id,
      quantity: 1,
    });

    await api.delete(`/wishlist/remove/${item.productId._id}`);

    setWishlist((prev) =>
      prev.filter((i) => i.productId._id !== item.productId._id)
    );

    toast.success("Moved to cart");
  } catch {
    toast.error("Failed to move item");
  }
};

  return (
    <div className="container py-5">
  <h2 className="fw-bold text-center mb-5 d-flex justify-content-center align-items-center gap-2">
    <HeartHandshake className="text-danger" size={28} />
    My Wishlist
  </h2>

  {wishlist.length === 0 ? (
    <div className="text-center py-5">
      <h5 className="text-muted mb-3">Your wishlist is empty</h5>
      <button className="btn btn-dark px-4" onClick={() => navigate("/")}>
        Discover Products
      </button>
    </div>
  ) : (
    <div className="row g-4">
      {wishlist.map((item) => (
        <div key={item.productId._id} className="col-md-6 col-lg-4">
          <div
            className="card border-0 h-100 position-relative wishlist-card"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Remove Button */}
            <button
              className="btn btn-light position-absolute"
              style={{
                top: "14px",
                right: "14px",
                borderRadius: "50%",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
              onClick={() =>
                removeFromWishlist(item.productId._id)
              }
            >
              <X size={16} />
            </button>

            {/* Product Image */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                height: "220px",
                background: "#f9f9f9",
              }}
            >
              <img
                src={item.productId?.image}
                alt={item.productId?.name}
                style={{
                  maxHeight: "170px",
                  objectFit: "contain",
                  transition: "0.3s ease",
                }}
                className="wishlist-img"
              />
            </div>

            {/* Product Info */}
            <div className="card-body d-flex flex-column p-4">
              <h6 className="fw-semibold mb-2">
                {item.productId?.name}
              </h6>

              <p className="text-muted small mb-2">
                {item.productId?.weight || "Standard Size"}
              </p>

              <h5 className="fw-bold mb-3">
                ₹{item.productId?.price?.toLocaleString()}
              </h5>

              <button
                className="btn btn-dark mt-auto"
                style={{
                  borderRadius: "12px",
                  padding: "10px",
                }}
                onClick={() => addToCart(item)}
              >
                Move to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
}


