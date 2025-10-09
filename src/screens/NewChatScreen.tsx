import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";
import InitialsAvatar from "../components/InitialsAvatar";
import { useTheme } from "../theme/ThemeProvider";

type NewChatScreenProp = NativeStackNavigationProp<RootStack, "NewChatScreen">;

export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenProp>();
  const { applied } = useTheme();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const users = useUserList();

  // Simulate loading
  useLayoutEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(s) ||
      u.lastName.toLowerCase().includes(s) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(s) ||
      u.contactNo.includes(search)
    );
  });

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1828]"
      activeOpacity={0.7}
      onPress={() =>
        navigation.replace("SingleChatScreen", {
          chatId: item.id,
          friendName: `${item.firstName} ${item.lastName}`,
          lastSeenTime: item.updatedAt,
          profileImage: item.profileImage,
        })
      }
    >
      <InitialsAvatar
        name={`${item.firstName} ${item.lastName}`}
        uri={item.profileImage}
        size={46}
        className="w-11 h-11"
      />
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {item.firstName} {item.lastName}
        </Text>
        <Text
          className="text-[13px] mt-0.5"
          style={{
            color:
              item.status === "ACTIVE"
                ? applied === "dark"
                  ? "#34D399" // dark: softer emerald
                  : "#059669" // light: stronger emerald
                : applied === "dark"
                  ? "#94A3B8" // dark: muted slate
                  : "#6B7280", // light: muted gray
          }}
        >
          {item.status === "ACTIVE"
            ? "Already in friend list • Message now"
            : "Hey there! I am using Chatty"}
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {item.countryCode}
          {item.contactNo}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-[#0f1828] justify-center items-center"
        edges={["top", "right", "bottom", "left"]}
      >
        <ActivityIndicator size="large" color="#4A61D1" />
        <Text className="mt-3 text-gray-500 dark:text-gray-400 text-base">
          Loading contacts...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-[#0f1828]"
      edges={["top", "right", "bottom", "left"]}
    >
      <StatusBar
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <View className="absolute top-10 left-0 w-40 h-40">
        <View className="absolute -top-20 -left-20 w-60 h-60 bg-[#4A61D1] dark:bg-[#6B82FF] rounded-full opacity-10" />
      </View>

      <View className="absolute bottom-0 right-0 w-60 h-60">
        <View className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#4A61D1] dark:bg-[#6B82FF] rounded-full opacity-5" />
      </View>

      {/* Header */}
      <View className="px-4 pt-2 pb-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full"
        >
          <Ionicons
            name="arrow-back-sharp"
            size={24}
            color={applied === "dark" ? "#F1F5F9" : "#0F1828"}
          />
        </TouchableOpacity>
        <View className="flex-1 ml-2">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Select Contact
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {users.length} contacts
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-3">
        <View className="flex-row items-center bg-[#F7F7FC] dark:bg-[#152033] rounded-xl px-3 py-2.5">
          <Ionicons
            name="search"
            size={20}
            color={applied === "dark" ? "#A0AEC0" : "#94A3B8"}
          />
          <TextInput
            className="flex-1 ml-2 text-gray-900 dark:text-gray-100 text-base"
            placeholder="Search contacts..."
            placeholderTextColor={applied === "dark" ? "#A0AEC0" : "#94A3B8"}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={applied === "dark" ? "#A0AEC0" : "#94A3B8"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* New Contact */}
      <TouchableOpacity
        onPress={() => navigation.navigate("NewContactScreen")}
        activeOpacity={0.85}
        className="flex-row items-center mx-4 mb-4 px-4 py-3 rounded-xl"
        style={{
          backgroundColor:
            applied === "dark"
              ? "#6B82FF" // softer bluish for dark
              : "rgba(74, 97, 209, 0.15)", // light lavender for light theme
        }}
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{
            backgroundColor:
              applied === "dark"
                ? "rgba(255,255,255,0.15)" // subtle white tint
                : "rgba(74, 97, 209, 0.25)", // soft bluish tint
          }}
        >
          <Feather
            name="user-plus"
            size={20}
            color={applied === "dark" ? "#FFFFFF" : "#4A61D1"}
          />
        </View>

        <Text
          className="text-base font-semibold ml-3"
          style={{
            color: applied === "dark" ? "#FFFFFF" : "#4A61D1",
          }}
        >
          Add someone to your contacts
        </Text>
      </TouchableOpacity>

      {/* Contact List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-12 items-center">
            <Ionicons
              name="people-outline"
              size={64}
              color={applied === "dark" ? "#6B7280" : "#9CA3AF"}
            />
            <Text className="mt-4 text-gray-400 dark:text-gray-500 text-lg">
              {search.length > 0
                ? "No contacts found"
                : "No contacts available"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
