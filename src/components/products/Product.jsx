import React from 'react';
import './Products.css'; // Import the custom CSS file
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Products = () => {
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
              Our Income Tax Calculator is designed to help you quickly and accurately estimate your taxes based on your income, deductions, and credits. Plan your finances confidently with our intuitive toofinances confidently with our intuitive toofinances confidently.
            </p>
            <button className="btn-calc">Calculate Now</button>
          </div>

          {/* Regulatory Compliance Hub Box */}
          <div className="product-box">
            <div className="icon-container">
            <DotLottieReact
                src="https://lottie.host/19cdecac-5a56-4740-82f2-da17dd11583e/yzH8852Zij.lottie"
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
    </div>
  );
};

export default Products;
