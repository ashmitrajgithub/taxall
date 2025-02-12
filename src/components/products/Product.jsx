import React, { useEffect, useState } from 'react';
import './Products.css'; // Import your custom CSS file
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaTimes } from 'react-icons/fa'; // Import the close icon
import IncomeTaxCalculator from '../incometaxcalculator/IncomeTaxCalculator'; // Adjust the path as needed
import Converter from '../converter/Converter'; // Adjust the path as needed
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS styles

const Products = () => {
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: false }); // Initialize AOS
  }, []);

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div className="product-main">
      <div className="products-container flex flex-col items-center justify-center">
        <h1 className="products-heading" data-aos="fade-down">Our Products</h1>

        <div className="parent-container grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="product-box" data-aos="fade-up">
            <div className="icon-container">
              <DotLottieReact
                src="https://lottie.host/d2355234-4f3b-4bc6-aacf-e5405e8c26bf/7AuAzli9Nf.lottie"
                loop
                autoplay
                className="icon"
              />
            </div>
            <h2 className="section-title1">Income Tax Calculator</h2>
            <p className="section-description">
              Our Income Tax Calculator is designed to help you quickly and accurately estimate your taxes based on your income, deductions, and credits. Plan your finances confidently with our intuitive tool.
            </p>
            <button className="btn-calc" onClick={() => openModal('calculator')}>
              Calculate Now
            </button>
          </div>

          <div className="product-box" data-aos="fade-up" data-aos-delay="200">
            <div className="icon-container">
              <DotLottieReact
                src="https://lottie.host/e87388ea-7e59-4cfc-b6e5-8a1d0bd33207/GVN8oyZtuc.lottie"
                loop
                autoplay
                className="icon"
              />
            </div>
            <h2 className="section-title1">Taxall File Converter</h2>
            <p className="section-description">
              Taxall File Converter is a professional online tool enabling secure conversion of diverse file formats. Optimize your documents effortlessly with intelligent scaling, quality control, and a sleek, intuitive user interface.
            </p>
            <button className="btn-calc" onClick={() => openModal('converter')}>
              Convert Now
            </button>
          </div>

          <div className="product-box" data-aos="fade-up" data-aos-delay="400">
            <div className="icon-container">
              <DotLottieReact
                src="https://lottie.host/3b0131c9-dcad-4465-a612-b670f1423818/uZGvhYoZJs.lottie"
                loop
                autoplay
                className="icon"
              />
            </div>
            <h2 className="section-title1">Regulatory Compliance Hub</h2>
            <p className="section-description">
              The Regulatory Compliance Hub is your one-stop resource for the latest regulatory updates, guidelines, and best practices. Stay informed and ensure compliance with ease by accessing critical resources here.
            </p>
            <button className="btn-view">View Now</button>
          </div>
        </div>
      </div>

      {modalType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              <FaTimes size={24} color="#333" />
            </button>
            {modalType === 'calculator' && <IncomeTaxCalculator />}
            {modalType === 'converter' && <Converter />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
