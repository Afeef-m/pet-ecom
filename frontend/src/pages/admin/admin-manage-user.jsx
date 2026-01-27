import React, { useState, useMemo } from "react";
import useUsers from "./hooks/useUsers";

function AdminManageUser() {
  const { users, orders, blockUser, unblockUser, deleteUser, activateUser } = useUsers();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredUsers = useMemo(() => {
    const searchLower = search.toLowerCase();
    return users
      .filter((u) => (filter === "All" ? true : u.status === filter))
      .filter((u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
      );
  }, [users, search, filter]);

  return (
    <div className="container py-4">
      <div className="border rounded p-4" style={{ backgroundColor: "#f9f9f9" }}>
        <h2 className="mb-4">Admin Manage Users</h2>

        <div className="row mb-3 g-2">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Search by Name or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select"
            >
              <option value="All">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered text-center align-m_iddle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Role</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const userOrders = orders.filter((order) => order.user_Id === user.__id);

                  return (
                    <tr key={user.__id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className={`badge ${
                            user.status === "active"
                              ? "bg-success" : user.status === "blocked"
                              ? "bg-danger" : "bg-secondary"
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.role}</td>
                      <td>{userOrders.length}</td>
                      <td>
                        {user.status === "blocked" ? (
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => unblockUser(user._id)}
                            disabled={user._id === currentUser?._id}
                          >
                            Unblock
                          </button>
                        ) : user.status === "inactive" ? (
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => activateUser(user._id)}
                            disabled={user._id === currentUser?._id}
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => blockUser(user._id)}
                            disabled={user._id === currentUser?._id}
                          >
                            Block
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(user._id)}
                          disabled={user._id === currentUser?._id}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminManageUser;
