import React, { useState } from "react";
import "./Header.css";
import { 
  FaBox, FaBook, FaBuilding, FaTag, FaUsers, 
  FaChartBar, FaChevronDown, FaCalculator, FaBalanceScale 
} from "react-icons/fa"; 
import logo from "/src/assets/logo10.png";
import IncomeTaxCalculator from "../incometaxcalculator/IncomeTaxCalculator";

const Header = () => {
  const [dropdown, setDropdown] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleMouseEnter = (menu) => {
    setDropdown(menu);
  };

  const handleMouseLeave = () => {
    setDropdown(null);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <h1 className="logo">
            <img src={logo} alt="Brand Logo" className="logo-img" />
          </h1>
          <nav className="nav">
            <ul className="nav-list center-nav">
              <div className="nav-item-container" 
                   onMouseEnter={() => handleMouseEnter("products")} 
                   onMouseLeave={handleMouseLeave}>
                <li className="nav-item">
                  <FaBox className="nav-icon" /> Products <FaChevronDown className="chevron-icon" />
                </li>
                {dropdown === "products" && (
                  <div className="dropdown">
                    <div className="dropdown-grid">
                      <div 
                        className="dropdown-item" 
                        onClick={() => setSelectedComponent("IncomeTaxCalculator")}
                      >
                        <FaCalculator className="icon" /> Income Tax Calculator
                      </div>
                      <div className="dropdown-item">
                        <FaBalanceScale className="icon" /> Regulatory Compliance Hub
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="nav-item-container" 
                   onMouseEnter={() => handleMouseEnter("resources")} 
                   onMouseLeave={handleMouseLeave}>
                <li className="nav-item">
                  <FaBook className="nav-icon" /> Resources <FaChevronDown className="chevron-icon" />
                </li>
                {dropdown === "resources" && (
                  <div className="dropdown">
                    <div className="dropdown-grid">
                      <div className="dropdown-item"><FaBook className="icon" /> Blogs & Articles</div>
                      <div className="dropdown-item"><FaTag className="icon" /> Case Studies</div>
                      <div className="dropdown-item"><FaChartBar className="icon" /> Industry Insights</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="nav-item-container" 
                   onMouseEnter={() => handleMouseEnter("company")} 
                   onMouseLeave={handleMouseLeave}>
                <li className="nav-item">
                  <FaBuilding className="nav-icon" /> Company <FaChevronDown className="chevron-icon" />
                </li>
                {dropdown === "company" && (
                  <div className="dropdown">
                    <div className="dropdown-grid">
                      <div className="dropdown-item"><FaBuilding className="icon" /> About Us</div>
                      <div className="dropdown-item"><FaUsers className="icon" /> Careers</div>
                      <div className="dropdown-item"><FaTag className="icon" /> Contact</div>
                    </div>
                  </div>
                )}
              </div>
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
