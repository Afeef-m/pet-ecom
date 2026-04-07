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
    <div className="container-sm w-50 py-5">
      <h2>Checkout</h2>

      <div className="card p-4 shadow-sm">
        <h5>Delivery Address</h5>

        <textarea
          className="form-control mb-3"
          rows="3"
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <h5>Order Summary:</h5>

        {cart.map((item) => (
          <div
            key={item.productId?._id}
            className="d-flex justify-content-between"
          >
            <div>
              {item.productId?.name} (x {item.quantity})
            </div>
            <div>
              ₹{(item.productId?.price || 0) * item.quantity}
            </div>
          </div>
        ))}

        <hr />
        <h5>Total: ₹{total}</h5>

        <button
          className="btn btn-success mt-3"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}