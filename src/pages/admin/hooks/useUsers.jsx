import { useEffect, useState } from "react";
import axios from "axios";

function useUsers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/users`)
      .then((res) => {
        const userList = res.data
          .filter((u) => u.role === "user");
        setUsers(userList);
      });

    axios.get(`http://localhost:3001/orders`)
      .then((res) => {
        setOrders(res.data);
      });
  }, []);

  const updateUserStatus = (id, status) => {
    axios.patch(`http://localhost:3001/users/${id}`, { status })
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status } : u))
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
