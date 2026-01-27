import React, { useState } from "react";
import useProduct from "./hooks/useProducts";
import { toast } from "react-toastify";

function AdminProduct() {
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    updateStatus
  } = useProduct();

  const [form, setForm] = useState({
    name: "",
    category: "",
    type:"",
    price: "",
    weight: "",
    image: "",
    description: "",
    status: "active",
  });
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      type:"",
      price: "",
      weight: "",
      image: "",
      description: "",
      status: "active",
    });
    setEditId(null);
  };

  const handleAddOrUpdate = () => {
    if (!form.name || !form.price || !form.image || !form.category || !form.type) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editId) {
      updateProduct(editId, form);
    } else {
      addProduct(form);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      type:item.type,
      price: item.price,
      weight: item.weight || "",
      image: item.image,
      description: item.description || "",
      status: item.status,
    });
    setEditId(item._id);
  };

  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((item) => item.category === filter);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-4">
  <div
    className="border rounded p-4"
    style={{ backgroundColor: "#f9f9f9" }}
  >
    <h2 className="text-center mb-4">Admin Product Management</h2>

    <div className="card p-3 mb-4 shadow-sm">
      <h4>{editId ? "Edit Product" : "Add New Product"}</h4>
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="form-control"
          />
        </div>
        <div className="col-12 col-md-3">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Category</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div className="col-md-3">
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Type</option>
              <option value="food">Food</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

        <div className="col-12 col-md-2">
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="form-control"
          />
        </div>
        <div className="col-12 col-md-3">
          <input
            type="text"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Weight"
            className="form-control"
          />
        </div>
        <div className="col-12 col-md-6">
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="form-control"
          />
        </div>
        <div className="col-12">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="form-control"
          ></textarea>
        </div>
        <div className="col-12 text-end">
          <button className="btn btn-success me-2" onClick={handleAddOrUpdate}>
            {editId ? "Update" : "Add"} Product
          </button>
          {editId && (
            <button className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>

    <div className="mb-3 d-flex flex-column flex-sm-row justify-content-between gap-2">
      <h5 className="mb-0">Products List</h5>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="form-select w-auto"
      >
        <option value="All">All</option>
        <option value="Dog">Dog</option>
        <option value="Cat">Cat</option>
        <option value="Accessories">Accessories</option>
      </select>
    </div>

    <div className="table-responsive">
      <table className="table table-bordered text-center align-middle table-hover shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Weight</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
           {filteredProducts?.filter(item => item && item._id).length > 0 ? (
    filteredProducts
      .filter(item => item && item._id)
      .map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    width="60"
                    className="img-fluid rounded"
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>₹{item.price}</td>
                <td>{item.weight || "-"}</td>
                <td>
                  <span
                    className={`badge ${
                      item.status === "inactive"
                        ? "bg-secondary"
                        : "bg-success"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                   <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    updateStatus(
                      item._id,
                      item.status === "active" ? "inactive" : "active"
                    )
                  }
                >
                  {item.status === "active" ? "Deactivate" : "Activate"}
                </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No products found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
}

export default AdminProduct;
