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
  FaTimes
} from "react-icons/fa";
import logo from "/assets/taxallnewww22n.png";
import IncomeTaxCalculator from "../incometaxcalculator/IncomeTaxCalculator";
import "./Header.css";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleDropdownToggle = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          {/* Logo container with unique id */}
          <h1 className="logo" id="logo">
            <img src={logo} alt="Brand Logo" className="logo-img" />
          </h1>
          <div className="menu-icon" onClick={toggleMobileMenu}>
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </div>
          <nav className={`nav ${mobileMenu ? "nav-active" : ""}`}>
            <ul className="nav-list">
              <li className="nav-item-container">
                <span className="nav-item" onClick={() => handleDropdownToggle("products")}>
                  <FaBox className="nav-icon" /> Products <FaChevronDown className="chevron-icon" />
                </span>
                {activeDropdown === "products" && (
                  <div className="dropdown">
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedComponent("IncomeTaxCalculator");
                        closeDropdown();
                      }}
                    >
                      <FaCalculator className="icon" /> Income Tax Calculator
                    </div>
                    <div className="dropdown-item" onClick={closeDropdown}>
                      <FaBalanceScale className="icon" /> Regulatory Compliance Hub
                    </div>
                  </div>
                )}
              </li>

              <li className="nav-item-container">
                <span className="nav-item" onClick={() => handleDropdownToggle("resources")}>
                  <FaBook className="nav-icon" /> Resources <FaChevronDown className="chevron-icon" />
                </span>
                {activeDropdown === "resources" && (
                  <div className="dropdown">
                    <div className="dropdown-item" onClick={closeDropdown}>
                      <FaBook className="icon" /> Blogs & Articles
                    </div>
                    <div className="dropdown-item" onClick={closeDropdown}>
                      <FaTag className="icon" /> Case Studies
                    </div>
                    <div className="dropdown-item" onClick={closeDropdown}>
                      <FaChartBar className="icon" /> Industry Insights
                    </div>
                  </div>
                )}
              </li>

              <li className="nav-item-container">
                <span className="nav-item" onClick={() => handleDropdownToggle("company")}>
                  <FaBuilding className="nav-icon" /> Company <FaChevronDown className="chevron-icon" />
                </span>
                {activeDropdown === "company" && (
                  <div className="dropdown">
                    <div className="dropdown-item" onClick={closeDropdown}>
                      <FaBuilding className="icon" /> About Us
                    </div>
                    <div className="dropdown-item" onClick={closeDropdown}>
                      <FaUsers className="icon" /> Careers
                    </div>
                    <div className="dropdown-item" onClick={closeDropdown}>
                      <FaTag className="icon" /> Contact
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>
          {/* Get Started button with a unique id; visible only on large screens */}
          <button className="get-started" id="get-started">Get Started</button>
        </div>
      </header>

      {/* Render selected component */}
      <div className="content-container">
        {selectedComponent === "IncomeTaxCalculator" && <IncomeTaxCalculator />}
      </div>
    </>
  );
};

export default Header;
