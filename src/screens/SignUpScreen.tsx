import {
  View,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  Image,
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
import { useState } from "react";
import { useUserRegistration } from "../components/UserContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { isValidFirstName, isValidLastName, isvalidProfilePicture } from "../Util/Validation";

type SignupProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;

export default function SignUpScreen() {
  const navigation = useNavigation<SignupProps>();

  const { applied } = useTheme();

  const { userData, setUserData } = useUserRegistration();

  const [image, setImage] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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

          <View className="w-full items-start pt-2">
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

          <View className="items-center mt-8">
            <Text className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Your Profile
            </Text>
          </View>

          <View className="items-center mt-8">
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
          </View>

          <View className="mt-8">
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

          <View className="mt-10">
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
              className="h-14 rounded-full bg-blue-600 items-center justify-center"
            >
              <Text className="text-white font-semibold">Create Account</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}
