import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function ThemeToggle() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    if (mode === "light") {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setMode("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setMode("light");
    }
  };

  useEffect(() => {
    const isDarkMode =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDarkMode);

    setMode(isDarkMode ? "dark" : "light");
  }, []);

  console.log("Current theme mode:", mode);

  return (
    <Button
      title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      variant={"outline"}
      onClick={toggleTheme}
      size={"icon"}
    >
      {mode === "light" ? <MdDarkMode /> : <MdLightMode />}
    </Button>
  );
}

export default ThemeToggle;
