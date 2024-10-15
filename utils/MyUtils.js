import { Platform } from "react-native";

export const dataUrlToFile = (url, fileName) => {
  const [mediaType, data] = url.split(",");

  const mime = mediaType.match(/:(.*?);/)?.[0];

  var n = data.length;

  const arr = new Uint8Array(n);

  while (n--) {
    arr[n] = data.charCodeAt(n);
  }

  return new File([arr], fileName, { type: mime });
};
export const dataAsyncUrlToFile = async (dataUrl, fileName) => {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const contentType = await res.headers.get("content-type");
    console.log(contentType, "content-type");
    return new File([blob], fileName, { type: contentType });
  } catch (err) {
    console.log(err, " error in dataAsyncUrlToFile");
    throw err;
  }
};
export const getFilename = (url) => {
  return url.substr(url.lastIndexOf("/") + 1);
};

export const getExtention = (mime) => {
  switch (mime) {
    case "application/pdf":
      return ".pdf";
    case "image/jpeg":
      return ".jpg";
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    default:
      return ".jpg";
  }
};

export const mobileUrlToFile = async (uri, data, field) => {
  const os = Platform.OS;

  if (os == "android") {
    const fileName = new Date().getTime() + getExtention(mime);
    let fileInfo = "";
    await RNFS.copyFile(uri, RNFS.CachesDirectoryPath + "/" + fileName).catch(
      (e) => {
        fileInfo = undefined;
      }
    );

    if (!fileInfo) {
      fileDetail = await RNFS.stat(
        RNFS.CachesDirectoryPath + "/" + fileName
      ).catch((e) => {});
      data.append(field, {
        name: getFilename(fileDetail.path),
        type: payload.file.type,
        uri: "file://" + fileDetail.path,
      });
    }
  } else {
    let localPath = uri;
    if (!localPath.includes("private")) {
      localPath = localPath.replace("/var", "/private/var");
    }
    data.append(field, {
      name: getFilename(localPath),
      type: mime,
      uri: localPath.replace("file://", ""),
    });
  }
};
export const objectToBlob = (object) => {
  try {
    const json = JSON.stringify(object);

    // Create a Blob from the JSON string
    const blob = new Blob([json], {
      type: "application/json",
    });
    return blob;
  } catch (err) {
    console.log(err, " error in objectToBlob");
    throw err;
  }
};

export const convertImageUrlToBase64 = async (imageUrl, a) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};
export const formatNumber = (q) => {
  if (q === undefined || q === null || q === "") {
    q = 0;
  }
  return q.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export function parseDateStringToOnlyDate(dateString) {
  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  return formattedDate;
}
export const formatNumberVND = (q) => {
  // Handle undefined, null, or empty values
  if (q === undefined || q === null || q === "") {
    q = 0;
  }

  // Format the number as Vietnamese dong (VND)
  return q.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
export const formatQuantity = (q) => {
  if (q === undefined || q === null || q === "") {
    q = 0;
  }
  return q.toLocaleString("en-US");
};

export const fix2 = (number) => {
  try {
    return Math.round(number * 1e2) / 1e2;
  } catch (e) {
    console.error("not a number in fix2");
    return 0;
  }
};

export function formatDateToSeconds(dateString) {
  const dateObj = new Date(dateString); // Parse the date string
  const hours = dateObj.getHours().toString().padStart(2, "0"); // Add leading zero for single-digit hours
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed (January is 0)
  const year = dateObj.getFullYear();

  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}

export function formatDate(dateString) {
  const dateObj = new Date(dateString); // Parse the date string
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed (January is 0)
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDateTime(dateString) {
  const dateObj = new Date(dateString); // Parse the date string
  const hours = dateObj.getHours().toString().padStart(2, "0"); // Add leading zero for single-digit hours
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed (January is 0)
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
export const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return null;
};

export function convertIntTimeToString(time) {
  // Convert the number to a string and pad with leading zeros if necessary
  let timeStr = time?.toString()?.padStart(4, "0");
  if (timeStr) {
    let hours = timeStr.slice(0, 2);
    let minutes = timeStr.slice(2);

    // Return the formatted time
    return `${hours}:${minutes}`;
  }
  return ""
  // Extract hours and minutes from the string
}
