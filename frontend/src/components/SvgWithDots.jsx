import { useGSAP } from "@gsap/react";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/all";

function SvgWithDots({ positions = [], data = [] ,onDotClick}) {
  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);
  const pathRef = useRef();
  const circleRefs = useRef([]);
  const [dotPositions, setDotPositions] = useState([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || positions.length === 0) return;

    const totalLength = path.getTotalLength();
    const calculatedDots = positions.map((p) => {
      const clamped = Math.max(0, Math.min(1, p));
      const point = path.getPointAtLength(clamped * totalLength);
      return { x: point.x, y: point.y };
    });

    setDotPositions(calculatedDots);
  }, [positions]);

  useGSAP(() => {
    circleRefs.current.forEach((ref, index) => {
      if (!ref) return;

      ScrollTrigger.create({
        trigger: ref,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          let scale;
          if (progress <= 0.6) {
            scale = 1 + (0.6 - Math.abs(0.6 - progress)) * (0.6 / 0.6);
          } else {
            scale = 1 + (1 - progress) * (0.6 / 0.4);
          }

          scale = Math.max(1, Math.min(scale, 1.6));

          gsap.set(ref, {
            scale,
            transformOrigin: "center center",
          });
        },
      });
    });
  }, [dotPositions]);

  const svgRef = useRef(null);
  useGSAP(() => {
    if (!pathRef.current) return;

    gsap.fromTo(
      pathRef.current,
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
        ease: "none",
      }
    );
  }, []);

  return (
    <svg
      width="230"
      height="760"
      viewBox="0 0 230 760"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
    >
      <path
        ref={pathRef}
        className="svgs"
        d="M123 0.5C123 0.5 -11.5 33 1.49996 127C14.4999 221 217 170.5 228.5 266.5C240 362.5 -2.9521 382.8 30.5 496.5C56.488 584.831 229.147 532.428 228.5 624.5C228.031 691.255 123 759 123 759"
        stroke="#C92C7A"
        strokeWidth={5}
        fill="none"
      />

      {dotPositions.map((pos, index) => {
        const memory = data[index];
        if (!memory) return null; // ✅ Skip if no corresponding memory

        return (
          <foreignObject
            key={index}
            x={pos.x - 15}
            y={pos.y - 30}
            width={50}
            height={50}
            ref={(el) => (circleRefs.current[index] = el)}
          >
            <div
              className="w-[90%] h-[90%] transition-all ease-in-out duration-300 hover:w-full hover:h-full hover:border-2 rounded-full border-4 border-pink-700 bg-center bg-cover cursor-pointer"
              style={{
                backgroundImage: `url(${memory.image})`,
              }}
              onClick={() => onDotClick(data[index])}
              title={memory.heading}
            />
          </foreignObject>
        );
      })}
    </svg>
  );
}

export default SvgWithDots;
