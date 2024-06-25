import { ThemeProvider } from "next-themes";

// Constants
import { DEFAULT_THEME } from "@/constants";

const NextThemeProvider = ({ children }) => (
  // Separate next-themes Provider from MUI, so is does not get rerendered on theme switch
  <ThemeProvider attribute="class" defaultTheme={DEFAULT_THEME}>
    {children}
  </ThemeProvider>
);

export default NextThemeProvider;
