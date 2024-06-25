"use client";

import NextThemeProvider from "./nextThemeProvider";
import ReduxProvider from "./reduxProvider";
import MuiProvider from "./muiProvider";
import GoogleMapsProvider from "./googleMapsProvider.js";

const Providers = ({ children }) => (
  <NextThemeProvider>
    {/* Redux State Management 📦 */}
    <ReduxProvider>
      {/* Material UI Provider 💅 */}
      <MuiProvider>
        {/* Google Maps Provider 🌍 */}
        <GoogleMapsProvider>{children}</GoogleMapsProvider>
      </MuiProvider>
    </ReduxProvider>
  </NextThemeProvider>
);

export default Providers;
