import React from "react";
import Header from "./components/header/Header"; // Correct import

const App = () => {
  return (
    <div>
      <Header />
      <main className="p-4">
        <h2>Welcome to our website!</h2>
        <p>Explore our products and resources.</p>
      </main>
    </div>
  );
};

export default App;
