import React from "react";
import useOrders from "./hooks/useOrders";

function AdminOrders() {
  const { orders, loading, updateOrderStatus } = useOrders();

  if (loading) return <p className="text-center my-5">Loading orders...</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">All Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="d-flex justify-content-center flex-wrap gap-4">
          {orders.map((order) => {
            const total = order.items?.reduce((sum, item) => {
              return sum + item.price * item.quantity;
            }, 0);

            return (
              <div
                className="card shadow-sm p-3"
                key={order._id}
                style={{ width: "24rem" }}>
                <h5>Order ID: {order._id}</h5>
                <p><strong>User ID:</strong> {order.userId}</p>
                <p><strong>User Name:</strong> {order.userName}</p>
                <p><strong>Total:</strong> ₹{total.toLocaleString()}</p>
                <p><strong>Status:</strong>{" "}
                  <span className="badge bg-info">{order.status}</span>
                </p>

                <ul className="list-group list-group-flush mb-2">
                  {order.items.map((item, idx) => (
                    <li key={idx}
                      className="list-group-item d-flex justify-content-between">
                      {item.name} × {item.quantity}
                      <span>₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>

                <div className="d-flex gap-2 mt-2">
                  {order.status !== "Delivered" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => updateOrderStatus(order._id, "Delivered")}>
                      Mark as Delivered
                    </button>
                  )}
                  {order.status !== "Cancelled" && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => updateOrderStatus(order._id, "Cancelled")}>
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

export default AdminOrders;
