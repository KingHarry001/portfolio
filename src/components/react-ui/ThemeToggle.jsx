import { useEffect, useState } from "react";

const themes = ["light", "dark", "earth", "glass", "retro"];

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Toggle Tailwind's dark class if needed
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="px-4 py-2 rounded bg-white text-black dark:bg-gray-800 dark:text-foreground border border-gray-300 dark:border-gray-600"
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default ThemeToggle;
