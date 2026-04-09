import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch {
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.info("Please enter your address");
      return;
    }

    try {
      setLoading(true);

      await api.post("/checkout", { address });

      toast.success("Order placed successfully!");

      navigate("/orders"); 

    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <p className="text-center mt-5">No items to checkout.</p>;
  }

  return (
  <div className="container py-4 d-flex justify-content-center">
  <div className="w-100" style={{ maxWidth: "500px" }}>
    
    {/* Title */}
    <h3 className="fw-bold mb-4 text-center">Checkout</h3>

    <div className="card border-0 shadow-sm rounded-4 p-4">

      {/* Address Section */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-2">Delivery Address</h6>

        <textarea
          className="form-control rounded-3"
          rows="3"
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Order Summary */}
      <div className="mb-3">
        <h6 className="fw-semibold mb-3">Order Summary</h6>

        <div className="d-flex flex-column gap-2">
          {cart.map((item) => (
            <div
              key={item.productId?._id}
              className="d-flex justify-content-between align-items-start"
            >
              <div className="small">
                <div className="fw-medium">
                  {item.productId?.name}
                </div>
                <div className="text-muted">
                  Qty: {item.quantity}
                </div>
              </div>

              <div className="fw-semibold">
                ₹{(item.productId?.price || 0) * item.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-3" />

      {/* Total */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-semibold">Total</span>
        <span className="fw-bold fs-5">₹{total}</span>
      </div>

      {/* Button */}
      <button
        className="btn btn-success w-100 py-2 rounded-3 fw-semibold"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  </div>
</div>
  );
}