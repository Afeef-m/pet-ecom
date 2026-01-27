import { useEffect, useState } from "react";
import { api } from "../../../api";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") return setLoading(false);

    api.get(`/orders`).then((res) => {
      setOrders(res.data)
    })
    .finally(()=>setLoading(false))
  }, []);

  const updateOrderStatus = (id, newStatus) => {
    api.patch(`/orders/${id}`, {
      status: newStatus,
    }).then(() => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order));
    });
  };

  return { orders, loading, updateOrderStatus };
}

