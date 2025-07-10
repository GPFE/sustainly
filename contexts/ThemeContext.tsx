"use client"
import {  useContext, useMemo, useState } from "react";
import { createContext } from "react";

const ThemeContext = createContext({});

type Theme = "light" | "dark" | "default";

const themes = {
    default: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    light: "light",
    dark: "dark"
}

export default function ThemeContextProvider({children} : Readonly<{ children: React.ReactNode }>) {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const preferedTheme = localStorage.getItem("theme") || systemTheme;

    const [theme, setTheme] = useState(preferedTheme);
    const changeTheme = (theme: Theme) => {
        const newTheme = themes[theme];
        setTheme(newTheme);

        if (theme === "default") {
            document.documentElement.classList.remove("dark");
            localStorage.removeItem("theme");
            return;
        }

        theme === "dark"
            ? document.documentElement.classList.toggle("dark", true)
            : document.documentElement.classList.toggle("dark", false);

        localStorage.setItem("theme", newTheme);
    }

    const value = useMemo(() => ({
        theme,
        setTheme: changeTheme
    }), [theme])

    return(
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => (
    useContext(ThemeContext)
)