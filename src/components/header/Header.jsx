import React, { useState } from "react";
import {
  FaBox,
  FaBook,
  FaBuilding,
  FaTag,
  FaUsers,
  FaChartBar,
  FaChevronDown,
  FaCalculator,
  FaBalanceScale,
  FaBars,
  FaTimes,
  FaFile,
} from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import logo from "/assets/taxallnewww22n.png";
import IncomeTaxCalculator from "../incometaxcalculator/IncomeTaxCalculator";
import Converter from "../converter/Converter"; // Import Converter
import "./Header.css";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false); // Modal state for Converter

  const handleMouseEnter = (menu) => setActiveDropdown(menu);
  const handleMouseLeave = () => setActiveDropdown(null);
  const toggleMobileMenu = () => setMobileMenu(!mobileMenu);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openConverter = () => setIsConverterOpen(true);
  const closeConverter = () => setIsConverterOpen(false);

  return (
    <>
      <header className="header">
        <div className="container">
          <h1 className="logo" id="logo" onClick={() => (window.location.href = "/")}>
            <img src={logo} alt="Brand Logo" className="logo-img" />
          </h1>
          <div className="menu-icon" onClick={toggleMobileMenu}>
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </div>
          <nav className={`nav ${mobileMenu ? "nav-active" : ""}`}>
            <ul className="nav-list">
              {/* Products Dropdown */}
              <li
                className="nav-item-container"
                onMouseEnter={() => handleMouseEnter("products")}
                onMouseLeave={handleMouseLeave}
              >
                <span className="nav-item">
                  <FaBox className="nav-icon" /> Products <FaChevronDown className="chevron-icon" />
                </span>
                {activeDropdown === "products" && (
                  <div className="dropdown">
                    <div className="dropdown-item" onClick={openModal}>
                      <FaCalculator className="icon" /> Income Tax Calculator
                    </div>
                    <div className="dropdown-item" onClick={openConverter}>
                      <FaFile className="icon" /> Taxall File Converter
                    </div>
                    <div className="dropdown-item">
                      <FaBalanceScale className="icon" /> Regulatory Compliance Hub
                    </div>
                  </div>
                )}
              </li>
              {/* Resources Dropdown */}
              <li
                className="nav-item-container"
                onMouseEnter={() => handleMouseEnter("resources")}
                onMouseLeave={handleMouseLeave}
              >
                <span className="nav-item">
                  <FaBook className="nav-icon" /> Resources <FaChevronDown className="chevron-icon" />
                </span>
                {activeDropdown === "resources" && (
                  <div className="dropdown">
                    <div className="dropdown-item">
                      <FaChartBar className="icon" /> Reports
                    </div>
                    <div className="dropdown-item">
                      <FaTag className="icon" /> Pricing Guide
                    </div>
                  </div>
                )}
              </li>
              {/* Company Dropdown */}
              <li
                className="nav-item-container"
                onMouseEnter={() => handleMouseEnter("company")}
                onMouseLeave={handleMouseLeave}
              >
                <span className="nav-item">
                  <FaBuilding className="nav-icon" /> Company <FaChevronDown className="chevron-icon" />
                </span>
                {activeDropdown === "company" && (
                  <div className="dropdown">
                    <div className="dropdown-item">
                      <FaUsers className="icon" /> About Us
                    </div>
                    <div className="dropdown-item">
                      <FaTag className="icon" /> Careers
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>
          <button className="get-started" id="get-started">
           Subscribe Us
          </button>
          <button className="sign-in-button">
            <FiLogIn className="sign-in-icon" /> Sign In / Sign Up
          </button>
        </div>
      </header>

      {/* Modal for Income Tax Calculator */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <IncomeTaxCalculator />
          </div>
        </div>
      )}

      {/* Modal for File Converter */}
      {isConverterOpen && (
        <div className="modal-overlay" onClick={closeConverter}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeConverter}>
              &times;
            </button>
            <Converter />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
