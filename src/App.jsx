import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
import Conversion from "./components/conversion/Conversion";
import "./App.css";

const App = () => {
  const location = useLocation(); // Get current page location

  // Dynamic SEO Metadata
  const getPageSEO = () => {
    switch (location.pathname) {
      case "/":
        return {
          title: "Taxall - Tax & Finance Solutions",
          description: "Expert tax and finance solutions tailored for individuals and businesses.",
          url: "https://taxall.co.in/",
        };
      case "/incometaxcalculator":
        return {
          title: "Income Tax Calculator - Taxall",
          description: "Calculate your income tax easily with our free online income tax calculator.",
          url: "https://taxall.co.in/incometaxcalculator",
        };
      case "/fileconverter":
        return {
          title: "File Converter - Taxall",
          description: "Convert files to different formats with our online file converter.",
          url: "https://taxall.co.in/fileconverter",
        };
      case "/contactus":
        return {
          title: "Contact Us - Taxall",
          description: "Get in touch with Taxall for expert tax and finance solutions.",
          url: "https://taxall.co.in/contactus",
        };
      default:
        return {
          title: "Taxall - Tax & Finance Solutions",
          description: "Expert tax and finance solutions tailored for individuals and businesses.",
          url: "https://taxall.co.in/",
        };
    }
  };

  const { title, description, url } = getPageSEO();

  return (
    <div>
      {/* Dynamic SEO */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        {/* Open Graph (Facebook) */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://taxall.co.in/assets/taxall-logo.png" />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://taxall.co.in/assets/taxall-logo.png" />
      </Helmet>

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
          <Route path="/fileconverter" element={<Conversion />} />
          <Route path="/contactus" element={<ContactUs />} />
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
