import React, { useState, useRef, useEffect } from "react";
import "./Roadmap.css";
import TopPart from "../../utilities/TopPart/TopPart";

const Roadmap = () => {
  const [circles, setCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const handleAddCircle = () => {
    const maxCirclesPerGroup = 7;
    const stepX = 240;
    const maxX = Math.min(window.innerWidth - 50, 750);
    const centerX = window.innerWidth / 2;
    const baseX = centerX - maxX / 2;
    const totalCircles = circles.length;
    const positionInGroup = totalCircles % maxCirclesPerGroup;
    let xOffset;

    if (window.innerWidth <= 540) {
      xOffset = centerX - 25;
    } else if (positionInGroup < 4) {
      xOffset = baseX + positionInGroup * stepX;
    } else {
      const referencePosition = positionInGroup - 3;
      xOffset = baseX + referencePosition * stepX;
    }

    const prevCircle = circles[circles.length - 1];
    const newCircle = {
      id: totalCircles + 1,
      x: xOffset,
      y: totalCircles === 0 ? 50 : prevCircle.y + 200,
      title: `Circle ${totalCircles + 1}`,
    };

    setCircles((prevCircles) => [...prevCircles, newCircle]);
  };

  useEffect(() => {
    if (svgRef.current) {
      const maxHeight =
        circles.length > 0 ? circles[circles.length - 1].y + 200 : window.innerHeight;
      svgRef.current.style.height = `${maxHeight}px`;
    }
  }, [circles]);

  useEffect(() => {
    const updateLines = () => {
      if (!svgRef.current || circles.length < 2) return;

      svgRef.current.innerHTML = "";
      const containerHeight = containerRef.current.scrollHeight;
      svgRef.current.style.height = `${containerHeight}px`;

      circles.forEach((circle, index) => {
        if (index === 0) return;
        const prevCircle = circles[index - 1];
        let path;

        if (window.innerWidth <= 540) {
          path = `M ${prevCircle.x + 50},${prevCircle.y + 50} 
                  L ${circle.x + 50},${circle.y + 50}`;
        } else {
          const curveDirection = index % 6 < 2 ? -1 : 1;
          const controlOffset = 50;
          const controlX1 = prevCircle.x + 150;
          const controlY1 = prevCircle.y + curveDirection * controlOffset;
          const controlX2 = circle.x - 50;
          const controlY2 = circle.y + curveDirection * controlOffset;

          path = `M ${prevCircle.x + 50},${prevCircle.y + 50} 
                  C ${controlX1},${controlY1} 
                    ${controlX2},${controlY2} 
                    ${circle.x + 50},${circle.y + 50}`;
        }

        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", path);
        pathElement.setAttribute("stroke", "black");
        pathElement.setAttribute("stroke-width", "2");
        pathElement.setAttribute("fill", "transparent");
        pathElement.setAttribute("stroke-linecap", "round");
        svgRef.current.appendChild(pathElement);
      });
    };

    updateLines();
    window.addEventListener("resize", updateLines);
    window.addEventListener("scroll", updateLines);

    return () => {
      window.removeEventListener("resize", updateLines);
      window.removeEventListener("scroll", updateLines);
    };
  }, [circles]);
  const handleCircleClick = (circleId) => {
    const selected = circles.find((circle) => circle.id === circleId);
    setSelectedCircle(selected);
    setIsModalOpen(true);
    setIsEditing(!selected.image); // Automatically enter edit mode if no image is set
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedCircle((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  const handleSaveDetails = () => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) =>
        circle.id === selectedCircle.id ? selectedCircle : circle
      )
    );
    setIsEditing(false);
  };

  const handleDeleteDetails = () => {
    setSelectedCircle((prev) => ({
      ...prev,
      image: null,
      title: "",
      notes: "",
    }));
    setIsEditing(true); // Re-enter edit mode after deletion
  };
  
  
  return (
    <>
      <TopPart />
    <div ref={containerRef} className="Memory-Roadmap">
     <svg
  ref={svgRef}
  className="lines-of-Memory-Roadmap"
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    minHeight: "100%",
    overflow: "visible",
    zIndex: 0,
  }}
/>

      {circles.map((circle) => (
        <div
          key={circle.id}
          className="circle-of-Memory-Roadmap"
          style={{
            left: `${circle.x}px`,
            top: `${circle.y}px`,
          }}
          onClick={() => handleCircleClick(circle.id)}
        >
          {circle.image ? (
            <img
              src={circle.image}
              alt={circle.title || "Circle Content"}
              className="circle-image-of-Memory-Roadmap"
            />
          ) : (
            <span>ADD</span>
          )}
        </div>
      ))}

      <button className="add-btn-of-Memory-Roadmap" onClick={handleAddCircle}>
        +
      </button>

      {isModalOpen && selectedCircle && (
        <div className="modalofpicadded" onClick={() => setIsModalOpen(false)}>
          <div className="modalofpicadded-content" onClick={(e) => e.stopPropagation()}>
            {isEditing ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="modalofpicadded-input"
                />
                <input
                  type="text"
                  value={selectedCircle.title}
                  onChange={(e) =>
                    setSelectedCircle((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Add a title"
                  className="modalofpicadded-input"
                />
                <textarea
                  value={selectedCircle.notes}
                  onChange={(e) =>
                    setSelectedCircle((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Add notes"
                  className="modalofpicadded-input"
                ></textarea>
                <div className="modalofpicadded-buttons">
                  <button
                    onClick={handleSaveDetails}
                    className="modalofpicadded-btn save-btn"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="modalofpicadded-title">{selectedCircle.title || "No Title"}</h2>
                <img
                  src={selectedCircle.image}
                  alt={selectedCircle.title || "Uploaded"}
                  className="modalofpicadded-image"
                />
                <p className="modalofpicadded-note">{selectedCircle.notes || "No Notes"}</p>
                <div className="modalofpicadded-buttons">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="modalofpicadded-btn edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteDetails}
                    className="modalofpicadded-btn delete-btn"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="modalofpicadded-btn close-btn"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Roadmap;
