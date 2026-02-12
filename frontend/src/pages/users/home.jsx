import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./home.css";
import { api } from "../../api";
import { Loader2Icon } from "lucide-react";

function Home() {
  const [products, setProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [category, setCategory] = useState("All");

  const [searchFood, setSearchFood] = useState("");
  const [sortOrderFood, setSortOrderFood] = useState("none");

  const [searchAcc, setSearchAcc] = useState("");
  const [sortOrderAcc, setSortOrderAcc] = useState("none");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [productsRes, accessoriesRes] = await Promise.all([
          api.get(`/products?type=food`),
          api.get(`/products?type=accessories`)
        ]);
        const uniqueProducts = Array.from(new Map(productsRes.data.map((item) => [item._id, item])).values());
        const uniqueAccessories = Array.from(new Map(accessoriesRes.data.map((item) => [item._id, item])).values());

        setProducts(uniqueProducts);
        setAccessories(uniqueAccessories);
      } catch {
        toast.error("Failed to fetch products/accessories");
      }finally{
        setLoading(false)
      }
    };

    fetchData();
  }, []);


  const filterProducts =
    category === "All"
      ? products
      : products.filter((item) => item.category === category);

  const searchProducts = filterProducts.filter((item) =>
    item.name.toLowerCase().includes(searchFood.toLowerCase())
  );

  const sortedProducts = [...searchProducts].sort((a, b) => {
    if (sortOrderFood === "lowToHigh") return a.price - b.price;
    if (sortOrderFood === "highToLow") return b.price - a.price;
    return 0;
  });

  const searchAccessories = accessories.filter((item) =>
    item.name.toLowerCase().includes(searchAcc.toLowerCase())
  );

  const sortedAccessories = [...searchAccessories].sort((a, b) => {
    if (sortOrderAcc === "lowToHigh") return a.price - b.price;
    if (sortOrderAcc === "highToLow") return b.price - a.price;
    return 0;
  });

if (loading) {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center text-secondary gap-2">
      <div className="spinner-border" role="status" style={{ width: "1.5rem", height: "1.5rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <span>Loading Dashboard...</span>
    </div>
  );
}


  return (
    <div className="home-page">
      <section className="hero-section d-flex align-items-center bg-beige">
        <div className="container d-flex flex-column flex-md-row align-items-center py-5">
          <div className="w-100 w-md-50 text-center">
            <img
              src="/images/home-slide-bg.png"
              alt="Pet Dog"
              className="img-fluid"
              style={{ maxHeight: "400px" }}
            />
          </div>
          <div className="w-100 w-md-50 text-center text-md-start px-md-5 mt-4 mt-md-0">
            <p className="text-uppercase text-muted small fw-semibold">
              Save 10 - 20% Off
            </p>
            <h1 className="display-5 fw-bold">
              Best Destination <br /> For{" "}
              <span className="highlight-text">Your Pets</span>
            </h1>
            <h3 className="lead mt-3 text-muted fw-normal hero-description">
              Discover premium pet food and accessories for your beloved pets.
              Up to 20% off with fast delivery!
            </h3>
          </div>
        </div>
      </section>

      <div className="mini-navbar text-center py-3">
        <div className="category-nav mt-2">
          {["All", "Cat", "Dog"].map((cat) => (
            <span
              key={cat}
              className={`category-item ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <section className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search pet food..."
            style={{ maxWidth: "300px", borderRadius: "15px" }}
            value={searchFood}
            onChange={(e) => setSearchFood(e.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: "200px" }}
            value={sortOrderFood}
            onChange={(e) => setSortOrderFood(e.target.value)}
          >
            <option value="none">Filter</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>

        <h3 className="section-title">Pet Food</h3>
        {sortedProducts.length === 0 ? (
          <p className="text-center text-muted">No products found.</p>
        ) : (
          <div className="scroll-container">
            <div className="row flex-nowrap">
              {sortedProducts.map((item) => (
                <div
                  className="col-8 col-sm-6 col-md-4 col-lg-3 mb-4"
                  key={item._id}
                >
                  <div className="product-card p-3">
                    <Link
                      to={`/product/${item._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-image mb-3"
                      />
                      <hr />
                      <h6 className="product-title">{item.name}</h6>
                      <p className="product-price">₹{item.price}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <div className="banner-section container my-4">
        <img
          src="/images/whiskas-slide.jpg"
          alt="whiskas banner"
          className="img-fluid rounded promo-img shadow-sm"
        />
      </div>

      {/* Accessories Section */}
      <section className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search accessories..."
            style={{ maxWidth: "300px", borderRadius: "15px" }}
            value={searchAcc}
            onChange={(e) => setSearchAcc(e.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: "200px" }}
            value={sortOrderAcc}
            onChange={(e) => setSortOrderAcc(e.target.value)}
          >
            <option value="none">Filter</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>

        <h3 className="section-title">Accessories</h3>
        {sortedAccessories.length === 0 ? (
          <p className="text-center text-muted">No accessories found.</p>
        ) : (
          <div className="scroll-container">
            <div className="row flex-nowrap">
              {sortedAccessories.map((item) => (
                <div
                  className="col-8 col-sm-6 col-md-4 col-lg-3 mb-4"
                  key={item._id}
                >
                  <div className="product-card p-3">
                    <Link
                      to={`/accessory/${item._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-image mb-3"
                      />
                      <hr />
                      <h6 className="product-title">{item.name}</h6>
                      <p className="product-price">₹{item.price}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center mt-5 pb-3">
        <div className="footer-line mx-auto mb-2"></div>

        <p className="text-muted">
          © {new Date().getFullYear()} Pet Plus. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
