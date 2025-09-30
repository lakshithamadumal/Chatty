import { UserRegistrationDate } from "../components/UserContext";

const API = process.env.EXPO_PUBLIC_APP_URL+"/Chatty"

export const createNewAccount = async (
  userRegistrationDate: UserRegistrationDate
) => {
  console.log(userRegistrationDate.firstName);
};
