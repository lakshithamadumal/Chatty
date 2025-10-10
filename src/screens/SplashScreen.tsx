import { useEffect } from "react";
import { StatusBar, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import "../../global.css";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";

type ScreenProps = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  const navigation = useNavigation<ScreenProps>();

  // Animation shared values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(20);

  const dot1 = useSharedValue(0.4);
  const dot2 = useSharedValue(0.4);
  const dot3 = useSharedValue(0.4);

  useEffect(() => {
    // Logo animations
    opacity.value = withTiming(1, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });

    scale.value = withTiming(1, {
      duration: 2000,
      easing: Easing.out(Easing.back(1)),
    });

    translateY.value = withTiming(0, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });

    // Three-dot looping animation
    const animSeq = (delay: number, v: SharedValue<number>) => {
      v.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 450, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.4, { duration: 450, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
    };

    animSeq(0, dot1);
    animSeq(180, dot2);
    animSeq(360, dot3);

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate("InfoScreen");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation, opacity, scale, translateY, dot1, dot2, dot3]);

  // Animation styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withDelay(800, withTiming(1, { duration: 1200 })),
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: dot1.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: dot2.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: dot3.value }],
  }));

  // Theme
  const { applied } = useTheme();
  const gradientColors =
    applied === "dark"
      ? (["#0ea5e9", "#2563eb", "#1e40af"] as const)
      : (["#06b6d4", "#3b82f6", "#6366f1"] as const);

  return (
    <LinearGradient
      colors={gradientColors}
      locations={[0, 0.6, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 justify-center items-center">
        <StatusBar
          barStyle={applied === "dark" ? "light-content" : "dark-content"}
          translucent
          backgroundColor="transparent"
        />

        {/* Logo */}
        <Animated.View style={logoAnimatedStyle} className="items-center">
          <View className="rounded-3xl p-8 mb-6 backdrop-blur-sm">
            <Text className="text-white text-5xl font-bold text-center">
              Chatty
            </Text>
          </View>
        </Animated.View>

        {/* Three-dot loader */}
        <Animated.View
          className="absolute bottom-32 flex-row"
          style={textAnimatedStyle}
        >
          {[dot1Style, dot2Style, dot3Style].map((style, index) => (
            <Animated.View
              key={index}
              style={[
                {
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  marginHorizontal: 6,
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
                style,
              ]}
            />
          ))}
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}
