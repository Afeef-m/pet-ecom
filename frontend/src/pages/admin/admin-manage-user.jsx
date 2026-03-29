import React from "react";
import useUsers from "./hooks/useUsers";

export default function AdminManageUser() {
  const {
    users,
    loading,
    search,
    status,
    page,
    total,
    limit,
    setPage,
    setSearch,
    setStatus,
    blockUser,
    unblockUser,
    deactivateUser,
    activateUser,
  } = useUsers();

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 rounded-4">
        {/* Header */}
        <div className="card-body border-bottom">
          <h4 className="fw-bold mb-1">Manage Users</h4>
          <p className="text-muted small mb-0">
            Search, filter and manage user accounts
          </p>
        </div>

        <div className="card-body">
          {/* Filters */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">🔍</span>
                <input
                  type="text"
                  value={search}
                  placeholder="Search by name or email..."
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="spinner-border text-primary" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div>
                          <div className="fw-semibold">{user.name}</div>
                          <div className="text-muted small">{user.email}</div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge px-3 py-2 ${
                            user.status === "active"
                              ? "bg-success-subtle text-success"
                              : user.status === "inactive"
                              ? "bg-warning-subtle text-warning"
                              : "bg-danger-subtle text-danger"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-secondary-subtle text-dark">
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span className="fw-semibold">
                          {user.orderCount || 0}
                        </span>
                      </td>

                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                          {user.status === "blocked" ? (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => unblockUser(user._id)}
                            >
                              Unblock
                            </button>
                          ) : user.status === "inactive" ? (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => activateUser(user._id)}
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => blockUser(user._id)}
                            >
                              Block
                            </button>
                          )}

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => deactivateUser(user._id)}
                            disabled={user._id === currentUser?._id}
                          >
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              {/* Result count */}
              <p className="text-muted small mb-0">
                Showing{" "}
                <span className="fw-semibold">
                 {(page - 1) * limit + 1}–{Math.min(page * limit, total)}
                </span>{" "}
                of <span className="fw-semibold">{total}</span> users
              </p>

              {/* Page buttons */}
              <ul className="pagination pagination-sm mb-0">
                {/* Previous */}
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    &laquo;
                  </button>
                </li>

                {/* Page numbers with ellipsis */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      (p >= page - 1 && p <= page + 1)
                  )
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <li key={`ellipsis-${idx}`} className="page-item disabled">
                        <span className="page-link">…</span>
                      </li>
                    ) : (
                      <li
                        key={item}
                        className={`page-item ${page === item ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage(item)}
                        >
                          {item}
                        </button>
                      </li>
                    )
                  )}

                {/* Next */}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>  
      </div>
    </div>
  );
}