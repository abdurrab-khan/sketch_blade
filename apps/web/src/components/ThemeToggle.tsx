import { memo, useContext } from "react";
import { Button } from "./ui/button";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { ThemeContext } from "@/context/ThemeProvider";

function ThemeToggle() {
  const { mode, toggleTheme } = useContext(ThemeContext)!;

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

export default memo(ThemeToggle);
