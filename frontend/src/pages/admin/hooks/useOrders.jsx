import { useEffect, useState } from "react";
import axios from "axios";

function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") return setLoading(false);

    axios.get("http://localhost:3001/orders").then((orderRes) => {
      Promise.all([
        axios.get("http://localhost:3001/products"),
        axios.get("http://localhost:3001/accessories"),
        axios.get("http://localhost:3001/users"),
      ]).then(([prodRes, accRes, userRes]) => {
        const allItems = [...prodRes.data, ...accRes.data];
        const allUsers = userRes.data;

        const enrichedOrders = orderRes.data.map((order) => {
          const updatedItems = order.items.map((item) => {
            const product = allItems.find((p) => p.id === item.productId);
            return {
              ...item,
              name: product?.name || "Unknown",
              price: product?.price || 0,
            };
          });

          const matchedUser = allUsers.find((u) => u.id === order.userId);

          return {
            ...order,
            userName: matchedUser?.name || "Unknown",
            items: updatedItems,
          };
        });

        setOrders(enrichedOrders);
        setLoading(false);
      });
    });
  }, []);

  const updateOrderStatus = (id, newStatus) => {
    axios.patch(`http://localhost:3001/orders/${id}`, {
      status: newStatus,
    }).then(() => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order));
    });
  };

  return { orders, loading, updateOrderStatus };
}

export default useOrders;
