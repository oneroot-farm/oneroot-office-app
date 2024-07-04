import dayjs from "dayjs";
import Cookies from "js-cookie";

import { Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import ImageCompression from "browser-image-compression";

// Firebase
import { storage } from "@/firebase";

export const getUserAgent = () => {
  const { appName, appVersion, platform } = navigator;

  const browserName = appName;
  const browserVersion = appVersion;
  const os = platform;

  return {
    os: os,
    browser: `${browserName} ${browserVersion}`,
    details: `${os} ${browserName} ${browserVersion}`,
  };
};

export const getUserToken = () => {
  const user = Cookies.get("user");

  const parsedUser = JSON.parse(user);

  if (user && user !== undefined && user !== null) return parsedUser.token;

  return undefined;
};

export const uploadImagesHandler = async (files, folder) => {
  if (!Array.isArray(files) || files.length === 0) return [];

  const path = `${process.env.NEXT_PUBLIC_BASE_URL}/file/upload/${folder}`;

  const promises = files.map(async (file) => {
    const form = new FormData();

    const extension = file.name.split(".").pop();

    const name = file.name + "-" + Date.now() + "." + extension;

    const payload = {
      file,
      name,
      type: `image/${extension}`,
    };

    form.append("file", payload);

    try {
      const response = await fetch(path, {
        body: form,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const json = await response.json();

        return json.url;
      }
    } catch (error) {
      console.log("Error : ", error.message);
    }
  });

  const urls = await Promise.all(promises);

  const validUrls = urls.filter((url) => url !== null);

  return validUrls;
};

export const isRTKResponse = (error) => {
  return (
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    typeof error.status === "number"
  );
};

export const formatDate = (date) => {
  const result = dayjs(date).format("DD/MM/YYYY");

  return result;
};

export const formatTime = (date) => {
  const result = dayjs(date).format("HH:mm:ss");

  return result;
};

export const capitalizeString = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const isApiResponse = (error) => {
  return (
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    typeof error.status === "number"
  );
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const convertFromTimestampToDate = (seconds, nanoseconds) => {
  // Convert seconds to milliseconds (since JavaScript Date expects milliseconds)
  const milliseconds = seconds * 1000;

  // Create a new Date object
  const date = new Date(milliseconds);

  // Extract year, month, and day from the Date object
  const year = date.getFullYear();

  // JavaScript months are 0-indexed, so we add 1 to get the correct month
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Return the formatted date as a string in YYYY-MM-DD format
  return `${year}-${month}-${day}`;
};

export const getTimeframeDates = (timeframe) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const thisWeekStart = new Date(today);
  const thisWeekEnd = new Date(today);
  thisWeekEnd.setDate(today.getDate() + 6);

  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - 7);
  const lastWeekEnd = new Date(today);
  lastWeekEnd.setDate(today.getDate() - 1);

  return {
    today: {
      startDate: Timestamp.fromDate(today),
      endDate: Timestamp.fromDate(today),
    },
    tomorrow: {
      startDate: Timestamp.fromDate(tomorrow),
      endDate: Timestamp.fromDate(tomorrow),
    },
    thisWeek: {
      startDate: Timestamp.fromDate(thisWeekStart),
      endDate: Timestamp.fromDate(thisWeekEnd),
    },
    lastWeek: {
      startDate: Timestamp.fromDate(lastWeekStart),
      endDate: Timestamp.fromDate(lastWeekEnd),
    },
  }[timeframe];
};

export const areCoordinates = (coords) => {
  const [lat, lng] = coords.split(",");

  return !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
};

export const openGoogleMapUrl = (latitude, longitude) => {
  if (!latitude || !longitude) return;

  const url = `https://maps.google.com/maps?q=${latitude},${longitude}`;

  window.open(url, "_blank");
};

export const fileCompressHandler = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const result = await ImageCompression(file, options);

    return result;
  } catch (error) {
    console.error("Error compressing image:", error);
  }
};

export const uploadFilesHandler = (files, path) => {
  const promises = files.map(async (file) => {
    const result = await fileCompressHandler(file);

    const reference = ref(storage, `${path}/${file.name}`);

    const snapshot = await uploadBytes(reference, result);

    return getDownloadURL(snapshot.ref);
  });

  return Promise.all(promises);
};
