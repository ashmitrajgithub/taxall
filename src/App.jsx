import React from "react";
import Header from "./components/header/Header"; // Correct import
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import OurService from "./components/ourservices/OurService";
import Askme from "./components/askme/ChatBot";
import Products from "./components/products/Product";
import Review from "./components/review/Review";
import ContactUs from "./components/contactUs/ContactUs";
const App = () => {
  return (
    <div>
      <Header />
      <Home />
      <Askme />
      <OurService />
      <Products />
      <ContactUs />
      <Review />
      <Footer />
    </div>
  );
};

export default App;
