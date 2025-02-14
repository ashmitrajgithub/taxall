import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Askme from "./components/askme/ChatBot";
import Home from "./components/home/Home";
import OurService from "./components/ourservices/OurService";
import Products from "./components/products/Product";
import Review from "./components/review/Review";
import ContactUs from "./components/contactUs/ContactUs";
import Blog from "./components/blog/Blog";
import IncomeTaxCalculator from "./components/incometaxcalculator/IncomeTaxCalculator";

const App = () => {
  const location = useLocation(); // Get current location

  return (
    <div>
      <Header />
      <Askme />
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <OurService />
                <Products />
                <Blog />
                <ContactUs />
                <Review />
              </>
            }
          />
          <Route path="/incometaxcalculator" element={<IncomeTaxCalculator />} />
          <Route path="/products" element={<Products />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
