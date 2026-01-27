import { useState, useEffect } from "react";
import { api } from "../../../api";

function useProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
    .then((res)=>{
      setProducts(res.data)
    })
    .finally(()=>setLoading(false))
  }, []);

  const addProduct = (data) => {
   api.post("/products", data)
   .then((res)=>{
    setProducts((prev)=>[...prev, res.data])
   })
  };

  const updateProduct = (id, updatedData) => {
    api.patch(`/products/${id}`,updatedData)
    .then((res)=>setProducts((prev)=> prev.map((p)=>(
      p._id === id ? res.data :p)
    )
  ))
  };

  const updateStatus = (id, status)=>{
    api.patch(`/products/${id}`, {status})
    .then((res)=>{
      setProducts((prev)=>prev.map((p)=>(
        p._id === id ? res.data :p)
      ))
    })
  }

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    updateStatus
  };
}

export default useProduct;
