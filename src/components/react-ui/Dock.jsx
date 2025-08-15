"use client";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Individual Dock Item
function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );

  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full border-chart-1 border-2 shadow-md ${className}`}
      tabIndex={0}
      role="button"
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

// Tooltip Label
function DockLabel({ children, className = "", isHovered }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-chart-1 bg-chart-1 px-2 py-0.5 text-xs text-white`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Icon Container
function DockIcon({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-center text-chart-1 ${className}`}>
      {children}
    </div>
  );
}

// Main Dock Component
export default function Dock({
  items = [],
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 0,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight],
  );

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  // Scroll-based visibility
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY.current + 10) {
        // Scrolling down
        setVisible(false);
      } else if (currentY < lastScrollY.current - 10) {
        // Scrolling up
        setVisible(true);
      }

      lastScrollY.current = currentY;

      // Auto-show after user stops scrolling
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(true), 1200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
 <motion.div
  style={{ height, scrollbarWidth: "none" }}
  className="w-full fixed bottom-4 flex justify-center items-center pointer-events-none z-50 sm:hidden"
>
  <motion.div
    initial={{ opacity: 1, y: 0 }}
    animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 100 }}
    transition={{ duration: 0.3 }}
    onMouseMove={({ pageX }) => {
      isHovered.set(0.1);
      mouseX.set(pageX);
    }}
    onMouseLeave={() => {
      isHovered.set(0);
      mouseX.set(Infinity);
    }}
    className={`${className} pointer-events-auto transform flex items-center w-fit gap-4 rounded-2xl border-chart-1 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border-2 pb-2 px-4`}
    style={{ height: panelHeight }}
    role="toolbar"
    aria-label="Application dock"
  >
    {items.map((item, index) => (
      <DockItem
        key={index}
        onClick={item.onClick}
        className={item.className}
        mouseX={mouseX}
        spring={spring}
        distance={distance}
        magnification={magnification}
        baseItemSize={baseItemSize}
      >
        <DockIcon>{item.icon}</DockIcon>
        <DockLabel isHovered={isHovered}>{item.label}</DockLabel>
      </DockItem>
    ))}
  </motion.div>
</motion.div>

  );
}
