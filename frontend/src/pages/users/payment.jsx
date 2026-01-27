import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");

  const { user, cart, total, address, product, quantity } =
    location.state || {};

  const actualCart = cart || (product ? [{ ...product, quantity }] : []);
  const actualTotal = total || (product ? product.price * quantity : 0);

  const handlePlaceOrder = async () => {
    const currentUser = user || JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      toast.warning("Login to place an order!");
      return;
    }

    if (!paymentMethod) {
      toast.info("Please select a payment method");
      return;
    }

    const newOrder = {
      userId: currentUser._id,
      items: actualCart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      totalPrice: actualTotal,
      paymentMethod,
      address: address || "No address provided",
      date: new Date().toLocaleString(),
      status: "Pending",
    };

    try {
      const response = await api.post(`/orders`, newOrder);

      if (response.status === 201) {
        toast.success("Order placed successfully!");

        if (cart) localStorage.removeItem("cart");

        navigate("/orders");
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Payment Page</h2>

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card p-4 shadow">
            <h4>Your Order:</h4>
            {actualCart.map((item) => (
              <div key={item._id} className="d-flex justify-content-between">
                <div>
                  {item.name} (x{item.quantity})
                </div>
                <div>₹{item.price * item.quantity}</div>
              </div>
            ))}
            <hr />
            <h5>Total: ₹{actualTotal}</h5>
            <p>
              <strong>Deliver to:</strong> {address || "No address provided"}
            </p>

            <h5 className="mt-4 mb-3">Select Payment Method:</h5>
            <div className="form-check">
              <input
                type="radio"
                id="upi"
                name="payment"
                className="form-check-input"
                value="UPI"
                onChange={(e) => setPaymentMethod(e.target.value)} />
              <label htmlFor="upi" className="form-check-label">
                UPI
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="card"
                name="payment"
                className="form-check-input"
                value="Card"
                onChange={(e) => setPaymentMethod(e.target.value)} />
              <label htmlFor="card" className="form-check-label">
                Card
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="cod"
                name="payment"
                className="form-check-input"
                value="Cash on Delivery"
                onChange={(e) => setPaymentMethod(e.target.value)} />

              <label htmlFor="cod" className="form-check-label">
                Cash on Delivery
              </label>
            </div>
            <div>
              <button
                className="btn btn-success mt-3"
                onClick={handlePlaceOrder}>
                Confirm & Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
