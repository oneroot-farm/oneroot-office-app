import { useTheme } from "next-themes";

import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import {
  createTheme as createMuiTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material";

import { DEFAULT_THEME, generateSettings } from "@/constants";

const MuiProvider = ({ children }) => {
  const { theme: themeState } = useTheme();

  const themeName =
    themeState === "dark" || themeState === "light"
      ? themeState
      : DEFAULT_THEME;

  const ThemeOptions = generateSettings(themeName);

  const theme = createMuiTheme(ThemeOptions);

  return (
    // CssBaseline causes the theme switch to stop working
    <NextAppDirEmotionCacheProvider options={{ key: "css", prepend: true }}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
};

export default MuiProvider;
