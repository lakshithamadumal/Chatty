import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

// Use localhost for development, replace with your actual backend URL
const API = (process.env.EXPO_PUBLIC_APP_URL || "http://localhost:8080") + "/Chatty";

export interface PhoneVerificationResponse {
  status: boolean;
  message: string;
  exists: boolean;
  userId?: number;
  user?: any;
}

export const checkPhoneNumber = async (
  countryCode: string,
  phoneNumber: string
): Promise<PhoneVerificationResponse> => {
  try {
    console.log("Making phone verification request to:", API + "/PhoneVerificationController");
    console.log("Request data:", {
      countryCode,
      phoneNumber
    });

    const response = await fetch(API + "/PhoneVerificationController", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        countryCode,
        phoneNumber
      }),
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
        message: `Server error: ${response.status} - ${errorText || 'Unknown error'}`,
        exists: false
      };
    }
  } catch (error) {
    console.log("Network error:", error);
    return {
      status: false,
      message: `Network error: ${error instanceof Error ? error.message : 'Unknown network error'}`,
      exists: false
    };
  }
};
