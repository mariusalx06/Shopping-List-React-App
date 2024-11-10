import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ToDoList from "./List";
import "./style.css";

function App() {
  return (
    <div>
      <Header />
      <ToDoList />
      <Footer />
    </div>
  );
}

export default App;
