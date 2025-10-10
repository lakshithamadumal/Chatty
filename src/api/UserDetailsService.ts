import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  contactNo: string;
  profileImage?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const USER_DETAILS_KEY = "userDetails";

export const saveUserDetails = async (userDetails: UserDetails): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_DETAILS_KEY, JSON.stringify(userDetails));
    console.log("User details saved successfully:", userDetails);
  } catch (error) {
    console.error("Error saving user details:", error);
    throw error;
  }
};

export const getUserDetails = async (): Promise<UserDetails | null> => {
  try {
    const userDetailsString = await AsyncStorage.getItem(USER_DETAILS_KEY);
    if (userDetailsString) {
      const userDetails = JSON.parse(userDetailsString) as UserDetails;
      console.log("User details retrieved successfully:", userDetails);
      return userDetails;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving user details:", error);
    return null;
  }
};

export const clearUserDetails = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DETAILS_KEY);
    console.log("User details cleared successfully");
  } catch (error) {
    console.error("Error clearing user details:", error);
    throw error;
  }
};
