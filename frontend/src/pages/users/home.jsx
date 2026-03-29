import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import { api } from "../../api";
import Banner from "../../components/banner";
import PromoBanner from "../../components/promoBanner";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [category, setCategory] = useState("All");

  const [searchFood, setSearchFood] = useState("");
  const [sortOrderFood, setSortOrderFood] = useState("none");

  const [searchAcc, setSearchAcc] = useState("");
  const [sortOrderAcc, setSortOrderAcc] = useState("none");

  const [foodPage, setFoodPage] = useState(1);
  const [foodTotalPages, setFoodTotalPages] = useState(1);
  const [foodProducts, setFoodProducts] = useState([]);
  const [foodLoading, setFoodLoading] = useState(true);

  const [accPage, setAccPage] = useState(1);
  const [accTotalPages, setAccTotalPages] = useState(1);
  const [accessories, setAccessories] = useState([]);
  const [accLoading, setAccLoading] = useState(true);

  const skeletonCount = 4;

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setFoodLoading(true);

        const params = new URLSearchParams({
          type: "food",
          page: foodPage,
          limit: 4,
        });

        if (searchFood.trim()) params.set("search", searchFood.trim());
        if (category !== "All") params.set("category", category);
        if (sortOrderFood !== "none") params.set("sort", sortOrderFood);

        const res = await api.get(`/products?${params.toString()}`);
        setFoodProducts(Array.isArray(res?.data?.data) ? res.data.data : []);
        setFoodTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("FOOD ERROR:", err?.response || err);
        setFoodProducts([]);
      } finally {
        setFoodLoading(false);
      }
    };

    fetchFood();
  }, [foodPage, searchFood, category, sortOrderFood]);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setAccLoading(true);

        const params = new URLSearchParams({
          type: "accessories",
          page: accPage,
          limit: 4,
        });

        if (searchAcc.trim()) params.set("search", searchAcc.trim());
        if (sortOrderAcc !== "none") params.set("sort", sortOrderAcc);

        const res = await api.get(`/products?${params.toString()}`);
        setAccessories(Array.isArray(res?.data?.data) ? res.data.data : []);
        setAccTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("ACC ERROR:", err?.response || err);
        setAccessories([]);
      } finally {
        setAccLoading(false);
      }
    };

    fetchAccessories();
  }, [accPage, searchAcc, sortOrderAcc]);

  useEffect(() => {
    setFoodPage(1);
  }, [searchFood, category, sortOrderFood]);
  useEffect(() => {
    setAccPage(1);
  }, [searchAcc, sortOrderAcc]);

  return (
    <main>
      <Banner />
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

        <div className="scroll-container">
          <div className="row flex-nowrap">
            {foodLoading ? (
              Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  className="col-8 col-sm-6 col-md-4 col-lg-3 mb-4"
                  key={index}
                >
                  <div className="product-card p-3">
                    <div className="skeleton skeleton-image mb-3"></div>
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "60%" }}
                    ></div>
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
              ))
            ) : !Array.isArray(foodProducts) || foodProducts.length === 0 ? (
              <div className="col-12 text-center text-muted">
                No products found.
              </div>
            ) : (
              foodProducts.map((item) => (
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
              ))
            )}
          </div>
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              disabled={foodPage === 1}
              onClick={() => setFoodPage((prev) => prev - 1)}
              className="btn btn-light d-flex align-items-center justify-content-center"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: foodTotalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, foodPage - 3),
                Math.min(foodTotalPages, foodPage + 2),
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setFoodPage(page)}
                  className={`btn ${
                    foodPage === page ? "btn-dark" : "btn-outline-secondary"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              disabled={foodPage === foodTotalPages}
              onClick={() => setFoodPage((prev) => prev + 1)}
              className="btn btn-light d-flex align-items-center justify-content-center"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
      {/* Promo Banner */}
      <PromoBanner />

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
        <div className="scroll-container">
          <div className="row flex-nowrap">
            {accLoading ? (
              Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  className="col-8 col-sm-6 col-md-4 col-lg-3 mb-4"
                  key={index}
                >
                  <div className="product-card p-3">
                    <div className="skeleton skeleton-image mb-3"></div>
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "60%" }}
                    ></div>
                    <div
                      className="skeleton skeleton-text"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
              ))
            ) : !Array.isArray(accessories) || accessories.length === 0 ? (
              <div className="col-12 text-center text-muted">
                No accessories found.
              </div>
            ) : (
              accessories.map((item) => (
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
              ))
            )}
          </div>
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              disabled={accPage === 1}
              onClick={() => setAccPage((prev) => prev - 1)}
              className="btn btn-light d-flex align-items-center justify-content-center"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: accTotalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, accPage - 3),
                Math.min(accTotalPages, accPage + 2),
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setAccPage(page)}
                  className={`btn ${
                    accPage === page ? "btn-dark" : "btn-outline-secondary"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              disabled={accPage === accTotalPages}
              onClick={() => setAccPage((prev) => prev + 1)}
              className="btn btn-light d-flex align-items-center justify-content-center"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
