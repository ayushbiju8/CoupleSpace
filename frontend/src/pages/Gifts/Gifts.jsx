import React from "react";
import "./Gifts.css";
// import FIM from "../../assets/Gifts/FIM.jpg";

// Import all images
import image1 from "../../assets/DefaultProfilePicture.jpg";
import image2 from "../../assets/CoupleSpace/Chat.jpeg";
import image3 from "../../assets/CoupleSpace/wishlist.jpeg";
// import image3 from "../../assets/Gifts/Img3.webp";


// Import default fallback image
import defaultImage from "../../assets/CoupleSpace/chat.jpeg";

// Define products with correct image references
const productsRow1 = [
  { id: 1, name: "Miniature Cute Romantic Couple", category: "Gift", price: "₹278", oldPrice: "₹799", image: image1 },
  { id: 2, name: " Dairy Milk Silk Special Valentine's Gift Basket ", category: "Gift", price: "₹650", oldPrice: "₹1000", image: image2 },
  // { id: 4, name: "Yellow Reserved Hoodie", category: "Dress", price: "$155.00", oldPrice: "$204.00", image: image4 },
  // { id: 5, name: "Basic Dress Green", category: "Dress", price: "$226.00", image: image5 },
  // { id: 6, name: "Romantic Couple Necklace", category: "Accessory", price: "$45.00", image: image6 },
  // { id: 7, name: "Personalized Love Book", category: "Gift", price: "$39.99", image: image7 }
];

const productsRow2 = [
 { id: 8, name: "Handcrafted Bride Kissing Groom Romantic Couple Statue Decorative Showpiece", category: "Gift", price: "₹137", oldPrice: "₹999", image: image3 },
  // { id: 9, name: "Nike Repel Miler", category: "Jacket", price: "$128.50", image: image9 },
  // { id: 10, name: "Leather Handbag", category: "Bag", price: "$95.00", image: image10 },
  // { id: 11, name: "Elegant Wristwatch", category: "Accessory", price: "$250.00", image: image11 },
  // { id: 12, name: "Matching Couple Hoodies", category: "Dress", price: "$120.00", image: image12 },
  // { id: 13, name: "Heart-Shaped Photo Frame", category: "Gift", price: "$30.00", image: image13 },
  // { id: 14, name: "Couple's Bracelet Set", category: "Jewelry", price: "$55.00", image: image14 }
];

const ProductGallery = () => {
  const scroll = (direction, rowId) => {
    const container = document.getElementById(rowId);
    if (!container) return;

    if (direction === "left") {
      container.scrollLeft -= 300;
    } else {
      container.scrollLeft += 300;
    }
  };

  return (
    <div className="gallery-wrapper">
      {/* Header with image */}
      <header className="header">
        <h1>Perfect Gifts for Your Partner 💝</h1>
      </header>

      <div className="product-container-wrapper">
        <button className="scroll-buttons" onClick={() => scroll("left", "row1")}>&lt;</button>
        <div className="product-container" id="row1">
          {productsRow1.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={product.image || defaultImage}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null; // Prevents infinite loop if default image also fails
                  e.target.src = defaultImage;
                }}
              />
              <h3>{product.name}</h3>
              <p>{product.category}</p>
              <p className="price">
                {product.oldPrice ? <span className="old-price">{product.oldPrice}</span> : null} {product.price}
              </p>
            </div>
          ))}
        </div>
        <button className="scroll-buttons" onClick={() => scroll("right", "row1")}>&gt;</button>
      </div>

      <div className="product-container-wrapper">
        <button className="scroll-buttons" onClick={() => scroll("left", "row2")}>&lt;</button>
        <div className="product-container" id="row2">
          {productsRow2.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={product.image || defaultImage}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null; // Prevents infinite loop if default image also fails
                  e.target.src = defaultImage;
                }}
              />
              <h3>{product.name}</h3>
              <p>{product.category}</p>
              <p className="price">
                {product.oldPrice ? <span className="old-price">{product.oldPrice}</span> : null} {product.price}
              </p>
            </div>
          ))}
        </div>
        <button className="scroll-buttons" onClick={() => scroll("right", "row2")}>&gt;</button>
      </div>

      {/* Footer with image */}
      {/* <footer className="footer">
        <img src={FIM} alt="Love & Romance" />
      </footer> */}
    </div>
  );
};

export default ProductGallery;