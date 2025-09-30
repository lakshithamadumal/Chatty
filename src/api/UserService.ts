import { UserRegistrationDate } from "../components/UserContext";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

const API = process.env.EXPO_PUBLIC_APP_URL + "/Chatty";

export const createNewAccount = async (
  userRegistrationDate: UserRegistrationDate
) => {
  let formData = new FormData();

  formData.append("firstName", userRegistrationDate.firstName);
  formData.append("lastName", userRegistrationDate.lastName);
  formData.append("countryCode", userRegistrationDate.countryCode);
  formData.append("contactNo", userRegistrationDate.contactNo);
  formData.append("profileImage", {
    uri: userRegistrationDate.profileImage,
    name: "profile.png",
    type: "image/png",
  } as any);

  const response = await fetch(API + "/UserController", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.ok) {
    const json = await response.json();
    if (json.status) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Account created successfully",
        button: "close",
      });
    } else {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: json.message,
        button: "close",
      });
    }
  } else {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "Error",
      textBody: "Failed to create account",
      button: "close",
    });
  }
};
