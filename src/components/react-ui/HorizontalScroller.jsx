import React from "react";
import check from "../../assets/check.svg";
import svg1 from "../../assets/svg1.svg";
import svg2 from "../../assets/svg2.svg";

const images = [check, svg1, svg2, check, svg1, svg2]; // repeat for seamless loop

export default function HorizontalScroller() {
  return (
    <div className="w-full overflow-hidden relative border border-gray-300">
      <div className="flex animate-scroll whitespace-nowrap">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`img-${i}`}
            className="w-24 h-24 object-contain mx-4"
          />
        ))}
      </div>

      {/* Tailwind inline animation */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll linear infinite 20s;
          }
        `}
      </style>
    </div>
  );
}
