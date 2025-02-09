import React from "react";
import Header from "./components/header/Header"; // Correct import
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import OurService from "./components/ourservices/OurService";
const App = () => {
  return (
    <div>
      <Header />
      <Home />
      <OurService />
      <Footer />
    </div>
  );
};

export default App;
