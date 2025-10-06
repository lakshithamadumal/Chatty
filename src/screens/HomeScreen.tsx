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
import { RootStack } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../Util/DateFomatter";

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatar: string;
}

type HomeProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeProps>();
  const { applied } = useTheme();
  const [search, setSearch] = useState("");

  const chatList = useChatList();

  // Adapt socket Chat model to local ChatItem shape expected by the UI
  const adaptedChats: ChatItem[] = chatList.map((chat) => ({
    id: String(chat.friendId),
    name: chat.friendName,
    lastMessage: chat.lastMessage,
    timestamp: chat.lastTimeStamp,
    unreadCount: chat.unreadCount,
    avatar: chat.profileImage,
  }));

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      className="flex-row items-center py-4 px-4 border-b border-gray-100 dark:border-gray-800"
      onPress={() => {
        navigation.navigate("SingleChatScreen", {
          chatId: Number(item.id),
          friendName: item.name,
          lastSeenTime: formatChatTime(item.timestamp),
          profileImage: item.avatar,
        });
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
        {(item.unreadCount ?? 0) > 0 && (
          <View className="absolute -top-1 -right-1 bg-[#D2D5F9] dark:bg-[#4A61D1] rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-[#001A83] dark:text-white text-xs font-semibold">
              {item.unreadCount ?? 0}
            </Text>
          </View>
        )}
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
        {formatChatTime(item.timestamp)}
      </Text>
    </TouchableOpacity>
  );

  // Search filter
  const filteredChats = adaptedChats.filter((chat) => {
    return (
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0f1828]">
      <StatusBar hidden={true} />

      <View className="absolute top-10 right-0 w-40 h-40">
        <View className="absolute -top-20 -right-20 w-60 h-60 bg-[#4A61D1] dark:bg-[#6B82FF] rounded-full opacity-10" />
      </View>

      <View className="absolute bottom-0 left-0 w-60 h-60">
        <View className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#4A61D1] dark:bg-[#6B82FF] rounded-full opacity-5" />
      </View>

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
        <Pressable
          className="w-16 h-16 bg-[#4A61D1] dark:bg-[#6B82FF] rounded-full items-center justify-center shadow-xl"
          style={{
            shadowColor: "#4A61D1",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <MaterialIcons name="edit" size={24} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
