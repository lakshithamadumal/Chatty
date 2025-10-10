import {
  View,
  Text,
  Pressable,
  ScrollView,
  StatusBar,
  Image,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import "../../global.css";

export default function SettingScreen() {
  const { applied } = useTheme(); // from your ThemeProvider
  const [themeMode, setThemeMode] = useState("system");
  const navigation = useNavigation();

  // Orb animations
  const orb1Scale = useRef(new Animated.Value(1)).current;
  const orb2Scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = (val: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(val, {
              toValue: 1.2,
              duration: 4000,
              easing: Easing.bezier(0.4, 0, 0.6, 1),
              useNativeDriver: true,
            }),
            Animated.timing(val, {
              toValue: 1,
              duration: 4000,
              easing: Easing.bezier(0.4, 0, 0.6, 1),
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    };

    const p1 = pulse(orb1Scale, 0);
    const p2 = pulse(orb2Scale, 2000);
    p1.start();
    p2.start();
    return () => {
      p1.stop();
      p2.stop();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#0f1828]">
      <StatusBar hidden={true} />

      {/* Header (simple, matches app header style) */}
      <View className="px-4 pb-5 pt-4 bg-white dark:bg-[#0f1828]">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{
              backgroundColor:
                applied === "dark" ? "#0f1724" : "rgba(74,97,209,0.06)",
            }}
          >
            <AntDesign
              name="arrow-left"
              size={20}
              color={applied === "dark" ? "#F1F5F9" : "#0F1828"}
            />
          </Pressable>

          <Text
            className="ml-3 text-xl font-semibold"
            style={{ color: applied === "dark" ? "#F1F5F9" : "#0F1828" }}
          >
            Settings
          </Text>
        </View>
      </View>

      {/* Animated background */}
      <View className="absolute inset-0 overflow-hidden">
        <Animated.View
          style={{
            transform: [{ scale: orb1Scale }],
            backgroundColor:
              applied === "dark"
                ? "rgba(59,130,246,0.15)"
                : "rgba(59,130,246,0.08)",
          }}
          className="absolute w-72 h-72 rounded-full -top-24 -left-32"
        />
        <Animated.View
          style={{
            transform: [{ scale: orb2Scale }],
            backgroundColor:
              applied === "dark"
                ? "rgba(16,185,129,0.1)"
                : "rgba(16,185,129,0.08)",
          }}
          className="absolute w-64 h-64 rounded-full bottom-0 -right-32"
        />
      </View>

      <ScrollView className="px-6 mt-4">
        {/* Profile Section */}
        <Pressable
          onPress={() => console.log("Profile clicked")}
          className={`flex-row items-center rounded-2xl p-4 mb-6 ${
            applied === "dark" ? "bg-[#152033]" : "bg-slate-100"
          }`}
          style={{
            shadowColor: applied === "dark" ? "#000" : "#4A61D1",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=12",
            }}
            className="w-16 h-16 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Lakshitha Madumal
            </Text>
            <Text className="text-slate-500 dark:text-slate-400">
              +94 71 265 4117
            </Text>
          </View>
        </Pressable>

        {/* Theme Section */}
        <View>
          <Text className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Theme
          </Text>

          <ThemeOption
            label="Light"
            selected={themeMode === "light"}
            onPress={() => setThemeMode("light")}
            emoji="☀️"
          />
          <ThemeOption
            label="Dark"
            selected={themeMode === "dark"}
            onPress={() => setThemeMode("dark")}
            emoji="🌙"
          />
          <ThemeOption
            label="Use System Theme"
            selected={themeMode === "system"}
            onPress={() => setThemeMode("system")}
            emoji="🖥️"
          />
        </View>

        {/* Logout Section */}
        <Pressable
          className={`flex-row items-center justify-between rounded-2xl p-4 mt-8 ${
            applied === "dark" ? "bg-[#152033]" : "bg-slate-100"
          }`}
          onPress={() => console.log("Logout Pressed")}
          style={{
            shadowColor: applied === "dark" ? "#000" : "#ef4444",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <Text className="text-base font-semibold text-red-500">Logout</Text>
          <AntDesign name="logout" size={18} color="#EF4444" />
        </Pressable>

        {/* Invite Friend Banner */}
        <LinearGradient
          colors={
            applied === "dark" ? ["#1e3a8a", "#1d4ed8"] : ["#3b82f6", "#60a5fa"]
          }
          className="rounded-2xl mt-8 p-5 flex-row items-center justify-between"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            shadowColor: "#1d4ed8",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <View>
            <Text className="text-white font-bold text-lg">
              Invite a Friend 💌
            </Text>
            <Text className="text-slate-100 text-sm">
              Share AYU with your friends!
            </Text>
          </View>
          <Feather name="share-2" size={24} color="white" />
        </LinearGradient>

        {/* Pro Version Banner */}
        <LinearGradient
          colors={
            applied === "dark" ? ["#0ea5e9", "#2563eb"] : ["#38bdf8", "#3b82f6"]
          }
          className="rounded-2xl mt-6 p-5 flex-row items-center justify-between"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            shadowColor: "#2563eb",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.22,
            shadowRadius: 12,
            elevation: 7,
          }}
        >
          <View className="flex-1 pr-4">
            <Text className="text-white font-bold text-lg">
              Get Pro Version 💎
            </Text>
            <Text className="text-slate-100 text-sm">
              Unlock your verified badge and exclusive features!
            </Text>
          </View>
          <View className="bg-white rounded-full px-4 py-2">
            <Text className="text-blue-600 font-semibold">Get Pro</Text>
          </View>
        </LinearGradient>

        {/* Footer */}
        <View
          style={{
            marginTop: 48,
            marginBottom: 32,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: applied === "dark" ? "#94A3B8" : "#6B7280",
              fontSize: 12,
            }}
          >
            from
          </Text>
          <Text
            style={{
              color: applied === "dark" ? "#60A5FA" : "#3B82F6",
              fontWeight: "600",
              fontSize: 16,
              textAlign: "center",
              marginTop: 6,
            }}
          >
            {process.env.EXPO_PUBLIC_APP_OWNER ?? "Lakshitha Madumal"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ThemeOption Component
function ThemeOption({
  label,
  selected,
  onPress,
  emoji,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  emoji: string;
}) {
  const { applied } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-2xl p-4 mb-2 ${
        applied === "dark" ? "bg-[#152033]" : "bg-slate-100"
      }`}
    >
      <View className="flex-row items-center space-x-3">
        <Text className="text-xl">{emoji}</Text>
        <Text className="text-base font-medium text-slate-800 dark:text-slate-100">
          {label}
        </Text>
      </View>
      <View
        className={`w-5 h-5 rounded-full border-2 ${
          selected
            ? "border-blue-500 bg-blue-500"
            : "border-slate-400 dark:border-slate-500"
        }`}
      />
    </Pressable>
  );
}
