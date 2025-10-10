import {
  View,
  Text,
  Pressable,
  StatusBar,
  Image,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import "../../global.css";

export default function SettingScreen() {
  const { applied } = useTheme();
  const [themeMode, setThemeMode] = useState("system");
  const navigation = useNavigation();

  // Orb animations
  const orb1Scale = useRef(new Animated.Value(1)).current;
  const orb2Scale = useRef(new Animated.Value(1)).current;
  const orb3Scale = useRef(new Animated.Value(1)).current;
  const orb4Scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = (val: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(val, {
              toValue: 1.3,
              duration: 5000,
              easing: Easing.bezier(0.4, 0, 0.6, 1),
              useNativeDriver: true,
            }),
            Animated.timing(val, {
              toValue: 1,
              duration: 5000,
              easing: Easing.bezier(0.4, 0, 0.6, 1),
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    };

    const p1 = pulse(orb1Scale, 0);
    const p2 = pulse(orb2Scale, 1500);
    const p3 = pulse(orb3Scale, 3000);
    const p4 = pulse(orb4Scale, 4500);

    p1.start();
    p2.start();
    p3.start();
    p4.start();

    return () => {
      p1.stop();
      p2.stop();
      p3.stop();
      p4.stop();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#0f1828]">
      <StatusBar hidden={true} />

      {/* Header with Logout */}
      <View className="px-6 pb-6 pt-4 bg-white dark:bg-[#0f1828] border-b border-slate-200 dark:border-slate-800">
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
              Settings
            </Text>
          </View>

          {/* Logout Button - Top Right */}
          <Pressable
            onPress={() => console.log("Logout Pressed")}
            className="w-12 h-12 rounded-2xl items-center justify-center active:scale-95 transition-all"
            style={{
              backgroundColor: applied === "dark" ? "#0F172A" : "#FEE2E2", // Dark navy vs soft red tint
              shadowColor: applied === "dark" ? "#000" : "#fca5a5",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Feather
              name="log-out"
              size={20}
              color={applied === "dark" ? "#EF4444" : "#DC2626"} // soft red for dark, strong red for light
            />
          </Pressable>
        </View>
      </View>

      {/* Animated Background Orbs */}
      <View className="absolute inset-0 overflow-hidden pointer-events-none">
        <Animated.View
          style={{
            transform: [{ scale: orb1Scale }],
            backgroundColor:
              applied === "dark"
                ? "rgba(59,130,246,0.12)"
                : "rgba(59,130,246,0.06)",
          }}
          className="absolute w-80 h-80 rounded-full -top-32 -left-32"
        />
        <Animated.View
          style={{
            transform: [{ scale: orb2Scale }],
            backgroundColor:
              applied === "dark"
                ? "rgba(168,85,247,0.1)"
                : "rgba(168,85,247,0.04)",
          }}
          className="absolute w-72 h-72 rounded-full -bottom-24 -right-24"
        />
      </View>

      {/* Main Content - Fixed Layout (No Scroll) */}
      <View className="flex-1 px-6 pt-4">
        {/* Profile Section */}
        <Pressable
          onPress={() => {
            navigation.navigate("ProfileScreen" as never);
          }}
          className={`flex-row items-center rounded-3xl p-6 mb-8 ${
            applied === "dark" ? "bg-[#152033]" : "bg-white"
          }`}
          style={{
            shadowColor: applied === "dark" ? "#000" : "#4A61D1",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="relative">
            <Image
              source={{
                uri: "https://i.pravatar.cc/150?img=12",
              }}
              className="w-20 h-20 rounded-2xl"
            />
            <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
              <Feather name="edit-2" size={12} color="white" />
            </View>
          </View>
          <View className="ml-5 flex-1">
            <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Lakshitha Madumal
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-base mt-1">
              +94 71 265 4117
            </Text>
            <Text className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Tap to edit profile
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color={applied === "dark" ? "#64748b" : "#94a3b8"}
          />
        </Pressable>

        {/* Theme Section */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
            Appearance
          </Text>

          <View className="rounded-3xl overflow-hidden">
            <ThemeOption
              label="Light Mode"
              selected={themeMode === "light"}
              onPress={() => setThemeMode("light")}
              emoji="☀️"
              description="Bright and clean"
            />
            <View className="h-px bg-slate-200 dark:bg-slate-700" />
            <ThemeOption
              label="Dark Mode"
              selected={themeMode === "dark"}
              onPress={() => setThemeMode("dark")}
              emoji="🌙"
              description="Easy on the eyes"
            />
            <View className="h-px bg-slate-200 dark:bg-slate-700" />
            <ThemeOption
              label="System Default"
              selected={themeMode === "system"}
              onPress={() => setThemeMode("system")}
              emoji="🖥️"
              description="Follow device setting"
            />
          </View>
        </View>

        {/* Pro Version Banner with Blue Verify Badge */}
        <View className="mb-8 relative overflow-hidden rounded-3xl">
          {/* Banner Background Orbs */}
          <View className="absolute inset-0">
            <Animated.View
              style={{
                transform: [{ scale: orb1Scale }],
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
              className="absolute w-36 h-36 rounded-full -top-12 -left-12"
            />
            <Animated.View
              style={{
                transform: [{ scale: orb2Scale }],
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
              className="absolute w-28 h-28 rounded-full bottom-4 right-4"
            />
          </View>

          <LinearGradient
            colors={
              applied === "dark"
                ? ["#0ea5e9", "#2563eb"]
                : ["#06b6d4", "#3b82f6"]
            }
            className="p-6"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center mb-2">
                  <View className="w-6 h-6 bg-white rounded-full items-center justify-center mr-2">
                    <Feather name="check" size={14} color="#3b82f6" />
                  </View>
                  <Text className="text-white font-bold text-lg">
                    Verified Pro
                  </Text>
                </View>
                <Text className="text-blue-100 text-sm mb-4">
                  Unlock exclusive features, blue verification badge, and
                  premium support
                </Text>
                <View className="flex-row items-center space-x-3">
                  <View className="flex-row items-center">
                    <Feather name="check-circle" size={14} color="#bbf7d0" />
                    <Text className="text-blue-100 text-xs ml-1">
                      Blue Badge
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="check-circle" size={14} color="#bbf7d0" />
                    <Text className="text-blue-100 text-xs ml-1">No Ads</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="check-circle" size={14} color="#bbf7d0" />
                    <Text className="text-blue-100 text-xs ml-1">Premium</Text>
                  </View>
                </View>
              </View>
              <View className="bg-white rounded-2xl px-5 py-3 active:scale-95">
                <Text className="text-blue-600 font-bold text-sm">UPGRADE</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Footer */}
        <View className="items-center justify-center mt-8 pb-6">
          <Text className="text-slate-400 dark:text-slate-500 text-sm mb-1">
            Designed and developed by
          </Text>
          <Text className="text-blue-500 dark:text-blue-400 font-bold text-lg">
            {process.env.EXPO_PUBLIC_APP_OWNER}
          </Text>
          <Text className="text-slate-400 dark:text-slate-500 text-xs mt-2">
            Version {process.env.EXPO_PUBLIC_APP_VERSION}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ThemeOption Component
function ThemeOption({
  label,
  selected,
  onPress,
  emoji,
  description,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  emoji: string;
  description?: string;
}) {
  const { applied } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between p-5 ${
        applied === "dark" ? "bg-[#152033]" : "bg-white"
      } active:scale-95 transition-all`}
    >
      <View className="flex-row items-center flex-1">
        <Text className="text-2xl mr-4">{emoji}</Text>
        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {label}
          </Text>
          {description && (
            <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {description}
            </Text>
          )}
        </View>
      </View>
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          selected
            ? "border-blue-500 bg-blue-500"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {selected && <Feather name="check" size={14} color="white" />}
      </View>
    </Pressable>
  );
}
