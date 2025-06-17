import React, { useState } from "react";
import "./Gifts.css";

import image1 from "../../assets/Gifts/img1.jpg";
import image2 from "../../assets/Gifts/img2.jpg";
import image3 from "../../assets/Gifts/img3.jpg";
import image4 from "../../assets/Gifts/img4.jpg";
import image5 from "../../assets/Gifts/img5.jpg";
import image6 from "../../assets/Gifts/img6.jpg";
import image7 from "../../assets/Gifts/img7.webp"; // changed from .webp to .jpg
import image8 from "../../assets/Gifts/img8.jpg";
import image9 from "../../assets/Gifts/img9.jpg";
import image10 from "../../assets/Gifts/img10.jpg";
import image11 from "../../assets/Gifts/img11.jpg";
import image12 from "../../assets/Gifts/img12.jpg";
import image13 from "../../assets/Gifts/img13.jpg";
import image14 from "../../assets/Gifts/img14.jpg";
import image15 from "../../assets/Gifts/img15.jpg";
import image16 from "../../assets/Gifts/img16.jpg";
import image17 from "../../assets/Gifts/img17.jpg";
import image18 from "../../assets/Gifts/img18.jpg";
import image19 from "../../assets/Gifts/img19.jpg";
import image20 from "../../assets/Gifts/img20.jpg";
import image21 from "../../assets/Gifts/img21.jpg";
import image22 from "../../assets/Gifts/img22.jpg";
import image23 from "../../assets/Gifts/img23.jpg";
import image24 from "../../assets/Gifts/img24.jpg";
import image25 from "../../assets/Gifts/img25.jpg";
import image26 from "../../assets/Gifts/img26.jpg";


const allProducts = [
  {
    id: 1,
    name: "Nilu's Collection 925 Sterling Silver Plated Adjustable Couple Ring",
    category: "Jewelry",
    price: "₹292",
    oldPrice: "₹1295",
    image: image1,
    link: "https://amzn.to/3FzvcUH",
  },
  {
    id: 2,
    name: "AQUASTREET Reversible Heart Pendant Necklace",
    category: "Jewelry",
    price: "₹699",
    oldPrice: "₹1299",
    image: image2,
    link: "https://amzn.to/4klHMGl",
  },
  {
    id: 3,
    name: "HighSpark 925 Silver Stylish Love Knot Heart Pendant",
    category: "Jewelry",
    price: "₹1799",
    oldPrice: "₹4997",
    image: image3,
    link: "https://amzn.to/3Z6ktYw",
  },
  {
    id: 4,
    name: "Artistic Gifts Customized 3D LED Heart Lamp",
    category: "Home Decor",
    price: "₹959",
    oldPrice: "₹1799",
    image: image4,
    link: "https://amzn.to/4klTQaD",
  },
  {
    id: 5,
    name: "eCraftIndia Romantic Couple Statue Showpiece",
    category: "Home Decor",
    price: "₹379",
    oldPrice: "₹799",
    image: image5,
    link: "https://amzn.to/43p0jLR",
  },
  {
    id: 6,
    name: "Chocoloony Chocolate Basket Gift Hamper (20 pcs)",
    category: "Food",
    price: "₹298",
    oldPrice: "₹699",
    image: image6,
    link: "https://amzn.to/3Hj6atw",
  },
  {
    id: 7,
    name: "SMOOR Premium Celebration Chocolate Box (300g)",
    category: "Food",
    price: "₹664",
    oldPrice: "₹749",
    image: image7,
    link: "https://amzn.to/3Hjbq0h",
  },
  {
    id: 8,
    name: "TIED RIBBONS Preserved Red Rose Gift Box (Silver Necklace)",
    category: "Gift",
    price: "₹2899",
    oldPrice: "₹599",
    image: image8,
    link: "https://amzn.to/3Hj6kkC",
  },
  {
    id: 9,
    name: "HighSpark 925 Silver Solitaire Heart Pendant with Chain",
    category: "Jewelry",
    price: "₹1499",
    oldPrice: "₹3497",
    image: image9,
    link: "https://amzn.to/446GUzp",
  },
  {
    id: 10,
    name: "GRECIILOOKS Textured Oversized Cotton T-Shirt for Men",
    category: "Clothing",
    price: "₹399",
    oldPrice: "₹1999",
    image: image10,
    link: "https://amzn.to/45Jvent",
  },
  {
    id: 11,
    name: "Fastrack Analog Black Dial Women's Casual Watch",
    category: "Watch",
    price: "₹1295",
    oldPrice: "₹1995",
    image: image11,
    link: "https://amzn.to/4kA8zPf",
  },
  {
    id: 12,
    name: "GUESS Analog Pink Dial Watch with White Band",
    category: "Watch",
    price: "₹7996",
    oldPrice: "₹9995",
    image: image12,
    link: "https://amzn.to/45NI0kW",
  },
  {
    id: 13,
    name: "Daniel Klein Analog Rose Gold Dial Women's Watch",
    category: "Watch",
    price: "Currently not in stock",
    oldPrice: "₹---",
    image: image13,
    link: "https://amzn.to/43TfrQI",
  },
  {
    id: 14,
    name: "Carlton London Brixton Women Gift Set (Watch + Bracelet)",
    category: "Watch",
    price: "₹4300",
    oldPrice: "₹6790",
    image: image14,
    link: "https://amzn.to/3ZlJwH9",
  },
  {
    id: 15,
    name: "RIZIK STORE® Metal Abstract Deer Wall Art (Pack of 3)",
    category: "Home Decor",
    price: "₹999",
    oldPrice: "₹2999",
    image: image15,
    link: "https://amzn.to/3HqYtBF",
  },
  {
    id: 16,
    name: "Dekorly Artificial Potted Plants (8 Pack)",
    category: "Home Decor",
    price: "₹288",
    oldPrice: "₹999",
    image: image16,
    link: "https://amzn.to/4dU5qqZ",
  },
  {
    id: 17,
    name: "Ancient Shoppee Wooden Glass Tube Planter",
    category: "Home Decor",
    price: "₹139",
    oldPrice: "₹299",
    image: image17,
    link: "https://amzn.to/4kAqrJM",
  },
  {
    id: 18,
    name: "GLUN Magic 3D LED Night Lamp with Sensor",
    category: "Home Decor",
    price: "₹118",
    oldPrice: "₹599",
    image: image18,
    link: "https://amzn.to/3ZowEjs",
  },
  {
    id: 19,
    name: "Webelkart Premium Wooden Key Holder (7 Hook)",
    category: "Home Decor",
    price: "₹189",
    oldPrice: "₹999",
    image: image19,
    link: "https://amzn.to/445Rqa9",
  },
  {
    id: 20,
    name: "Urbano Fashion Baggy Fit Panelled Jeans for Men",
    category: "Clothing",
    price: "₹999",
    oldPrice: "₹2299",
    image: image20,
    link: "https://amzn.to/3Tf6tIo",
  },
  {
    id: 21,
    name: "Cadbury Dairy Milk Silk Chocolate Bar, 150g (3 Pack)",
    category: "Food",
    price: "₹430",
    oldPrice: "₹525",
    image: image21,
    link: "https://amzn.to/4ky8RGr",
  },
  {
    id: 22,
    name: "Ferrero Rocher Premium Milk Chocolate (300g) - 24 Pcs",
    category: "Food",
    price: "₹740",
    oldPrice: "₹950",
    image: image22,
    link: "https://amzn.to/4jHrPJq",
  },
  {
    id: 23,
    name: "Chokola Sweet Love Heart Shaped Dark Chocolates Box",
    category: "Food",
    price: "₹725",
    oldPrice: "₹899",
    image: image23,
    link: "https://amzn.to/43NDCji",
  },
  {
    id: 24,
    name: "Lindt LINDOR Assorted Chocolate Truffles, 200g",
    category: "Food",
    price: "₹729",
    oldPrice: "₹899",
    image: image24,
    link: "https://amzn.to/4kAqLrY",
  },
  {
    id: 25,
    name: "4700BC Gourmet Popcorn Combo Box (325g)",
    category: "Food",
    price: "₹664",
    oldPrice: "₹699",
    image: image25,
    link: "https://amzn.to/3SHF3dZ",
  },
  {
    id: 26,
    name: "Dalmond Truffles Handmade Almond Date Chocolates",
    category: "Food",
    price: "₹499",
    oldPrice: "₹645",
    image: image26,
    link: "https://amzn.to/3FPiotn",
  },
];

const ProductGallery = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = allProducts.filter((product) =>
    (product.name + " " + product.category).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="gallery-wrapper">
     <header className="header">
  <div className="title">
    <h1>Perfect Gifts for Your Partner 💝</h1>
  </div>
  <input
    type="text"
    className="search-bar"
    placeholder="Search gifts like chocolate, lamp..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</header>


      <div className="product-container-wrapper">
        {filteredProducts.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%" }}>No results found.</p>
        ) : (
          <div className="product-container" id="row-filtered">
            {filteredProducts.map((product) => (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="product-card"
                key={product.id}
              >
                <img
                  src={product.image || defaultImage}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <p className="price">
                  {product.oldPrice && <span className="old-price">{product.oldPrice}</span>} {product.price}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
