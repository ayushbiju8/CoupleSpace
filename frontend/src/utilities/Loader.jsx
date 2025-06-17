// components/Loader.jsx
import React from "react";
// import "./Loader.css";

const Loader = () => (
  <div className="w-full h-screen flex items-center justify-center flex-col z-50">
    <div className="spinner gap-2" />
    <div className="text-lg text-gray-700">Loading...</div>
  </div>
);

export default Loader;
 