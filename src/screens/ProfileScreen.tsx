import {
  View,
  Text,
  Pressable,
  StatusBar,
  Image,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import "../../global.css";
import { RootStack } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ProfileProps = NativeStackNavigationProp<RootStack, "ProfileScreen">;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileProps>();

  const { applied } = useTheme();

  // User state
  const [user, setUser] = useState({
    firstName: "Lakshitha",
    lastName: "Madumal",
    contactNumber: "+94 71 265 4117",
    profilePicture: "https://iamlaky.online/assets/profile.jpg",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Subtle background motion
  const orb1 = new Animated.Value(1);
  const orb2 = new Animated.Value(1);
  Animated.loop(
    Animated.sequence([
      Animated.timing(orb1, {
        toValue: 1.1,
        duration: 5000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
      Animated.timing(orb1, {
        toValue: 1,
        duration: 5000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
    ])
  ).start();
  Animated.loop(
    Animated.sequence([
      Animated.timing(orb2, {
        toValue: 1.12,
        duration: 5200,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
      Animated.timing(orb2, {
        toValue: 1,
        duration: 5200,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
    ])
  ).start();

  // Handle profile picture change
  const handleChangeProfilePicture = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to change your profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUser((prev) => ({
          ...prev,
          profilePicture: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!user.firstName.trim() || !user.lastName.trim()) {
      Alert.alert(
        "Validation Error",
        "Please enter both first name and last name"
      );
      return;
    }

    if (!user.contactNumber.trim()) {
      Alert.alert("Validation Error", "Please enter your contact number");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    }, 1500);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset to original values (in a real app, you might want to keep the original data separately)
    setUser({
      firstName: "Lakshitha",
      lastName: "Madumal",
      contactNumber: "+94 71 265 4117",
      profilePicture: "https://i.pravatar.cc/150?img=12",
    });
    setIsEditing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#0f1828]">
      <StatusBar hidden={true} />

      {/* Decorative Background */}
      <View className="absolute inset-0 overflow-hidden pointer-events-none">
        <Animated.View
          style={{
            transform: [{ scale: orb1 }],
            backgroundColor:
              applied === "dark"
                ? "rgba(59,130,246,0.10)"
                : "rgba(99,102,241,0.06)",
          }}
          className="absolute w-96 h-96 rounded-full -top-20 -left-32"
        />
        <Animated.View
          style={{
            transform: [{ scale: orb2 }],
            backgroundColor:
              applied === "dark"
                ? "rgba(168,85,247,0.08)"
                : "rgba(14,165,233,0.06)",
          }}
          className="absolute w-80 h-80 rounded-full -bottom-24 -right-24"
        />
      </View>

      {/* Header */}
      <View className="px-6 pb-6 pt-4 ">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-12 h-12 rounded-2xl items-center justify-center active:scale-95 transition-all"
            >
              <Ionicons
                name="arrow-back-sharp"
                size={22}
                color={applied === "dark" ? "#F1F5F9" : "#0F1828"}
              />
            </Pressable>

            <Text
              className="ml-2 text-2xl font-bold"
              style={{ color: applied === "dark" ? "#F1F5F9" : "#0F1828" }}
            >
              Edit Profile
            </Text>
          </View>

          {isEditing ? (
            <View className="flex-row items-center space-x-2">
              <Pressable
                onPress={handleCancelEdit}
                className="px-4 py-2 rounded-2xl active:scale-95 transition-all"
                style={{
                  backgroundColor: applied === "dark" ? "#374151" : "#F3F4F6",
                }}
              >
                <Text className="text-slate-600 dark:text-slate-300 font-medium">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSaveProfile}
                disabled={isLoading}
                className="px-4 py-2 rounded-2xl active:scale-95 transition-all"
                style={{
                  backgroundColor: "#3B82F6",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-medium">Save</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setIsEditing(true)}
              className="px-4 py-2 rounded-2xl active:scale-95 transition-all"
              style={{
                backgroundColor: applied === "dark" ? "#1E293B" : "#3B82F6",
              }}
            >
              <Text
                className="font-medium"
                style={{ color: applied === "dark" ? "#3B82F6" : "white" }}
              >
                Edit
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={{ uri: user.profilePicture }}
              className="w-32 h-32 rounded-3xl"
            />
            {isEditing && (
              <Pressable
                onPress={handleChangeProfilePicture}
                className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full items-center justify-center border-2 border-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Feather name="camera" size={18} color="white" />
              </Pressable>
            )}
          </View>

          {isEditing && (
            <Pressable
              onPress={handleChangeProfilePicture}
              className="mt-4 px-4 py-2 rounded-2xl active:scale-95 transition-all"
              style={{
                backgroundColor: applied === "dark" ? "#374151" : "#F3F4F6",
              }}
            >
              <Text className="text-slate-600 dark:text-slate-300 font-medium">
                Change Photo
              </Text>
            </Pressable>
          )}
        </View>

        {/* Form Section */}
        <View className="space-y-6">
          {/* First Name */}
          <View>
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              First Name
            </Text>
            <View
              className={`rounded-2xl p-4 ${
                applied === "dark" ? "bg-[#152033]" : "bg-white"
              } ${
                isEditing
                  ? "border-2 border-blue-500"
                  : "border border-slate-200 dark:border-slate-700"
              }`}
            >
              {isEditing ? (
                <TextInput
                  value={user.firstName}
                  onChangeText={(text) =>
                    setUser((prev) => ({ ...prev, firstName: text }))
                  }
                  className="text-slate-800 dark:text-slate-100 text-base"
                  placeholder="Enter first name"
                  placeholderTextColor="#94A3B8"
                  editable={isEditing}
                />
              ) : (
                <Text className="text-slate-800 dark:text-slate-100 text-base">
                  {user.firstName}
                </Text>
              )}
            </View>
          </View>

          {/* Last Name */}
          <View>
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Last Name
            </Text>
            <View
              className={`rounded-2xl p-4 ${
                applied === "dark" ? "bg-[#152033]" : "bg-white"
              } ${
                isEditing
                  ? "border-2 border-blue-500"
                  : "border border-slate-200 dark:border-slate-700"
              }`}
            >
              {isEditing ? (
                <TextInput
                  value={user.lastName}
                  onChangeText={(text) =>
                    setUser((prev) => ({ ...prev, lastName: text }))
                  }
                  className="text-slate-800 dark:text-slate-100 text-base"
                  placeholder="Enter last name"
                  placeholderTextColor="#94A3B8"
                  editable={isEditing}
                />
              ) : (
                <Text className="text-slate-800 dark:text-slate-100 text-base">
                  {user.lastName}
                </Text>
              )}
            </View>
          </View>

          {/* Contact Number */}
          <View>
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              Contact Number
            </Text>
            <View
              className={`rounded-2xl p-4 ${
                applied === "dark" ? "bg-[#152033]" : "bg-white"
              }`}
            >
              <Text className="text-slate-800 dark:text-slate-100 text-base">
                {user.contactNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
