import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  userId: string | null;
  isLoading: boolean;
  signUp: (id: string) => Promise<void>;
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
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedId = await AsyncStorage.getItem(USER_ID_KEY);
        console.log("AuthProvider: Loaded userId from storage:", storedId);
        setUserId(storedId);
      } catch (error) {
        console.warn("Error restored userId", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000); // Reduced from 4000ms to 1000ms for better UX
      }
    };
    loadUser();
  }, []);

  const signUp = async (id: string) => {
    console.log("AuthProvider: Storing userId:", id);
    await AsyncStorage.setItem(USER_ID_KEY, id);
    setUserId(id);
    console.log("AuthProvider: userId stored successfully");
  };

  const signOut = async () => {
    console.log("AuthProvider: Signing out user");
    await AsyncStorage.removeItem(USER_ID_KEY);
    setUserId(null);
    console.log("AuthProvider: User signed out successfully");
  };

  // when calling this hook if dependencies are changed otherwise it get previous data
  const value = useMemo(
    () => ({ userId, isLoading, signUp, signOut }),
    [userId, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
