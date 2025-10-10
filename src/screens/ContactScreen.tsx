import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
  Text,
  Pressable,
  TextInput,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState, useEffect, useRef } from "react";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";
import { useUserRegistration } from "../components/UserContext";
import { isValidCountryCode, isValidPhoneNumber } from "../Util/Validation";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import { checkPhoneNumber } from "../api/PhoneVerificationService";
import { useAuth } from "../components/AuthProvider";
import { UserDetails } from "../api/UserDetailsService";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const { applied } = useTheme();

  const { userData, setUserData } = useUserRegistration();
  const { signUp } = useAuth();

  const orb1Scale = useRef(new Animated.Value(1)).current;
  const orb2Scale = useRef(new Animated.Value(1)).current;
  const orb3Scale = useRef(new Animated.Value(1)).current;

  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;

  const bubble1Scale = useRef(new Animated.Value(0)).current;
  const bubble2Scale = useRef(new Animated.Value(0)).current;
  const bubble3Scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!userData.countryCode) {
      setUserData((previous) => ({
        ...previous,
        countryCode: "+94",
      }));
    }
  }, []);

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

  return (
    <AlertNotificationRoot>
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#0f1828]">
        <StatusBar hidden={true} />

        <View className="absolute inset-0 overflow-hidden">
          <Animated.View
            style={{
              transform: [{ scale: orb1Scale }],
              backgroundColor:
                applied === "dark"
                  ? "rgba(59, 130, 246, 0.15)"
                  : "rgba(59, 130, 246, 0.1)",
            }}
            className="absolute w-72 h-72 rounded-full -top-40 -left-32"
          />

          <Animated.View
            style={{
              transform: [{ scale: orb2Scale }],
              backgroundColor:
                applied === "dark"
                  ? "rgba(139, 92, 246, 0.1)"
                  : "rgba(139, 92, 246, 0.08)",
            }}
            className="absolute w-64 h-64 rounded-full -bottom-32 -right-32"
          />

          <Animated.View
            style={{
              transform: [{ scale: orb3Scale }],
              backgroundColor:
                applied === "dark"
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(16, 185, 129, 0.08)",
            }}
            className="absolute w-56 h-56 rounded-full top-1/2 -left-28 -mt-28"
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
          className="flex-1"
        >
          <View className="flex-1 px-6 pt-2">
            <View className="w-full items-start relative">
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

              <Animated.View
                style={{
                  opacity: dot1Opacity,
                  backgroundColor: applied === "dark" ? "#3B82F6" : "#2563EB",
                }}
                className="absolute w-3 h-3 rounded-full top-0 right-0"
              />
            </View>

            <View className="mt-20 items-center relative">
              <Animated.View
                style={{
                  transform: [{ scale: bubble1Scale }],
                  backgroundColor: applied === "dark" ? "#1d4ed8" : "#bfdbfe",
                }}
                className="absolute -top-6 -right-4 w-14 h-14 rounded-2xl rounded-br-sm items-center justify-center"
              >
                <Text className="text-xl">💬</Text>
              </Animated.View>

              <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">
                Enter Your Phone Number
              </Text>
              <Text className="text-lg text-slate-500 dark:text-slate-300 mt-3 leading-5 text-center">
                Please confirm your country code and enter your phone number
              </Text>
            </View>

            <View className="mt-12 relative">
              <View className="flex-row items-center">
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCallingCodeButton
                  withEmoji
                  onSelect={(c) => {
                    setCountryCode(c.cca2);
                    setCountry(c);
                    setUserData((previous) => ({
                      ...previous,
                      countryCode: `+${c.callingCode[0]}`,
                    }));
                  }}
                  containerButtonStyle={{
                    backgroundColor: applied === "dark" ? "#152033" : "#F4F6FA",
                    borderRadius: 10,
                    height: 48,
                    paddingHorizontal: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                  theme={{
                    onBackgroundTextColor:
                      applied === "dark" ? "#f1f5f9" : "#152033",
                  }}
                />
                <TextInput
                  inputMode="tel"
                  placeholder="Phone Number"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 h-12 px-4 rounded-xl bg-slate-100 dark:bg-[#152033] text-slate-800 dark:text-slate-100"
                  value={userData.contactNo}
                  onChangeText={(text) =>
                    setUserData((previous) => ({
                      ...previous,
                      contactNo: text,
                    }))
                  }
                />
              </View>
            </View>

            <View className="mt-16 relative">
              <Pressable
                onPress={async () => {
                  const countryCodeError = isValidCountryCode(
                    userData.countryCode
                  );
                  if (countryCodeError) {
                    Dialog.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: countryCodeError,
                      button: "close",
                    });
                    return;
                  }

                  const phoneError = isValidPhoneNumber(userData.contactNo);
                  if (phoneError) {
                    Dialog.show({
                      type: ALERT_TYPE.WARNING,
                      title: "Warning",
                      textBody: phoneError,
                      button: "close",
                    });
                    return;
                  }

                  setLoading(true);

                  try {
                    const response = await checkPhoneNumber(
                      userData.countryCode,
                      userData.contactNo
                    );

                    if (response.status && response.exists) {
                      // User exists - show login success dialog
                        Dialog.show({
                          type: ALERT_TYPE.SUCCESS,
                          title: "Success",
                          textBody: "Welcome! Logged in",
                          button: "close",
                          onHide: () => {
                            // Save user ID and details to AuthProvider - this will automatically navigate to HomeScreen
                            if (response.userId && response.user) {
                              const userDetails: UserDetails = {
                                id: response.userId,
                                firstName: response.user.firstName || "",
                                lastName: response.user.lastName || "",
                                countryCode: response.user.countryCode || "",
                                contactNo: response.user.contactNo || "",
                                profileImage: response.user.profileImage || undefined,
                                status: response.user.status || undefined,
                                createdAt: response.user.createdAt || undefined,
                                updatedAt: response.user.updatedAt || undefined,
                              };
                              signUp(response.userId.toString(), userDetails);
                            } else if (response.userId) {
                              signUp(response.userId.toString());
                            }
                          },
                        });

                        setTimeout(() => {
                          Dialog.hide();
                        }, 2000);
                    } else {
                      // User doesn't exist - proceed to sign up
                      navigation.navigate("SignUpScreen");
                    }
                  } catch (error) {
                    Dialog.show({
                      type: ALERT_TYPE.DANGER,
                      title: "Error",
                      textBody: "Please try again.",
                      button: "close",
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className={`h-14 rounded-full items-center justify-center shadow-lg shadow-blue-500/30 ${
                  loading ? "bg-blue-600" : "bg-blue-600"
                }`}
              >
                {loading ? (
                  <Text className="text-white font-semibold text-base">
                    Loading...
                  </Text>
                ) : (
                  <Text className="text-white font-semibold text-base">
                    Continue
                  </Text>
                )}
              </Pressable>

              <Animated.View
                style={{
                  transform: [{ scale: bubble3Scale }],
                  backgroundColor: applied === "dark" ? "#15803d" : "#bbf7d0",
                }}
                className="absolute -bottom-4 -right-4 w-10 h-10 rounded-2xl rounded-br-sm items-center justify-center"
              >
                <Text className="text-base">🚀</Text>
              </Animated.View>
            </View>

            <Animated.View
              style={{
                opacity: dot1Opacity,
                backgroundColor: applied === "dark" ? "#ef4444" : "#f87171",
              }}
              className="absolute w-6 h-6 rounded-full bottom-20 left-8"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
}
