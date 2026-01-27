import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  useEffect(() => {
     if (!product) return;

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      setInCart(cart.some((item) => item._id === product._id));
      setInWishlist(wishlist.some((item) => item._id === product._id));
    
  }, [product]);

  if (!product) return <div className="text-center mt-5">Product not found</div>;

  const handleCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Login to Add Cart!");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex((item) => item._id === product._id);

    if (index !== -1) {
      cart[index].quantity += parseInt(quantity);
      toast.success(`Quantity updated to ${cart[index].quantity}`);
    } else {
      cart.push({
        ...product,
        quantity: parseInt(quantity),
        weight: product.weight || "Unknown",
      });
      toast.success("Added to cart!");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setInCart(true); 
  };

  const handleWishlist = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Login to Add wishlist!");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (inWishlist) {
      wishlist = wishlist.filter((item) => item._id !== product._id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.warn("Removed from wishlist");
      setInWishlist(false);
    } else {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success("Added to wishlist!");
      setInWishlist(true);
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
            Weight: {product.weight || "Not specified"}
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
              onChange={(e) => setQuantity(e.target.value)}
              className="form-control"
              style={{ width: "80px" }}
            />
          </div>

          <div className="d-flex flex-wrap gap-3 mt-3">
            <button className="btn btn-dark" onClick={handleCart}>
              {inCart ? "Add More" : "Add to Cart"}
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

export default ProductDetails;
