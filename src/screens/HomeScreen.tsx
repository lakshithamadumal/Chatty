import {
  View,
  Text,
  StatusBar,
  Pressable,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { useTheme } from "../theme/ThemeProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatar: string;
}

const mockChats: ChatItem[] = [
  {
    id: "1",
    name: "Lakshitha Madumal",
    lastMessage: "How you doing? Let's catch up sometime this week.",
    timestamp: "Today",
    unreadCount: 1,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Amal Perera",
    lastMessage: "Let's catch up later.",
    timestamp: "22/9",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

export default function HomeScreen() {
  const { applied } = useTheme();
  const [search, setSearch] = useState("");

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity className="flex-row items-center py-4 px-4 border-b border-gray-100 dark:border-gray-800">
      <View className="relative">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
        {item.unreadCount ? (
          <View className="absolute -top-1 -right-1 bg-[#D2D5F9] dark:bg-[#4A61D1] rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-[#001A83] dark:text-white text-xs font-semibold">
              {item.unreadCount}
            </Text>
          </View>
        ) : null}
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {item.lastMessage.length > 35
            ? item.lastMessage.slice(0, 35) + "..."
            : item.lastMessage}
        </Text>
      </View>
      <Text className="text-xs text-gray-400 dark:text-gray-500">
        {item.timestamp}
      </Text>
    </TouchableOpacity>
  );

  // Search filter
  const filteredChats = mockChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0f1828]">
      <StatusBar hidden={true} />

      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Chats
        </Text>
        <Pressable className="p-2">
          <MaterialIcons
            name="menu"
            size={24}
            color={applied === "dark" ? "#F1F5F9" : "#0F1828"}
          />
        </Pressable>
      </View>

      <View className="px-4 pb-4">
        <View className="flex-row items-center bg-[#F7F7FC] dark:bg-[#152033] rounded-lg px-3 py-2">
          <Feather
            name="search"
            size={20}
            color={applied === "dark" ? "#ADB5BD" : "#ADB5BD"}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={applied === "dark" ? "#ADB5BD" : "#ADB5BD"}
            className="flex-1 ml-2 text-gray-900 dark:text-gray-100"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-gray-400 dark:text-gray-500 text-base">
              No chats found.
            </Text>
          </View>
        }
      />

      <View className="absolute bottom-6 right-6">
        <Pressable className="w-14 h-14 bg-[#4A61D1] dark:bg-[#6B82FF] rounded-full items-center justify-center shadow-lg">
          <MaterialIcons name="chat" size={24} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
