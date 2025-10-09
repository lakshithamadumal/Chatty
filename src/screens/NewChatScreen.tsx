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
  Image,
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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View className="items-center flex-row gap-x-2">
          <TouchableOpacity
            className="justify-center items-center p-1"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons
              name="arrow-back-sharp"
              size={24}
              color={applied === "dark" ? "#F1F5F9" : "#0F1828"}
            />
          </TouchableOpacity>
          <View className="flex-col">
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Select Contact
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {users.length} contacts
            </Text>
          </View>
        </View>
      ),
      headerRight: () => <View></View>,
    });
  }, [navigation, users, applied]);

  // Simulate loading state
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      className="flex-row items-center py-4 px-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1828]"
      onPress={() => {
        navigation.replace("SingleChatScreen", {
          chatId: item.id,
          friendName: `${item.firstName} ${item.lastName}`,
          lastSeenTime: item.updatedAt,
          profileImage: item.profileImage,
        });
      }}
      activeOpacity={0.7}
    >
      <View className="relative">
        <InitialsAvatar
          name={`${item.firstName} ${item.lastName}`}
          uri={item.profileImage}
          size={48}
          className="w-12 h-12"
        />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {item.status === "ACTIVE"
            ? "Already in Friend List • Message Now"
            : "Hey there! I am using Chatty"}
        </Text>
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {item.countryCode}
          {item.contactNo}
        </Text>
      </View>
      <View className="items-center">
        <Ionicons
          name="chevron-forward"
          size={20}
          color={applied === "dark" ? "#6B7280" : "#9CA3AF"}
        />
      </View>
    </TouchableOpacity>
  );
  const filteredUsers = [...users]
    .filter((user) => {
      const searchTerm = search.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.contactNo.includes(search) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      // Sort by status first (ACTIVE users first), then by name
      if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
      if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1;
      return a.firstName.localeCompare(b.firstName);
    });

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-[#0f1828]"
        edges={["right", "bottom", "left"]}
      >
        <StatusBar hidden={false} translucent={true} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4A61D1" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
            Loading contacts...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-[#0f1828]"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar hidden={false} translucent={true} />

      {/* Background decorations */}
      <View className="absolute top-10 right-0 w-40 h-40">
        <View className="absolute -top-20 -right-20 w-60 h-60 bg-[#4A61D1] dark:bg-[#6B82FF] rounded-full opacity-10" />
      </View>

      <View className="flex-1">
        {/* Search Bar */}
        <View className="px-4 pb-4 pt-2">
          <View className="flex-row items-center bg-[#F7F7FC] dark:bg-[#152033] rounded-lg px-3 py-3">
            <Ionicons
              name="search"
              size={20}
              color={applied === "dark" ? "#ADB5BD" : "#ADB5BD"}
            />
            <TextInput
              className="flex-1 ml-2 text-gray-900 dark:text-gray-100 text-base"
              placeholder="Search contacts..."
              placeholderTextColor={applied === "dark" ? "#ADB5BD" : "#ADB5BD"}
              value={search}
              onChangeText={(text) => setSearch(text)}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")} className="p-1">
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={applied === "dark" ? "#ADB5BD" : "#ADB5BD"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* New Contact Button */}
        <View className="px-4 pb-4">
          <TouchableOpacity
            className="flex-row items-center bg-[#4A61D1] dark:bg-[#6B82FF] rounded-lg px-4 py-3"
            onPress={() => navigation.navigate("NewContactScreen")}
            activeOpacity={0.8}
          >
            <View className="bg-white/20 items-center justify-center w-10 h-10 rounded-full">
              <Feather name="user-plus" size={20} color="white" />
            </View>
            <Text className="text-white text-lg font-semibold ml-3">
              Add New Contact
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contacts List */}
        <View className="flex-1">
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center mt-10 px-4">
                <Ionicons
                  name="people-outline"
                  size={64}
                  color={applied === "dark" ? "#6B7280" : "#9CA3AF"}
                />
                <Text className="text-gray-400 dark:text-gray-500 text-lg mt-4 text-center">
                  {search.length > 0
                    ? "No contacts found matching your search"
                    : "No contacts available"}
                </Text>
                {search.length === 0 && (
                  <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2 text-center">
                    Add contacts to start chatting
                  </Text>
                )}
              </View>
            }
            ListHeaderComponent={
              filteredUsers.length > 0 ? (
                <View className="px-4 py-2">
                  <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {filteredUsers.length} contact
                    {filteredUsers.length !== 1 ? "s" : ""} found
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
