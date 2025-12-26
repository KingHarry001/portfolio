import { useEffect, useState, useMemo } from "react";
import Orb from "../react-ui/Orb";
import { useTheme } from "../../context/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "Hello World";

  // Define explicit Hex codes for backgrounds to ensure they work instantly
  const themeConfig = useMemo(() => {
    return {
      light: {
        background: "#f3f4f6", // Gray 100
        textGradient: "from-violet-600 via-blue-600 to-cyan-600",
        cursorColor: "#1f2937", // Gray 800
      },
      dark: {
        background: "#000000",
        textGradient: "from-[#9c43fe] via-[#4cc2e9] to-[#1014cc]",
        cursorColor: "#ffffff",
      },
      earth: {
        background: "#0c0a09", // Warm Stone
        textGradient: "from-orange-500 via-amber-500 to-yellow-500",
        cursorColor: "#ffedd5", // Orange 100
      },
      retro: {
        background: "#232323", // Vintage Dark
        textGradient: "from-pink-500 via-red-500 to-yellow-500",
        cursorColor: "#fbcfe8", // Pink 200
      },
      glass: {
        background: "#0f172a", // Slate 900
        textGradient: "from-cyan-400 via-sky-400 to-indigo-400",
        cursorColor: "#cffafe", // Cyan 100
      },
      darkblue: {
        background: "#020617", // Slate 950
        textGradient: "from-blue-400 via-indigo-500 to-purple-600",
        cursorColor: "#dbeafe", // Blue 100
      },
    };
  }, []);

  const currentStyle = themeConfig[theme] || themeConfig.dark;

  // Typing effect logic
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
    <div
      id="hero"
      // FIX: Use inline style for background color to bypass Tailwind purging issues
      style={{ backgroundColor: currentStyle.background }}
      className="relative h-screen w-full overflow-hidden transition-colors duration-700 ease-in-out"
    >
      {/* Background Orb Layer */}
      <div className="absolute inset-0 z-0">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      {/* Content Layer */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
        <h1
          className={`cursor-default text-center font-azonix font-bold text-transparent text-5xl md:text-7xl lg:text-8xl bg-gradient-to-r bg-clip-text animate-pulse transition-all duration-700 ${currentStyle.textGradient}`}
        >
          {displayText}
          <span
            className="animate-pulse ml-2 transition-colors duration-700"
            style={{ color: currentStyle.cursorColor }}
          >
            |
          </span>
        </h1>
      </div>
    </div>
  );
};

export default Hero;