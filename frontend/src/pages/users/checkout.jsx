import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const { cart } = location.state || {};

  const total = cart?.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0,
  );
  const handleProceed = () => {
    if (!user) {
      toast.warning("Login first!");
      return;
    }

    if (!address.trim()) {
      toast.info("Please enter your address");
      return;
    }

    navigate("/payment", {
      state: {
        user,
        cart,
        total,
        address,
      },
    });
  };

  if (!cart || cart.length === 0) {
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
            <div>₹{(item.productId?.price || 0) * item.quantity}</div>
          </div>
        ))}
        <hr />
        <h5>Total: ₹{total}</h5>
        <div>
          <button className="btn btn-success mt-3" onClick={handleProceed}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
