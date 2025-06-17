// import React, { useState, useRef, useEffect } from "react";
// import "./Roadmap.css";
// import TopPart from "../../utilities/TopPart/TopPart";

// const Roadmap = () => {
//   const [circles, setCircles] = useState([]);
//   const [selectedCircle, setSelectedCircle] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const svgRef = useRef(null);
//   const containerRef = useRef(null);

//   const handleAddCircle = () => {
//     const maxCirclesPerGroup = 7;
//     const stepX = 240;
//     const maxX = Math.min(window.innerWidth - 50, 750);
//     const centerX = window.innerWidth / 2;
//     const baseX = centerX - maxX / 2;
//     const totalCircles = circles.length;
//     const positionInGroup = totalCircles % maxCirclesPerGroup;
//     let xOffset;

//     if (window.innerWidth <= 540) {
//       xOffset = centerX - 25;
//     } else if (positionInGroup < 4) {
//       xOffset = baseX + positionInGroup * stepX;
//     } else {
//       const referencePosition = positionInGroup - 3;
//       xOffset = baseX + referencePosition * stepX;
//     }

//     const prevCircle = circles[circles.length - 1];
//     const newCircle = {
//       id: totalCircles + 1,
//       x: xOffset,
//       y: totalCircles === 0 ? 50 : prevCircle.y + 200,
//       title: `Circle ${totalCircles + 1}`,
//     };

//     setCircles((prevCircles) => [...prevCircles, newCircle]);
//   };

//   useEffect(() => {
//     if (svgRef.current) {
//       const maxHeight =
//         circles.length > 0 ? circles[circles.length - 1].y + 200 : window.innerHeight;
//       svgRef.current.style.height = `${maxHeight}px`;
//     }
//   }, [circles]);

//   useEffect(() => {
//     const updateLines = () => {
//       if (!svgRef.current || circles.length < 2) return;

//       svgRef.current.innerHTML = "";
//       const containerHeight = containerRef.current.scrollHeight;
//       svgRef.current.style.height = `${containerHeight}px`;

//       circles.forEach((circle, index) => {
//         if (index === 0) return;
//         const prevCircle = circles[index - 1];
//         let path;

//         if (window.innerWidth <= 540) {
//           path = `M ${prevCircle.x + 50},${prevCircle.y + 50} 
//                   L ${circle.x + 50},${circle.y + 50}`;
//         } else {
//           const curveDirection = index % 6 < 2 ? -1 : 1;
//           const controlOffset = 50;
//           const controlX1 = prevCircle.x + 150;
//           const controlY1 = prevCircle.y + curveDirection * controlOffset;
//           const controlX2 = circle.x - 50;
//           const controlY2 = circle.y + curveDirection * controlOffset;

//           path = `M ${prevCircle.x + 50},${prevCircle.y + 50} 
//                   C ${controlX1},${controlY1} 
//                     ${controlX2},${controlY2} 
//                     ${circle.x + 50},${circle.y + 50}`;
//         }

//         const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
//         pathElement.setAttribute("d", path);
//         pathElement.setAttribute("stroke", "black");
//         pathElement.setAttribute("stroke-width", "2");
//         pathElement.setAttribute("fill", "transparent");
//         pathElement.setAttribute("stroke-linecap", "round");
//         svgRef.current.appendChild(pathElement);
//       });
//     };

//     updateLines();
//     window.addEventListener("resize", updateLines);
//     window.addEventListener("scroll", updateLines);

//     return () => {
//       window.removeEventListener("resize", updateLines);
//       window.removeEventListener("scroll", updateLines);
//     };
//   }, [circles]);
//   const handleCircleClick = (circleId) => {
//     const selected = circles.find((circle) => circle.id === circleId);
//     setSelectedCircle(selected);
//     setIsModalOpen(true);
//     setIsEditing(!selected.image); // Automatically enter edit mode if no image is set
//   };

//   const handleUploadImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedCircle((prev) => ({
//         ...prev,
//         image: imageUrl,
//       }));
//     }
//   };

//   const handleSaveDetails = () => {
//     setCircles((prevCircles) =>
//       prevCircles.map((circle) =>
//         circle.id === selectedCircle.id ? selectedCircle : circle
//       )
//     );
//     setIsEditing(false);
//   };

//   const handleDeleteDetails = () => {
//     setSelectedCircle((prev) => ({
//       ...prev,
//       image: null,
//       title: "",
//       notes: "",
//     }));
//     setIsEditing(true); // Re-enter edit mode after deletion
//   };


//   return (
//     <>
//       <TopPart />
//     <div ref={containerRef} className="Memory-Roadmap">
//      <svg
//   ref={svgRef}
//   className="lines-of-Memory-Roadmap"
//   style={{
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     minHeight: "100%",
//     overflow: "visible",
//     zIndex: 0,
//   }}
// />

//       {circles.map((circle) => (
//         <div
//           key={circle.id}
//           className="circle-of-Memory-Roadmap"
//           style={{
//             left: `${circle.x}px`,
//             top: `${circle.y}px`,
//           }}
//           onClick={() => handleCircleClick(circle.id)}
//         >
//           {circle.image ? (
//             <img
//               src={circle.image}
//               alt={circle.title || "Circle Content"}
//               className="circle-image-of-Memory-Roadmap"
//             />
//           ) : (
//             <span>ADD</span>
//           )}
//         </div>
//       ))}

//       <button className="add-btn-of-Memory-Roadmap" onClick={handleAddCircle}>
//         +
//       </button>

//       {isModalOpen && selectedCircle && (
//         <div className="modalofpicadded" onClick={() => setIsModalOpen(false)}>
//           <div className="modalofpicadded-content" onClick={(e) => e.stopPropagation()}>
//             {isEditing ? (
//               <>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleUploadImage}
//                   className="modalofpicadded-input"
//                 />
//                 <input
//                   type="text"
//                   value={selectedCircle.title}
//                   onChange={(e) =>
//                     setSelectedCircle((prev) => ({
//                       ...prev,
//                       title: e.target.value,
//                     }))
//                   }
//                   placeholder="Add a title"
//                   className="modalofpicadded-input"
//                 />
//                 <textarea
//                   value={selectedCircle.notes}
//                   onChange={(e) =>
//                     setSelectedCircle((prev) => ({
//                       ...prev,
//                       notes: e.target.value,
//                     }))
//                   }
//                   placeholder="Add notes"
//                   className="modalofpicadded-input"
//                 ></textarea>
//                 <div className="modalofpicadded-buttons">
//                   <button
//                     onClick={handleSaveDetails}
//                     className="modalofpicadded-btn save-btn"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h2 className="modalofpicadded-title">{selectedCircle.title || "No Title"}</h2>
//                 <img
//                   src={selectedCircle.image}
//                   alt={selectedCircle.title || "Uploaded"}
//                   className="modalofpicadded-image"
//                 />
//                 <p className="modalofpicadded-note">{selectedCircle.notes || "No Notes"}</p>
//                 <div className="modalofpicadded-buttons">
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="modalofpicadded-btn edit-btn"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={handleDeleteDetails}
//                     className="modalofpicadded-btn delete-btn"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => setIsModalOpen(false)}
//                     className="modalofpicadded-btn close-btn"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//     </>
//   );
// };

// export default Roadmap;











































import React, { useEffect, useRef, useState } from 'react'
import SvgWithDots from '../../components/SvgWithDots';
import TopPart from '../../utilities/TopPart/TopPart';
import gsap from 'gsap';
import axios from "axios";
import Loader from '../../utilities/Loader';




function Roadmap() {
  const svgContainer = useRef()

  const PlusSignIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <path d="M12 4V20M20 12H4" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );


  // DYNAMIC

  function chunkArray(array, size = 3) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }


  const [arrLength, setArrLength] = useState(0)
  const [groupedMemories, setGroupedMemories] = useState([]);
  const FIXED_POSITIONS = [0.2, 0.5, 0.75];
  const [loading, setLoading] = useState(true)
  const getMemories = async () => {
    setLoading(true)
    const memories = await axios.get(`${import.meta.env.VITE_PRODUCTION_URL}/api/v1/couples/getroadmap`, {
      withCredentials: true,
    });
    console.log(memories.data.data);
    console.log(memories.data.data.length)
    const grouped = chunkArray(memories.data.data, 3)
    setGroupedMemories(grouped);
    console.log(grouped)
    setArrLength(grouped.length)
    setLoading(false)
  }
  useEffect(() => {
    getMemories()
  }, [])



  // ActiveMemory POP UP 
  const [activeMemory, setActiveMemory] = useState(null);
  const [activeBox, setActiveBox] = useState(false);

  const handleActiveMemory = (memory) => {
    setActiveMemory(memory); // Update activeMemory with the clicked memory data
    console.log("Memory :")
    console.log(memory)
    openActiveBox()
  };

  const dyanmicBox = useRef();


  const openActiveBox = () => {
    console.log(activeMemory)
    gsap.to(dyanmicBox.current, {
      duration: 0.2,
      opacity: 1
    })
    gsap.to(dyanmicBox.current, {
      height: "80vh",
      ease: "power2.out",
      duration: 1,
    })
  }
  const closeActiveBox = () => {
    gsap.to(dyanmicBox.current, {
      height: "0",
      ease: "power2.out",
      duration: 0.5
    })
    gsap.to(dyanmicBox.current, {
      opacity: 0,
      duration: 1
    })
  }


  const Cancel01Icon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"white"} {...props}>
      <path d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
  const CancelCircleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={34} height={34} color={"#000000"} fill={"none"} {...props}>
      <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="black" strokeWidth="1.5"></path>
    </svg>
  );

  const addMemoriesBox = useRef(null);
  const plus = useRef(null);
  const [addMemBoxState, setAddMemBoxState] = useState(false)
  const openAddMemoryBox = () => {
    gsap.to(addMemoriesBox.current, {
      opacity: 1,
      x: 0,
      ease: "power2.out",
      duration: 0.5
    })
    gsap.to(plus.current, {
      rotate: 90,
      duration: 0.2,
      ease: "linear"
    })
  }
  const closeAddMemoryBox = () => {
    gsap.to(addMemoriesBox.current, {
      opacity: 0,
      x: 2000,
      duration: 0.5,
      ease: "power2.in"
    })
    gsap.to(plus.current, {
      rotate: 0,
      duration: 0.2,
      ease: "power2.in"
    })
  }

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-upload-icon-image_1344465.jpg");
  // const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    if (!heading || !description || !imageFile) {
      alert("Please fill out all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("description", description);
    formData.append("image", imageFile);

    try {
      setLoading(true); // 👉 Start loading
      const res = await axios.post(
        `${import.meta.env.VITE_PRODUCTION_URL}/api/v1/couples/addroadmap`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Memory added:", res.data);
      closeActiveBox()
      // Optional: reset fields or close box
    } catch (error) {
      console.error("Error adding memory:", error);
    } finally {
      setLoading(false); // 👉 Stop loading
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };
    const handleTopPartLoaded = () => {
    setLoading(false);
  };


  return loading ? (
    <Loader/>
  ) :(
    <div className="w-full h-screen">
      <TopPart onLoaded={handleTopPartLoaded} />
      <div className='w-full h-auto'>
        <div ref={svgContainer} className="svgContainer flex flex-col items-center">
          {/* <SvgWithDots positions={[0.2, 0.5, 0.75]} />          
          <SvgWithDots positions={[0.2, 0.5, 0.75]} />     */}
          {groupedMemories.map((group, index) => (
            <SvgWithDots
              key={index}
              positions={FIXED_POSITIONS}
              data={group}
              onDotClick={handleActiveMemory}
            />
          ))}
        </div>
      </div>
      <div
        ref={dyanmicBox}
        className="z-99 fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-[0] opacity-0 max-w-[500px] rounded-t-3xl bg-neutral-200 no-scrollbar">
        <div className="w-full h-5 relative">
          <div className="bg-neutral-700 shadow-2xl size-18 rounded-full flex items-center justify-center absolute left-1/2 -translate-1/2 top-0 cursor-pointer"
            onClick={closeActiveBox}
          >
            <Cancel01Icon />
          </div>
        </div>
        <div className="w-full h-[60%] flex items-center justify-center">
          <div className="size-[90%] bg-amber-200">
            {activeMemory && (
              <img
                src={activeMemory.image}
                alt={activeMemory.heading}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="w-full font-bold text-3xl text-black text-center h-15">
          {activeMemory?.heading || ""}
        </div>
        <div className="w-full text-lg text-neutral-800 text-center flex justify-center items-center">
          <div className="w-90%">
            {activeMemory?.description || ""}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 right-0 size-20 flex items-start justify-start">
        <div className="w-[90%] h-[90%] bg-pink-400 rounded-full text-white flex items-center justify-center hover:rotate-90 transition-all ease-in-out cursor-pointer"
          onClick={openAddMemoryBox}
          ref={plus}
        >
          <PlusSignIcon />
        </div>
      </div>
      <div className="fixed top-0 right-0 translate-x-500 w-full h-[550px] max-w-[550px] opacity-1 flex justify-center items-center"
        ref={addMemoriesBox}
      >
        <div className="w-[90%] h-[80%] bg-neutral-100 z-10 rounded-xl shadow-lg relative">
          <div className="absolute top-0 right-0 size-15 flex items-center justify-center text-black cursor-pointer"
            onClick={closeAddMemoryBox}
          >
            <CancelCircleIcon />
          </div>
          <h2 className="text-2xl font-bold text-center top-4 left-1/2 -translate-x-1/2 absolute">Add a Memory</h2>
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <label htmlFor="imageUpload" className="mb-2 text-sm text-gray-700">Upload Image</label>

            <label htmlFor="imageUpload" className="cursor-pointer">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-14 h-14 rounded-full border-2 border-gray-300 object-cover shadow-md hover:opacity-80 transition-opacity duration-200"
              />
            </label>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>



          <input
            type="text"
            placeholder="Enter your heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="top-45 pl-10 left-1/2 text-black -translate-x-1/2 absolute w-[70%] h-10 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-600"
          />


          <textarea
            placeholder="Enter your description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="top-60 p-3 left-1/2 text-black -translate-x-1/2 absolute w-[70%] border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-neutral-600"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`top-90 left-1/2 -translate-x-1/2 absolute w-[70%] h-14 text-2xl ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
              } text-white font-semibold rounded-md transition-all`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </div>
      </div>
      <div className="w-full h-screen">
        <div className="w-full text-8xl text-center">FOOTER</div>
      </div>
    </div>
  )
}

export default Roadmap
