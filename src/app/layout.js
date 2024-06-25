import "./globals.css";

// Providers
import Providers from "@/providers";

// Components
import SideBar from "@/components/sidebar";

// React Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constants
import { SIDEBAR_MENU } from "@/constants";

export const metadata = {
  title: "OneRoot - Office App",
  description: "Web application for onboarding farms & data management.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />

        <Providers>
          <SideBar menu={SIDEBAR_MENU}>{children}</SideBar>
        </Providers>
      </body>
    </html>
  );
}
