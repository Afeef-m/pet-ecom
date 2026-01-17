import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBoxOpen } from "react-icons/fa";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const orders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return setLoading(false);
      try {
        const { data: orderData } = await axios.get(
          `http://localhost:3001/orders?userId=${user.id}`
        );
        const [productRes, accessoryRes] = await Promise.all([
          axios.get("http://localhost:3001/products"),
          axios.get("http://localhost:3001/accessories"),
        ]);
        const allItems = [...productRes.data, ...accessoryRes.data];

        const newOrders = orderData.map((order) => {
          const sameItems = order.items.map((item) => {
            const product = allItems.find((p) => p.id === item.productId);
            return {
              ...item,
              name: product?.name || "Unknown",
              price: product?.price || 0,
            };
          });
          return { ...order, items: sameItems };
        });

        setOrders(newOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    orders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;
    try {
      const res = await
        axios.patch(`https://your-service-name.up.railway.app/orders/${orderId}`, {
          status: "Cancelled",
        });

      if (res.status === 200) {
        toast.success("Order cancelled successfully");
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      } else {
        toast.error("Failed to cancel the order");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error("Error cancelling order");
    }
  };

  if (loading) return;
  <p className="text-center my-5">Loading orders...</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center"><FaBoxOpen /> My Orders</h2>

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
            const total = order.items?.reduce((sum, item) => {
              return sum + Number(item.price) * Number(item.quantity);
            }, 0);

            return (
              <div
                className="card mb-4 shadow-sm"
                style={{ width: "22rem" }}
                key={order.id}>
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order.id}</h5>
                  <p>
                    <strong>Total Items:</strong> {order.items?.length}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ₹{total.toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${order.status === "Delivered"
                          ? "bg-success"
                          : order.status === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}>
                      {order.status || "Pending"}
                    </span>
                  </p>

                  <h6 className="mt-3">Items:</h6>
                  <ul className="list-group list-group-flush">
                    {order.items?.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between"
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {order.status !== "Delivered" &&
                    order.status !== "Cancelled" && (
                      <button
                        className="btn btn-outline-danger mt-3"
                        onClick={() => handleCancelOrder(order.id)}>
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
