import { useState, useEffect } from "react";
import axios from "axios";

function useProduct() {
  const [products, setProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3001/products"),
      axios.get("http://localhost:3001/accessories"),
    ]).then(([productRes, accessoryRes]) => {
      setProducts(productRes.data);
      setAccessories(accessoryRes.data);
      setLoading(false);
    });
  }, []);

  const addProduct = (newData, type) => {
    axios.post(`http://localhost:3001/${type}`, newData).then((res) => {
      type === "products"
        ? setProducts((prev) => [...prev, res.data])
        : setAccessories((prev) => [...prev, res.data]);
    });
  };

  const updateProduct = (id, updatedData, type) => {
    axios.patch(`http://localhost:3001/${type}/${id}`, updatedData)
      .then((res) => {
        type === "products"
          ? setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)))
          : setAccessories((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      });
  };

  const activateProduct = (type, id) => {
    axios.patch(`http://localhost:3001/${type}/${id}`, { status: "active" })
      .then((res) => {
        type === "products"
          ? setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)))
          : setAccessories((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      });
  };

  const deleteProduct = (type, id) => {
    axios.patch(`http://localhost:3001/${type}/${id}`, { status: "inactive" })
      .then((res) => {
        type === "products"
          ? setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)))
          : setAccessories((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      });
  };

  return {
    products,
    accessories,
    loading,
    addProduct,
    updateProduct,
    activateProduct,
    deleteProduct,
  };
}

export default useProduct;
