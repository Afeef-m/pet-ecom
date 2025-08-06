import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";


function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(wishlist);
  }, []);

  const removeFromWishlist = (index) => {
    const updated = [...wishlist];
    updated.splice(index, 1);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const already = cart.find((p) => p.id === item.id);
    if (!already) {
      cart.push({ ...item, quantity: 1,
        weight: item.weight || "Unknown", });
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Add to cart");
    } else {
      toast.warning("Item already in cart");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="alert alert-warning text-center">
          <p>Your wishlist is empty.</p>
    </div>
      ) : (
<div>
  {wishlist.map((item, index) => (
    <div key={index} className="card mb-3 shadow-sm">
      <div className="row g-0 align-items-center">
        <div className="col-md-2">
          <img
            src={item.image}
            className="img-fluid rounded-start"
            alt={item.name}
          />
        </div>

        <div className="col-md-7">
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            <p className="card-text">Price: ₹{item.price}</p>
            <p className="card-text text-muted">
              Weight: {item.weight || "Not specified"}
            </p>
            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => removeFromWishlist(index)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3 text-end pe-3 d-none d-md-block"></div>
      </div>
    </div>
  ))}
</div>

      )}
    </div>
  );
}

export default Wishlist;
