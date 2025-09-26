import { StatusBar, Image, Text, View, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { useEffect, useCallback } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";

type props = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const navigation = useNavigation<props>();

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
  }, [navigation, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const { applied } = useTheme();
  const Illustration = applied === "dark"
    ? require("../../assets/IllustrationDark.png")
    : require("../../assets/IllustrationLight.png");

  const handleStart = useCallback(() => {
    navigation.navigate("ContactScreen");
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#0f1828]">
      <StatusBar hidden={true} />
      <Animated.View style={[animatedStyle, { flex: 1 }]}>
        <View className="flex-1 items-center justify-between py-10 px-6">
          <View className="w-full items-center mt-32">
            <Image
              source={Illustration}
              style={{ width: 260, height: 260, resizeMode: "contain" }}
            />
          </View>

          <View className="px-2">
            <Text className="text-center text-3xl font-semibold text-slate-800 dark:text-slate-100">
              Connect easily with your family and friends over countries
            </Text>
          </View>

          <View className="w-full items-center gap-4">
            <Text className="text-xs text-gray-500">
              Terms & Privacy Policy
            </Text>
            <View className="w-full px-4">
              <Pressable
                onPress={handleStart}
                className="bg-blue-600 rounded-full h-14 w-full items-center justify-center"
              >
                <Text className="text-white font-semibold">
                  Start Messaging
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
