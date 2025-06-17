import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Loader = () => {
  const barRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Animate loader bar from 0% to 100%
    gsap.to(
      barRef.current,
      {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      }
    );
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center flex-col"
    >
        <div className="">LOADING...</div>
      <div className="w-80 h-4 bg-pink-100 overflow-hidden shadow-lg">
        <div
          ref={barRef}
          className="h-full bg-pink-500"
        ></div>
      </div>
    </div>
  );
};

export default Loader;
