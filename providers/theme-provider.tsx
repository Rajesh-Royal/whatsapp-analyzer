"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const NextThemeProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
};

export default NextThemeProviders;
