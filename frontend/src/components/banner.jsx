import React from 'react'

export default function Banner() {    
  return (
   <>
   <section className="hero-section d-flex align-items-center bg-beige">
        <div className="container d-flex flex-md-row align-items-center py-5">
          <div className="w-100 w-md-50 text-center">
              <img
                src="/images/home-slide-bg.png"
                alt="Pet Dog"
                className="img-fluid"
                style={{ maxHeight: "400px" }}
              />
          </div>

          <div className="w-100 w-md-50 text-center text-md-start px-md-5 mt-4 mt-md-0">
              <>
                <p className="text-uppercase text-muted small fw-semibold">
                  Save 10 - 20% Off
                </p>
                <h1 className="display-5 fw-bold">
                  Best Destination <br />
                  For <span className="highlight-text">Your Pets</span>
                </h1>
                <h3 className="lead mt-3 text-muted fw-normal hero-description">
                  Discover premium pet food and accessories...
                </h3>
              </>
          </div>
        </div>
      </section>
   </>
  )
}


