import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storeCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = storeCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(updatedCart);
  }, []);

  const updateQuantity = (index, change) => {
    const updated = [...cartItems];
    updated[index].quantity = Math.max(1, updated[index].quantity + change);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeFromCart = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.warn("Item removed from cart");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleBuy = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Please login to place order");
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    navigate("/checkout", {
      state: {
        cart: cartItems,
        total,
      },
    });
  };

  return (
   <div className="container my-5">
  <h2 className="mb-4 fw-bold"><FaShoppingCart/> Your Cart</h2>

  {cartItems.length === 0 ? (
    <div className="alert alert-warning text-center">
      Your cart is empty 
    </div>
  ) : (
    <>
      {cartItems.map((item, index) => (
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

    {/* Product Info */}
    <div className="col-md-7">
      <div className="card-body">
        <h5 className="card-title mb-1">{item.name}</h5>
        <p className="mb-1">Price: ₹{item.price}</p>
        <p className="text-muted mb-2">
          Weight: {item.weight || "Unknown"}
        </p>

        {/* Quantity Controls */}
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => updateQuantity(index, -1)}
          >
            −
          </button>
          <span className="fw-bold">{item.quantity}</span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => updateQuantity(index, 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>

    {/* Remove Button - Center aligned vertically */}
    <div className="col-md-3 d-flex justify-content-md-end justify-content-center align-items-center pe-4">
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={() => removeFromCart(index)}
      >
        Remove
      </button>
    </div>
  </div>
</div>

      ))}

      <div className="text-end">
        <h4 className="fw-bold">Total: ₹{total.toLocaleString()}</h4>
        <button className="btn btn-success px-4 mt-2" onClick={handleBuy}>
          Proceed to Checkout
        </button>
      </div>
    </>
  )}
</div>

  );
}

export default Cart;
