import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data?.data || res.data))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) return <div className="text-center mt-5">Product not found</div>;

const handleCart = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.warning("Login to Add Cart!");
    return;
  }

  const qty = Number(quantity);

  if (!qty || qty <= 0) {
    toast.warning("Enter valid quantity");
    return;
  }

  try {
    await api.post("/cart/add", {
      productId: product._id,
      quantity: qty,
    });
setLoading(true);
    toast.success("Added to cart!");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to add to cart");
    setLoading(false);
  }
};

  const handleWishlist = async () => {
    const token = localStorage.getItem("token");

  if (!token) {
    toast.warning("Login to Add whishlist!");
    return;
  }

  try {
      await api.post("/wishlist/add", {
      productId: product._id,
    });

    toast.success("Added to wishlist!");
    setInWishlist(true);

  } catch (err) {
    console.error(err);
    toast.error("Failed to add to wishlist");
  }
  };

  const handleBuyNow = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Login to Buy");
      return;
    }
    navigate("/checkout", {
      state: {
        from: "buyNow",
        cart: [{ ...product, quantity: Number(quantity) }],
      },
    });
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6 text-center mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "350px" }}
          />
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted">Category: {product.category}</p>
          <p className="text-muted">
            Weight: {product.weight?.value 
  ? `${product.weight.value}${product.weight.unit}` 
  : "Not specified"}
          </p>

          <p
            className="mt-3"
            style={{
              fontsize: "1.1rem",
              color: "#555",
              lineHeight: "1.6",
            }}
          >
            {product.description || "No description available."}
          </p>

          <h4 className="text-success">₹{product.price}</h4>

          <div className="d-flex align-items-center my-3">
            <label className="me-2 fw-bold">Qty:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-control"
              style={{ width: "80px" }}
            />
          </div>

          <div className="d-flex flex-wrap gap-3 mt-3">
           <button className="btn btn-dark" onClick={handleCart}>
  Add to Cart
</button>

            <button
              className={`btn ${inWishlist ? "btn-danger text-white" : "btn-outline-danger"
                }`}
              onClick={handleWishlist}
            >
              {inWishlist ? "♥" : "♡"}
            </button>

            <button className="btn btn-success" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


