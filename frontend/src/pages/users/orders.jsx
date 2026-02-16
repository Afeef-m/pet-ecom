import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBoxOpen } from "react-icons/fa";
import { api } from "../../api";
import { Loader2Icon } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return setLoading(false);
      try {
        const res = await api.get(`/orders/user/${user._id}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await api.patch(`/orders/${orderId}`, { status: "Cancelled" });

      toast.success("Order cancelled");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "Cancelled" } : o,
        ),
      );
    } catch {
      toast.error("Error cancelling order");
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center text-secondary gap-2">
        <div
          className="spinner-border"
          role="status"
          style={{ width: "1.5rem", height: "1.5rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <span>Loading Orders...</span>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-5 text-center fw-bold">
        <FaBoxOpen className="me-2" />
        My Orders
      </h2>

      <div className="text-center mb-4">
        <button
          className="btn btn-outline-dark rounded-pill px-4"
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-muted py-5">
          <h5>No orders yet</h5>
          <p>Start shopping to see your orders here.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => {
            const total = order.items.reduce(
              (sum, item) =>
                sum +
                Number(item.productId?.price || 0) * Number(item.quantity),
              0,
            );

            return (
              <div
                key={order._id}
                className="card border-0 shadow-sm rounded-4 p-4"
                style={{ transition: "0.3s ease" }}
              >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-1 text-muted">Order ID</h6>
                    <p className="mb-0 fw-semibold">{order._id}</p>
                  </div>

                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      order.status === "Delivered"
                        ? "bg-success"
                        : order.status === "Cancelled"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Summary */}
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <small className="text-muted">Items</small>
                    <p className="mb-0 fw-medium">{order.items.length}</p>
                  </div>

                  <div>
                    <small className="text-muted">Total</small>
                    <p className="mb-0 fw-bold">₹{total.toLocaleString()}</p>
                  </div>
                </div>

                <hr />

                {/* Product List */}
                <div className="d-flex flex-column gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.productId?.image}
                          alt={item.productId?.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            background: "#f8f9fa",
                          }}
                        />

                        <div>
                          <p className="mb-1 fw-medium">
                            {item.productId?.name}
                          </p>
                          <small className="text-muted">
                            Quantity: {item.quantity}
                          </small>
                        </div>
                      </div>

                      <div className="fw-semibold">
                        ₹
                        {(
                          item.productId?.price * item.quantity
                        ).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {order.status === "Pending" && (
                  <div className="text-end mt-4">
                    <button
                      className="btn btn-outline-danger rounded-pill px-4"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
