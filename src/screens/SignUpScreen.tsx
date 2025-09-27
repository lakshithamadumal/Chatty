import {
  View,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  Image,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useState, useEffect, useRef } from "react";
import { useUserRegistration } from "../components/UserContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import {
  isValidFirstName,
  isValidLastName,
  isvalidProfilePicture,
} from "../Util/Validation";

type SignupProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;

export default function SignUpScreen() {
  const navigation = useNavigation<SignupProps>();

  const { applied } = useTheme();

  const { userData, setUserData } = useUserRegistration();

  const [image, setImage] = useState<string | null>(null);

  // Animation refs
  const orb1Scale = useRef(new Animated.Value(1)).current;
  const orb2Scale = useRef(new Animated.Value(1)).current;
  const orb3Scale = useRef(new Animated.Value(1)).current;

  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;

  const bubble1Scale = useRef(new Animated.Value(0)).current;
  const bubble2Scale = useRef(new Animated.Value(0)).current;
  const bubble3Scale = useRef(new Animated.Value(0)).current;

  // Pulsing orbs animation
  useEffect(() => {
    const createPulseAnimation = (value: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1.2,
              duration: 3000,
              easing: Easing.bezier(0.4, 0, 0.6, 1),
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 1,
              duration: 3000,
              easing: Easing.bezier(0.4, 0, 0.6, 1),
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    };

    const pulse1 = createPulseAnimation(orb1Scale, 0);
    const pulse2 = createPulseAnimation(orb2Scale, 1000);
    const pulse3 = createPulseAnimation(orb3Scale, 2000);

    pulse1.start();
    pulse2.start();
    pulse3.start();

    return () => {
      pulse1.stop();
      pulse2.stop();
      pulse3.stop();
    };
  }, []);

  // Staggered dots animation
  useEffect(() => {
    const dotsAnimation = Animated.sequence([
      Animated.delay(500),
      Animated.timing(dot1Opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(dot2Opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(dot3Opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    dotsAnimation.start();
  }, []);

  // Message bubbles animation
  useEffect(() => {
    const bubblesAnimation = Animated.stagger(400, [
      Animated.timing(bubble1Scale, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(bubble2Scale, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(bubble3Scale, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]);

    Animated.delay(1000).start(() => bubblesAnimation.start());
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-slate-50 dark:bg-[#0f1828]"
      >
        <SafeAreaView className="flex-1 px-6">
          <StatusBar hidden={true} />

          {/* Background Orbs */}
          <View className="absolute inset-0 overflow-hidden">
            {/* Top Right Orb */}
            <Animated.View
              style={{
                transform: [{ scale: orb1Scale }],
                backgroundColor:
                  applied === "dark"
                    ? "rgba(59, 130, 246, 0.15)"
                    : "rgba(59, 130, 246, 0.1)",
              }}
              className="absolute w-80 h-80 rounded-full -top-40 -right-32"
            />

            {/* Bottom Left Orb */}
            <Animated.View
              style={{
                transform: [{ scale: orb2Scale }],
                backgroundColor:
                  applied === "dark"
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(16, 185, 129, 0.08)",
              }}
              className="absolute w-64 h-64 rounded-full -bottom-32 -left-32"
            />
          </View>

          {/* Back Button with Dot */}
          <View className="w-full items-start pt-2 relative">
            <Pressable
              onPress={() => navigation.goBack()}
              className="h-10 w-10 items-center justify-center"
            >
              <AntDesign
                name="left"
                size={20}
                color={applied === "dark" ? "#F1F5F9" : "#0F1828"}
              />
            </Pressable>

            {/* Dot near back button */}
            <Animated.View
              style={{
                opacity: dot1Opacity,
                backgroundColor: applied === "dark" ? "#4ade80" : "#22c55e",
              }}
              className="absolute w-3 h-3 rounded-full top-2 right-2"
            />
          </View>

          {/* Title Section with Message Bubble */}
          <View className="items-center mt-8 relative">
            <Animated.View
              style={{
                transform: [{ scale: bubble1Scale }],
                backgroundColor: applied === "dark" ? "#152033" : "#bfdbfe",
              }}
              className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl rounded-bl-sm items-center justify-center"
            >
              <Text className="text-lg">👤</Text>
            </Animated.View>

            <Text className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Your Profile
            </Text>
          </View>

          {/* Profile Picture Section with Dots */}
          <View className="items-center mt-8 relative">
            <Pressable
              className="h-28 w-28 rounded-full items-center justify-center"
              style={{
                backgroundColor: applied === "dark" ? "#152033" : "#f1f5f9",
                position: "relative",
              }}
              onPress={pickImage}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="h-[120] w-[120] rounded-full"
                />
              ) : (
                <>
                  <Feather
                    name="user"
                    size={48}
                    color={applied === "dark" ? "#E2E8F0" : "#0F1828"}
                  />
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                      bottom: 8,
                      backgroundColor: "#0F1828",
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AntDesign name="plus" size={12} color="#FFFFFF" />
                  </View>
                </>
              )}
            </Pressable>

            {/* Message bubble near profile picture */}
            <Animated.View
              style={{
                transform: [{ scale: bubble2Scale }],
                backgroundColor: applied === "dark" ? "#1d4ed8" : "#bfdbfe",
              }}
              className="absolute -bottom-4 -right-2 w-10 h-10 rounded-2xl rounded-br-sm items-center justify-center"
            >
              <Text className="text-base">📷</Text>
            </Animated.View>
          </View>

          {/* Input Fields Section */}
          <View className="mt-8 relative">
            {/* Dot near input fields */}
            <Animated.View
              style={{
                opacity: dot3Opacity,
                backgroundColor: applied === "dark" ? "#8B5CF6" : "#7C3AED",
              }}
              className="absolute w-3.5 h-3.5 rounded-full -top-2 -left-2 z-10"
            />

            <TextInput
              placeholder="First Name"
              placeholderTextColor="#9CA3AF"
              className="h-12 px-4 rounded-xl bg-slate-100 dark:bg-[#152033] text-slate-800 dark:text-slate-100"
              value={userData.firstName}
              onChangeText={(text) =>
                setUserData((previous) => ({
                  ...previous,
                  firstName: text,
                }))
              }
            />
            <View className="h-3" />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#9CA3AF"
              className="h-12 px-4 rounded-xl bg-slate-100 dark:bg-[#152033] text-slate-800 dark:text-slate-100"
              value={userData.lastName}
              onChangeText={(text) =>
                setUserData((previous) => ({
                  ...previous,
                  lastName: text,
                }))
              }
            />
          </View>

          {/* Create Account Button Section */}
          <View className="mt-10 relative">
            <Pressable
              onPress={() => {
                setUserData((previous) => ({
                  ...previous,
                  profileImage: image,
                }));

                const ValidateFirstName = isValidFirstName(userData.firstName);
                const ValidateLastName = isValidLastName(userData.lastName);
                const ValidateProfileImage = isvalidProfilePicture(
                  image ? { uri: image } : null
                );

                if (ValidateFirstName) {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: ValidateFirstName,
                    button: "close",
                  });
                  return;
                }
                if (ValidateLastName) {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: ValidateLastName,
                    button: "close",
                  });
                  return;
                }
                if (ValidateProfileImage) {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: ValidateProfileImage,
                    button: "close",
                  });
                  return;
                }

                Dialog.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: "Success",
                  textBody: "Signup successful!",
                });

                setTimeout(() => {
                  Dialog.hide();
                  navigation.navigate("HomeScreen");
                }, 3000);
              }}
              className="h-14 rounded-full bg-blue-600 items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Text className="text-white font-semibold text-base">
                Create Account
              </Text>
            </Pressable>

            {/* Additional decorative dots around screen */}
            <Animated.View
              style={{
                opacity: dot1Opacity,
                backgroundColor:
                  applied === "dark"
                    ? "#eab308"
                    : "#facc15",
              }}
              className="absolute w-5 h-5 rounded-full -top-6 right-8"
            />

            <Animated.View
              style={{
                opacity: dot2Opacity,
                backgroundColor:
                  applied === "dark"
                    ? "#ef4444"
                    : "#f87171",
              }}
              className="absolute w-4 h-4 rounded-full bottom-4 -left-4"
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}
