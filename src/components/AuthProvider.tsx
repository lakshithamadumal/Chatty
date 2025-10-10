import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserDetails, saveUserDetails, getUserDetails, clearUserDetails } from "../api/UserDetailsService";

type AuthContextType = {
  userId: string | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  signUp: (id: string, userDetails?: UserDetails) => Promise<void>;
  signOut: () => Promise<void>;
};
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
export const USER_ID_KEY = "userId"; // saved name on AsynchStorage
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedId = await AsyncStorage.getItem(USER_ID_KEY);
        console.log("AuthProvider: Loaded userId from storage:", storedId);
        setUserId(storedId);
        
        // Load user details if userId exists
        if (storedId) {
          const details = await getUserDetails();
          setUserDetails(details);
        }
      } catch (error) {
        console.warn("Error restored userId", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000); // Reduced from 4000ms to 1000ms for better UX
      }
    };
    loadUser();
  }, []);

  const signUp = async (id: string, userDetails?: UserDetails) => {
    console.log("AuthProvider: Storing userId:", id);
    await AsyncStorage.setItem(USER_ID_KEY, id);
    setUserId(id);
    
    // Save user details if provided
    if (userDetails) {
      await saveUserDetails(userDetails);
      setUserDetails(userDetails);
    }
    
    console.log("AuthProvider: userId stored successfully");
  };

  const signOut = async () => {
    console.log("AuthProvider: Signing out user");
    await AsyncStorage.removeItem(USER_ID_KEY);
    await clearUserDetails();
    setUserId(null);
    setUserDetails(null);
    console.log("AuthProvider: User signed out successfully");
  };

  // when calling this hook if dependencies are changed otherwise it get previous data
  const value = useMemo(
    () => ({ userId, userDetails, isLoading, signUp, signOut }),
    [userId, userDetails, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
