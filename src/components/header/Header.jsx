import { useState, useEffect } from "react";
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
import { FiLogIn, FiUser } from "react-icons/fi";
import { RiScissorsLine } from "react-icons/ri"; // Imported scissors icon for “cut”
import { motion, AnimatePresence } from "framer-motion";
import logo from "/assets/taxallnewww22n.png";
import IncomeTaxCalculator from "../incometaxcalculator/IncomeTaxCalculator";
// import Converter from "../converter/Converter";
import Signin from "../signin/Signin";
import Subscription from "../subscription/Subscription";
import "./Header.css";
import axios from "axios";

const Header = () => {
  // Check authentication status inside the component
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  // State for dropdowns, modals, etc.
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  // State for responsiveness and user profile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user profile details (username) if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const email = localStorage.getItem("userEmail");
          const token = localStorage.getItem("token");
          if (!email || !token) return;
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          // First, get the user ID using the email
          const idResponse = await axios.get(
            `http://localhost:9090/userReq/user/id?email=${email}`,
            config
          );
          const userId = idResponse.data;
          // Then, fetch the user profile details using the retrieved ID
          const profileResponse = await axios.get(
            `http://localhost:9090/userReq/profile/${userId}`,
            config
          );
          const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
setUsername(`${cap(profileResponse.data.firstname)} ${cap(profileResponse.data.lastname)}`);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      fetchProfile();
    }
  }, [isAuthenticated]);

  // Reusable auth button markup: Profile if authenticated, Sign In otherwise
  const authButton = isAuthenticated ? (
    <button
      className={`profile-button ${isMobile ? "mobile-profile" : "desktop-only"}`}
      onClick={() => (window.location.href = "/profile")}
    >
      <FiUser className="profile-icon" />
      <span className="profile-text">{username || "Profile"}</span>
    </button>
  ) : (
    <button
      className={`sign-in-button ${isMobile ? "mobile-sign-in" : "desktop-only"}`}
      onClick={() => setIsSigninOpen(!isSigninOpen)}
    >
      <FiLogIn className="sign-in-icon" /> Sign In
    </button>
  );

  // Other handlers
  const handleMouseEnter = (menu) => setActiveDropdown(menu);
  const handleMouseLeave = () => setActiveDropdown(null);
  const toggleMobileMenu = () => setMobileMenu(!mobileMenu);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openConverter = () => setIsConverterOpen(true);
  const closeConverter = () => setIsConverterOpen(false);
  const toggleSubscription = () => setIsSubscriptionOpen(!isSubscriptionOpen);

  return (
    <>
      <header className="header">
        <div className="container">
          <h1 className="logo" id="logo" onClick={() => (window.location.href = "/")}>
            <img src={logo || "/placeholder.svg"} alt="Brand Logo" className="logo-img" />
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
              {/* Render auth button inside navigation only for mobile */}
              {isMobile && <li className="nav-item auth-nav-item">{authButton}</li>}
            </ul>
          </nav>
          <div className="header-buttons">
            <button className="get-started" id="get-started" onClick={toggleSubscription}>
              Subscribe Us
            </button>
            {/* Render auth button in header (right side) only for desktop */}
            {!isMobile && authButton}
          </div>
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
            {/* Uncomment and implement Converter if needed */}
            {/* <Converter /> */}
          </div>
        </div>
      )}

      {/* Signin Popup */}
      <AnimatePresence>
        {isSigninOpen && (
          <motion.div
            className="header-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSigninOpen(!isSigninOpen)}
          >
            <motion.div
              className="header-modal-content header-signin-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="header-close-button"
                onClick={() => setIsSigninOpen(!isSigninOpen)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ rotate: 90 }}
              >
                <RiScissorsLine className="cut-icon" />
              </motion.button>
              <Signin />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscription Popup */}
      <AnimatePresence>
        {isSubscriptionOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSubscription}
          >
            <motion.div
              className="modal-content subscription-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="close-button"
                onClick={toggleSubscription}
                whileHover={{ scale: 1.2 }}
                whileTap={{ rotate: 90 }}
              >
                <RiScissorsLine className="cut-icon" />
              </motion.button>
              <Subscription />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
