import { useEffect, useState } from "react";
import Orb from "./react-ui/Orb";

const Hero = () => {
  return (
    <div className="h-screen w-full">
      <Orb
        hoverIntensity={0.5}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-screen flex flex-col items-center justify-center text-xl sm:text-3xl font-mono">
        <h1 className="text-foreground text-5xl font-bold cursor-target">Hello World</h1>
      </div>
    </div>
  );
};

export default Hero;
