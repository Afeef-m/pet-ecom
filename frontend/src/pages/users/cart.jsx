import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import { api } from "../../api";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        setCartItems(res.data?.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (productId, change) => {
    try {
      const res = await api.put("/cart/update", {
        productId,
        change,
      });

      setCartItems(res.data?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      setCartItems(res.data?.items || []);
      toast.warn("Item removed");
    } catch (err) {
      console.error(err);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0,
  );

  const handleBuy = async () => {
    try {
      const res = await api.get("/cart");
      const total = res.data.items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0,
      );

      navigate("/checkout", {
        state: {
          cart: res.data.items,
          total,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
  <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
    <FaShoppingCart /> Shopping Cart
  </h2>

  {cartItems.length === 0 ? (
    <div className="text-center py-5">
      <h5 className="text-muted">Your cart is empty</h5>
      <button className="btn btn-dark mt-3" onClick={() => navigate("/")}>
        Continue Shopping
      </button>
    </div>
  ) : (
    <div className="row g-4">
      
      {/* LEFT SIDE - PRODUCTS */}
      <div className="col-lg-8">
        {cartItems.map((item) => (
          <div
            key={item.productId._id}
            className="card border-0 shadow-sm mb-4 p-3"
            style={{ borderRadius: "14px" }}
          >
            <div className="row align-items-center">

              {/* Image */}
              <div className="col-md-3 text-center">
                <img
                  src={item.productId?.image}
                  alt={item.productId?.name}
                  className="img-fluid"
                  style={{
                    maxHeight: "140px",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="col-md-5">
                <h5 className="fw-semibold mb-2">
                  {item.productId?.name}
                </h5>
                <p className="text-muted small mb-1">
                  Weight: {item.productId?.weight || "Not specified"}
                </p>
                <h6 className="fw-bold text-success">
                  ₹{item.productId?.price}
                </h6>
              </div>

              {/* Quantity + Remove */}
              <div className="col-md-4 text-md-end mt-3 mt-md-0">

                <div className="d-inline-flex align-items-center border rounded-pill px-3 py-1 mb-3">
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      updateQuantity(item.productId._id, -1)
                    }
                  >
                    −
                  </button>

                  <span className="mx-3 fw-semibold">
                    {item.quantity}
                  </span>

                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      updateQuantity(item.productId._id, 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      removeFromCart(item.productId._id)
                    }
                  >
                    Remove
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="col-lg-4">
        <div
          className="card border-0 shadow-lg p-4"
          style={{
            borderRadius: "16px",
            position: "sticky",
            top: "100px",
          }}
        >
          <h5 className="fw-bold mb-3">Order Summary</h5>

          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <span>Shipping</span>
            <span className="text-success">Free</span>
          </div>

          <hr />

          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <button
            className="btn btn-dark w-100 mt-4"
            style={{ borderRadius: "10px", padding: "12px" }}
            onClick={handleBuy}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

    </div>
  )}
</div>
  );
}

export default Cart;
