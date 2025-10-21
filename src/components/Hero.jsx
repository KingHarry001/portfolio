import { useEffect, useState } from "react";
import Orb from "./react-ui/Orb";

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Hello World";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  return (
    <div id="hero" className="h-screen w-full relative">
      <Orb
        hoverIntensity={0.5}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-screen flex flex-col items-center justify-center">
        <h1 className=" text-7xl font-azonix Azonix-Regular cursor-target text-center font-bold animate-pulse bg-gradient-to-r from-[#9c43fe] via-[#4cc2e9] to-[#1014cc] bg-clip-text text-transparent">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
