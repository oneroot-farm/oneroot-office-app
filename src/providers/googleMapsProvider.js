"use client";

import React from "react";

import { useJsApiLoader } from "@react-google-maps/api";

// Components
import Loader from "@/components/loader";

const GOOGLE_MAPS_LIBRARIES = ["places"];

const GoogleMapsProvider = ({ children }) => {
  // loading google script from the CDN to use google maps inside our application
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    libraries: GOOGLE_MAPS_LIBRARIES,
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  return isLoaded ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <Loader open={true} />
  );
};

export default GoogleMapsProvider;
