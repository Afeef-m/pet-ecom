import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBoxOpen } from "react-icons/fa";
import { api } from "../../api";
import { Loader2Icon } from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return setLoading(false);
      try {
        const res = await api.get(`/orders/user/${user._id}`)
        setOrders(res.data)
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
          o._id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch {
      toast.error("Error cancelling order");
    }
  };

 if (loading) {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center text-secondary gap-2">
      <div className="spinner-border" role="status" style={{ width: "1.5rem", height: "1.5rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <span>Loading Orders...</span>
    </div>
  );
}

  return (
      <div className="container my-5">
      <h2 className="mb-4 text-center">
        <FaBoxOpen /> My Orders
      </h2>

      <div className="text-center my-4">
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Back to Home
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="d-flex justify-content-center flex-wrap gap-4">
          {orders.map((order) => {
            const total = order.items.reduce(
              (sum, item) =>
                sum +
                Number(item.productId.price) * Number(item.quantity),
              0
            );

            return (
              <div
                key={order._id}
                className="card mb-4 shadow-sm"
                style={{ width: "22rem" }}
              >
                <div className="card-body">
                  <h5>Order ID: {order._id}</h5>

                  <p>
                    <strong>Total Items:</strong> {order.items.length}
                  </p>

                  <p>
                    <strong>Total Price:</strong> ₹{total}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`badge ${
                      order.status === "Delivered"
                        ? "bg-success"
                        : order.status === "Cancelled"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}>
                      {order.status}
                    </span>
                  </p>

                  <ul className="list-group list-group-flush">
                    {order.items.map((item) => (
                      <li
                        key={item._id}
                        className="list-group-item d-flex justify-content-between"
                      >
                        <span>
                          {item.productId.name} × {item.quantity}
                        </span>
                        <span>
                          ₹{item.productId.price * item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {order.status === "Pending" && (
                    <button
                      className="btn btn-outline-danger mt-3"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
