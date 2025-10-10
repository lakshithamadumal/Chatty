import { UserRegistrationDate } from "../components/UserContext";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

// Use localhost for development, replace with your actual backend URL
const API = (process.env.EXPO_PUBLIC_APP_URL || "http://localhost:8080") + "/Chatty";

export const createNewAccount = async (
  userRegistrationDate: UserRegistrationDate
) => {
  try {
    let formData = new FormData();

    formData.append("firstName", userRegistrationDate.firstName);
    formData.append("lastName", userRegistrationDate.lastName);
    formData.append("countryCode", userRegistrationDate.countryCode);
    formData.append("contactNo", userRegistrationDate.contactNo);
    
    // Only append profile image if it exists
    if (userRegistrationDate.profileImage) {
      formData.append("profileImage", {
        uri: userRegistrationDate.profileImage,
        name: "profile.png",
        type: "image/png",
      } as any);
    }

    console.log("Making request to:", API + "/UserController");
    console.log("FormData contents:", {
      firstName: userRegistrationDate.firstName,
      lastName: userRegistrationDate.lastName,
      countryCode: userRegistrationDate.countryCode,
      contactNo: userRegistrationDate.contactNo,
      hasProfileImage: !!userRegistrationDate.profileImage
    });

    const response = await fetch(API + "/UserController", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header for FormData - let the browser set it automatically
      // This is crucial for multipart/form-data requests
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (response.ok) {
      const json = await response.json();
      console.log("Response data:", json);
      return json;
    } else {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      return {
        status: false,
        message: `Server error: ${response.status} - ${errorText || 'Unknown error'}`
      };
    }
  } catch (error) {
    console.log("Network error:", error);
    return {
      status: false,
      message: `Network error: ${error instanceof Error ? error.message : 'Unknown network error'}`
    };
  }
};
