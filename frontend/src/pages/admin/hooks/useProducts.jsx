//frontend\src\pages\admin\hooks\useProducts.jsx

import { useState, useEffect } from "react";
import { api } from "../../../api";
import { toast } from "react-toastify";

export default function useProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const LIMIT = 5;
  
  const fetchProducts = (category = "All", currentPage = 1) => {
    setLoading(true);
    const params = {
      limit: LIMIT,
      page: currentPage,
      showAll: "true", 
    };
    if (category !== "All") params.category = category;

    api.get("/products", { params })
      .then((res) => {
        setProducts(res.data?.data || []);
        setTotalPages(res.data?.totalPages || 1);
        setTotal(res.data?.totalItems || 0);
      })
      .catch(() => toast.error("Failed to fetch products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(filter, page);
  }, [filter, page]);

   const handleSetFilter = (val) => {
    setPage(1);
    setFilter(val);
  };

  const addProduct = (data) => {
    api.post("/products", data)
      .then(() => {
        toast.success("Product added");
        fetchProducts(filter, page); 
      })
      .catch(() => toast.error("Failed to add product"));
  };

 const updateProduct = (id, updatedData) => {
    api.patch(`/products/${id}`, updatedData)
      .then(() => {
        toast.success("Product updated");
        fetchProducts(filter, page); 
      })
      .catch(() => toast.error("Failed to update product"));
  };

  const updateStatus = (id, status) => {
    api.patch(`/products/${id}`, { status })
      .then(() => {
        toast.success(`Product ${status}`);
        fetchProducts(filter, page); 
      })
      .catch(() => toast.error("Failed to update status"));
  };

  return {
    products,
    loading,
    filter,         
    setFilter: handleSetFilter,
    page,
    setPage,
    totalPages,
    total,
    LIMIT,
    addProduct,
    updateProduct,
    updateStatus,
  };
}
