// Products.js
import React, { useState } from 'react';
import './Products.css'; // Import your custom CSS file
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaTimes } from 'react-icons/fa'; // Import the close icon
import IncomeTaxCalculator from '../incometaxcalculator/IncomeTaxCalculator'; // Adjust the path as needed

const Products = () => {
  // State to control the modal visibility
  const [showCalculator, setShowCalculator] = useState(false);

  // Function to open the modal
  const openCalculator = () => {
    setShowCalculator(true);
  };

  // Function to close the modal
  const closeCalculator = () => {
    setShowCalculator(false);
  };

  return (
    <div className="product-main">
      <div className="products-container flex flex-col items-center justify-center">
        {/* Main Heading */}
        <h1 className="products-heading">Our Products</h1>

        {/* Parent container for the product boxes */}
        <div className="parent-container grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Income Tax Calculator Box */}
          <div className="product-box">
            <div className="icon-container">
              <DotLottieReact
                src="https://lottie.host/d2355234-4f3b-4bc6-aacf-e5405e8c26bf/7AuAzli9Nf.lottie"
                loop
                autoplay
                className="icon"
              />
            </div>
            <h2 className="section-title">Income Tax Calculator</h2>
            <p className="section-description">
              Our Income Tax Calculator is designed to help you quickly and accurately estimate your taxes based on your income, deductions, and credits. Plan your finances confidently with our intuitive tool.
            </p>
            <button className="btn-calc" onClick={openCalculator}>
              Calculate Now
            </button>
          </div>
          <div className="product-box">
            <div className="icon-container">
              <DotLottieReact
                src="https://lottie.host/d2355234-4f3b-4bc6-aacf-e5405e8c26bf/7AuAzli9Nf.lottie"
                loop
                autoplay
                className="icon"
              />
            </div>
            <h2 className="section-title">Income Tax Calculator</h2>
            <p className="section-description">
              Our Income Tax Calculator is designed to help you quickly and accurately estimate your taxes based on your income, deductions, and credits. Plan your finances confidently with our intuitive tool.
            </p>
            <button className="btn-calc" onClick={openCalculator}>
              Calculate Now
            </button>
          </div>

          {/* Regulatory Compliance Hub Box */}
          <div className="product-box">
            <div className="icon-container">
              <DotLottieReact
                src="https://lottie.host/3b0131c9-dcad-4465-a612-b670f1423818/uZGvhYoZJs.lottie"
                loop
                autoplay
                className="icon"
              />
            </div>
            <h2 className="section-title">Regulatory Compliance Hub</h2>
            <p className="section-description">
              The Regulatory Compliance Hub is your one-stop resource for the latest regulatory updates, guidelines, and best practices. Stay informed and ensure compliance with ease by accessing critical resources here.
            </p>
            <button className="btn-view">View Now</button>
          </div>
        </div>
      </div>

      {/* Modal Overlay for Income Tax Calculator */}
      {showCalculator && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Close button using react-icon */}
            <button className="close-button" onClick={closeCalculator}>
              <FaTimes size={24} color="#333" />
            </button>
            <IncomeTaxCalculator />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;