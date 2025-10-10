import { StatusBar, Image, Text, View, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { useEffect, useCallback } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

type props = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  useWebSocketPing(4000);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const dot1Opacity = useSharedValue(0);
  const dot2Opacity = useSharedValue(0);
  const dot3Opacity = useSharedValue(0);
  const decorationScale = useSharedValue(0);
  const navigation = useNavigation<props>();

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1, { duration: 600 });

    dot1Opacity.value = withDelay(400, withTiming(1, { duration: 300 }));
    dot2Opacity.value = withDelay(600, withTiming(1, { duration: 300 }));
    dot3Opacity.value = withDelay(800, withTiming(1, { duration: 300 }));

    decorationScale.value = withSequence(
      withDelay(200, withTiming(1, { duration: 500 })),
      withTiming(1.1, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    );
  }, [
    navigation,
    opacity,
    scale,
    dot1Opacity,
    dot2Opacity,
    dot3Opacity,
    decorationScale,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  const decorationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: decorationScale.value }],
  }));

  const { applied } = useTheme();
  const Illustration =
    applied === "dark"
      ? require("../../assets/IllustrationDark.png")
      : require("../../assets/IllustrationLight.png");

  const handleStart = useCallback(() => {
    navigation.navigate("ContactScreen");
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#0f1828]">
      <StatusBar hidden={true} />

      <View className="absolute top-20 left-6">
        <Animated.View
          style={decorationStyle}
          className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-60"
        />
      </View>

      <View className="absolute bottom-40 right-8">
        <Animated.View
          style={decorationStyle}
          className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full opacity-60"
        />
      </View>

      <View className="absolute top-1/3 right-10">
        <Animated.View
          style={[
            decorationStyle,
            { transform: [{ scale: decorationScale.value * 0.7 }] },
          ]}
          className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full opacity-50"
        />
      </View>

      <Animated.View style={[animatedStyle, { flex: 1 }]}>
        <View className="flex-1 items-center justify-between py-10 px-6">
          <View className="w-full items-center mt-32 relative">
            <Animated.View
              style={dot1Style}
              className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 dark:bg-green-500 rounded-full"
            />
            <Animated.View
              style={dot2Style}
              className="absolute -bottom-2 -left-2 w-5 h-5 bg-red-400 dark:bg-red-500 rounded-full"
            />
            <Animated.View
              style={dot3Style}
              className="absolute top-10 -left-4 w-4 h-4 bg-yellow-400 dark:bg-yellow-500 rounded-full"
            />

            <Image
              source={Illustration}
              style={{ width: 260, height: 260, resizeMode: "contain" }}
            />
          </View>

          <View className="px-2 relative">
            <View className="absolute -left-6 top-1/2 w-4 h-0.5 bg-blue-400 dark:bg-blue-500 rounded-full" />
            <View className="absolute -right-6 top-1/2 w-4 h-0.5 bg-blue-400 dark:bg-blue-500 rounded-full" />

            <Text className="text-center text-3xl font-semibold text-slate-800 dark:text-slate-100">
              Connect easily with your family and friends over countries
            </Text>
          </View>

          <View className="w-full items-center gap-4 relative">
            <View className="absolute -top-8 left-8">
              <View className="w-10 h-8 bg-blue-200 dark:bg-blue-700 rounded-t-lg rounded-br-lg items-center justify-center">
                <Text className="text-blue-600 dark:text-blue-300 text-xs">
                  👋
                </Text>
              </View>
            </View>

            <View className="absolute -top-12 right-12">
              <View className="w-8 h-6 bg-green-200 dark:bg-green-700 rounded-t-lg rounded-bl-lg items-center justify-center">
                <Text className="text-green-600 dark:text-green-300 text-xs">
                  💬
                </Text>
              </View>
            </View>

            <Text className="text-xs text-gray-500 dark:text-gray-400">
              Terms & Privacy Policy
            </Text>

            <View className="w-full px-4">
              <Pressable
                onPress={handleStart}
                className="bg-blue-600 rounded-full h-14 w-full items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Text className="text-white font-semibold text-lg">
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
