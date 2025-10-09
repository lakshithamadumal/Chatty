import {
  View,
  Text,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import "../../global.css";
import { useTheme } from "../theme/ThemeProvider";
import { RootStack } from "../../App";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  isValidFirstName,
  isValidLastName,
  isValidCountryCode,
  isValidPhoneNumber,
} from "../Util/Validation";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";

export default function NewContactScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStack, "NewContactScreen">>();
  const { applied } = useTheme();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [callingCode, setCallingCode] = useState<string>("+94"); // <-- added

  const newContact = useSendNewContact();
  const sendNewContact = newContact.sendNewContact;
  const responseText = newContact.responseText;

  const sendData = () => {
    const sendNewContact = {
      id: 0,
      firstName: firstName,
      lastName: lastName,
      countryCode: callingCode,
      contactNo: contactNo,
      createdAt: "",
      updatedAt: "",
      status: "",
    };

    setFirstName("");
    setLastName("");
    setCallingCode("+94");
    setContactNo("");
  };

  // Animations
  const orb1Scale = useRef(new Animated.Value(1)).current;
  const orb2Scale = useRef(new Animated.Value(1)).current;
  const orb3Scale = useRef(new Animated.Value(1)).current;
  const bubble1Scale = useRef(new Animated.Value(0)).current;
  const bubble2Scale = useRef(new Animated.Value(0)).current;
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;

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

    Animated.stagger(400, [
      Animated.spring(bubble1Scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(bubble2Scale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
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
    ]).start();

    return () => {
      // stop pulse loops
      pulse1.stop();
      pulse2.stop();
      pulse3.stop();
      // stop other running animations / animated values
      bubble1Scale.stopAnimation();
      bubble2Scale.stopAnimation();
      dot1Opacity.stopAnimation();
      dot2Opacity.stopAnimation();
    };
  }, []);

  return (
    <AlertNotificationRoot>
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#0f1828]">
        <StatusBar hidden={true} />

        {/* Animated background orbs */}
        <View className="absolute inset-0 overflow-hidden">
          <Animated.View
            style={{
              transform: [{ scale: orb1Scale }],
              backgroundColor:
                applied === "dark"
                  ? "rgba(59,130,246,0.15)"
                  : "rgba(59,130,246,0.1)",
            }}
            className="absolute w-72 h-72 rounded-full -top-40 -left-32"
          />
          <Animated.View
            style={{
              transform: [{ scale: orb2Scale }],
              backgroundColor:
                applied === "dark"
                  ? "rgba(139,92,246,0.1)"
                  : "rgba(139,92,246,0.08)",
            }}
            className="absolute w-64 h-64 rounded-full bottom-0 -right-28"
          />
          <Animated.View
            style={{
              transform: [{ scale: orb3Scale }],
              backgroundColor:
                applied === "dark"
                  ? "rgba(16,185,129,0.1)"
                  : "rgba(16,185,129,0.08)",
            }}
            className="absolute w-56 h-56 rounded-full top-1/2 -left-24"
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 px-6"
        >
          {/* Header */}
          <View className="flex-row items-center mt-2 relative">
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
              className="absolute w-3 h-3 rounded-full top-1 right-1"
            />
          </View>

          {/* Title */}
          <View className="items-center mt-12 relative">
            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">
              Add New Contact
            </Text>
            <Text className="text-lg text-slate-500 dark:text-slate-300 mt-3 leading-5 text-center">
              Enter details to save a new contact in your list
            </Text>
          </View>

          {/* Inputs */}
          <View className="mt-10">
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#9CA3AF"
              className="h-12 px-4 rounded-xl bg-slate-100 dark:bg-[#152033] text-slate-800 dark:text-slate-100 mb-4"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#9CA3AF"
              className="h-12 px-4 rounded-xl bg-slate-100 dark:bg-[#152033] text-slate-800 dark:text-slate-100 mb-4"
              value={lastName}
              onChangeText={setLastName}
            />

            <View className="flex-row items-center mb-4">
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCallingCode
                withEmoji
                onSelect={(c) => {
                  setCountryCode(c.cca2);
                  setCountry(c);
                  setCallingCode(
                    c.callingCode && c.callingCode.length
                      ? `+${c.callingCode[0]}`
                      : "+94"
                  );
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
              <Text
                className="text-sm mr-2"
                style={{ color: applied === "dark" ? "#94A3B8" : "#374151" }}
              >
                {callingCode}
              </Text>
              <TextInput
                placeholder="Contact Number"
                placeholderTextColor="#9CA3AF"
                inputMode="tel"
                className="flex-1 h-12 px-4 rounded-xl bg-slate-100 dark:bg-[#152033] text-slate-800 dark:text-slate-100"
                value={contactNo}
                onChangeText={setContactNo}
              />
            </View>
          </View>

          {/* Save Button */}
          <View className="mt-12 relative">
            <Pressable
              className="h-14 rounded-full bg-blue-600 items-center justify-center shadow-lg shadow-blue-500/30"
              onPress={() => {
                const firstNameValid = isValidFirstName(firstName);
                const lastNameValid = isValidLastName(lastName);
                const countryCodeValid = isValidCountryCode(callingCode);
                const phoneNoValid = isValidPhoneNumber(contactNo);

                if (firstNameValid) {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: firstNameValid,
                  });
                } else if (lastNameValid) {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: lastNameValid,
                  });
                } else if (countryCodeValid) {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: countryCodeValid,
                  });
                } else if (phoneNoValid) {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: phoneNoValid,
                  });
                } else {
                  sendData();
                }
              }}
            >
              <Text className="text-white font-semibold text-base">
                Save Contact
              </Text>
            </Pressable>

            <Animated.View
              style={{
                transform: [{ scale: bubble2Scale }],
                backgroundColor: applied === "dark" ? "#16a34a" : "#bbf7d0",
              }}
              className="absolute -bottom-24 -right-4 w-10 h-10 rounded-2xl rounded-br-sm items-center justify-center"
            >
              <Text className="text-base">✨</Text>
            </Animated.View>

            <Animated.View
              style={{
                opacity: dot2Opacity,
                backgroundColor: applied === "dark" ? "#ef4444" : "#f87171",
              }}
              className="absolute w-5 h-5 rounded-full -top-6 left-6"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
}
