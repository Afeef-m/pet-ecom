import { useEffect, useState } from "react";
import { api } from "../../../api";

function useUsers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get(`/users`)
      .then((res) => {
        const userList = res.data
          .filter((u) => u.role === "user");
        setUsers(userList);
      });

    api.get(`/orders`)
      .then((res) => {
        setOrders(res.data);
      });
  }, []);

  const updateUserStatus = (id, status) => {
    api.patch(`/users/${id}`, { status })
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, status } : u))
        );
      });
  };

  const blockUser = (id) => updateUserStatus(id, "blocked");
  const unblockUser = (id) => updateUserStatus(id, "active");
  const deleteUser = (id) => updateUserStatus(id, "inactive");
  const activateUser = (id) => updateUserStatus(id, "active");

  return { users, orders, blockUser, unblockUser, deleteUser, activateUser };
}

export default useUsers;
