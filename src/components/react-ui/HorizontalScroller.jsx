import React from "react";
import check from "../../assets/check.svg";
import web1 from "../../assets/web1.png";
import web2 from "../../assets/web2.png";
import web3 from "../../assets/web3.png";
import web4 from "../../assets/web4.png";
import web5 from "../../assets/web5.png";

const images = [web1, web2, web3, web4, web5, web1, web2, web3, web4, web5, ]; // repeat for seamless loop

export default function HorizontalScroller() {
  return (
    <div className="w-full h-[500px] overflow-hidden relative my-10">
      <div className="flex animate-scroll whitespace-nowrap">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`img-${i}`}
            className="w-full h-full object-contain mx-4"
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
