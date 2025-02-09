import React, { useState } from "react";
import {
  FaBox, FaBook, FaBuilding, FaTag, FaUsers,
  FaChartBar, FaChevronDown, FaCalculator, FaBalanceScale, FaBars, FaTimes
} from "react-icons/fa";
import logo from "/src/assets/taxallnewww22n.png";
import IncomeTaxCalculator from "../incometaxcalculator/IncomeTaxCalculator";
import "./Header.css";

const Header = () => {
  const [dropdown, setDropdown] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleDropdownToggle = (menu) => {
    setDropdown(dropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => setMobileMenu(!mobileMenu);

  return (
    <>
      <header className="header">
        <div className="container">
          <h1 className="logo">
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
                {dropdown === "products" && (
                  <div className="dropdown">
                    <div className="dropdown-item" onClick={() => setSelectedComponent("IncomeTaxCalculator")}>
                      <FaCalculator className="icon" /> Income Tax Calculator
                    </div>
                    <div className="dropdown-item">
                      <FaBalanceScale className="icon" /> Regulatory Compliance Hub
                    </div>
                  </div>
                )}
              </li>

              <li className="nav-item-container">
                <span className="nav-item" onClick={() => handleDropdownToggle("resources")}>
                  <FaBook className="nav-icon" /> Resources <FaChevronDown className="chevron-icon" />
                </span>
                {dropdown === "resources" && (
                  <div className="dropdown">
                    <div className="dropdown-item"><FaBook className="icon" /> Blogs & Articles</div>
                    <div className="dropdown-item"><FaTag className="icon" /> Case Studies</div>
                    <div className="dropdown-item"><FaChartBar className="icon" /> Industry Insights</div>
                  </div>
                )}
              </li>

              <li className="nav-item-container">
                <span className="nav-item" onClick={() => handleDropdownToggle("company")}>
                  <FaBuilding className="nav-icon" /> Company <FaChevronDown className="chevron-icon" />
                </span>
                {dropdown === "company" && (
                  <div className="dropdown">
                    <div className="dropdown-item"><FaBuilding className="icon" /> About Us</div>
                    <div className="dropdown-item"><FaUsers className="icon" /> Careers</div>
                    <div className="dropdown-item"><FaTag className="icon" /> Contact</div>
                  </div>
                )}
              </li>
            </ul>
          </nav>
          <button className="get-started">Get Started</button>
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
