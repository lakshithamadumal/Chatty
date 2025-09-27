import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
  Text,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
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

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [phone, setPhone] = useState("");

  const { applied } = useTheme();

  const { userData, setUserData } = useUserRegistration();

  return (
    <AlertNotificationRoot>

      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-[#0f1828]">
        <StatusBar hidden={true} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
          className="flex-1"
        >
          <View className="flex-1 px-6 pt-2">
            <View className="w-full items-start">
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
            </View>

            <View className="mt-32">
              <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">
                Enter Your Phone Number
              </Text>
              <Text className="text-lg text-slate-500 dark:text-slate-300 mt-3 leading-5 text-center">
                Please confirm your country code and enter your phone number
              </Text>
            </View>

            <View className="mt-16 flex-row items-center ">
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

            <View className="mt-12">
              <Pressable
                onPress={() => {
                  
                  const countryCodeError = isValidCountryCode(userData.countryCode);
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

                  navigation.navigate("SignUpScreen");
                }}
                className="h-14 rounded-full bg-blue-600 items-center justify-center"
              >
                <Text className="text-white font-semibold">Continue</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AlertNotificationRoot>

  );
}
