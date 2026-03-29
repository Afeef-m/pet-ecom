import React from 'react'

export default function Footer() {
  return (
    <>
      <style>
        {`
          .footer-line {
            width: 90%;
            height: 2px;
            background-color: #aaa;
          }
        `}
      </style>

      <footer className="text-center mt-5 pb-3">
        <div className="footer-line mx-auto mb-2"></div>

        <p className="text-muted">
          © {new Date().getFullYear()} Pet Plus. All rights reserved.
        </p>
      </footer>
    </>
  )
}