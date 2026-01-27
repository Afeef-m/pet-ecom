import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
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
    const already = cart.find((p) => p._id === item._id);
    if (!already) {
      cart.push({ ...item, quantity: 1, weight: item.weight || "Unknown" });
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Add to cart");
    } else {
      toast.warning("Item already in cart");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">
        <FaHeart /> Your Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <div className="alert alert-warning text-center">
          Your wishlist is empty
        </div>
      ) : (
        <>
          {wishlist.map((item, index) => (
            <div key={index} className="card mb-4 shadow-sm border-0">
              <div className="row g-0 align-items-center">
               
                <div className="col-md-2 text-center">
                  <img
                    src={item.image}
                    className="img-fluid rounded-start p-2"
                    alt={item.name}
                    style={{ maxHeight: "100px" }}
                  />
                </div>

                
                <div className="col-md-7">
                  <div className="card-body">
                    <h5 className="card-title mb-1">{item.name}</h5>
                    <p className="mb-1">Price: ₹{item.price}</p>
                    <p className="text-muted mb-2">
                      Weight: {item.weight || "Not specified"}
                    </p>
                  </div>
                </div>

               
                <div className="col-md-3 d-flex flex-column justify-content-center align-items-md-end align-items-center gap-2 pe-4">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromWishlist(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Wishlist;
