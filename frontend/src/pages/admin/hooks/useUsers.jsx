import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../../api";
import { toast } from "react-toastify";

export default function useUsers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);

  const page   = parseInt(searchParams.get("page"))   || 1;
  const search = searchParams.get("search")            || "";
  const status = searchParams.get("status")            || "All";

  const updateParams = (updates) => {
    const current = Object.fromEntries(searchParams.entries());
    const next = { ...current, ...updates };

    if (next.page === "1")   delete next.page;
    if (next.search === "")  delete next.search;
    if (next.status === "All") delete next.status;

    setSearchParams(next, { replace: true });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users", { params: { page, limit: 5, search, status }});
      setUsers(res.data?.data || []);
      setTotal(res.data?.total || 0);
      setLimit(res.data?.limit || 5);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, status]);

  const updateUserStatus = async (id, newStatus) => {
    try {
      await api.patch(`/users/${id}`, { status: newStatus });
      fetchUsers();
      toast.success(`User ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const handleSetSearch = (val) => {
    updateParams({ search: val, page: "1" });
  };

  const handleSetStatus = (val) => {
    updateParams({ status: val, page: "1" });
  };

  const handleSetPage = (val) => {
    updateParams({ page: String(val) });
  };

  return {
    users,
    loading,
    page,
    total,
    search,   
    status,  
    limit, 
    setPage: handleSetPage,
    setSearch: handleSetSearch,
    setStatus: handleSetStatus,
    blockUser:      (id) => updateUserStatus(id, "blocked"),
    unblockUser:    (id) => updateUserStatus(id, "active"),
    activateUser:   (id) => updateUserStatus(id, "active"),
    deactivateUser: (id) => updateUserStatus(id, "inactive"),
  };
}