import React from "react";
import Header from "./components/header/Header"; // Correct import
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
const App = () => {
  return (
    <div>
      <Header />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
