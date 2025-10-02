import {
  View,
  Text,
  StatusBar,
  Pressable,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useRef } from "react";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    isSent: false,
    isRead: true,
  },
  {
    id: "2",
    text: "I'm good! Just finished work. How about you?",
    timestamp: "10:32 AM",
    isSent: true,
    isRead: true,
  },
];

export default function ChatScreen() {
  const { applied } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSent: true,
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Auto reply after 2 seconds
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sounds good! Looking forward to it 👋",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSent: false,
        isRead: false,
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 2000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row px-4 py-1 ${
        item.isSent ? "justify-end" : "justify-start"
      }`}
    >
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          item.isSent
            ? "bg-[#4A61D1] dark:bg-[#6B82FF] rounded-br-md"
            : "bg-[#F0F2F5] dark:bg-[#152033] rounded-bl-md"
        }`}
      >
        <Text
          className={`text-base ${
            item.isSent ? "text-white" : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {item.text}
        </Text>
        <View className="flex-row items-center justify-end mt-1 space-x-1">
          <Text
            className={`text-xs ${
              item.isSent ? "text-blue-100" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {item.timestamp}
          </Text>
          {item.isSent && (
            <Ionicons
              name={item.isRead ? "checkmark-done" : "checkmark"}
              size={14}
              color={item.isSent ? "#BFD1FF" : "#9CA3AF"}
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0f1828]">
      <StatusBar
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor={applied === "dark" ? "#0f1828" : "#ffffff"}
      />

      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1828]">
        <View className="flex-row items-center">
          <Pressable className="mr-4">
            <Feather
              name="arrow-left"
              size={24}
              color={applied === "dark" ? "#F1F5F9" : "#0F1828"}
            />
          </Pressable>
          <View className="flex-row items-center">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
              }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Lakshitha Madumal
              </Text>
              <Text className="text-sm text-green-500 dark:text-green-400">
                Online
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center space-x-4">
          <Pressable>
            <MaterialIcons
              name="more-vert"
              size={24}
              color={applied === "dark" ? "#F1F5F9" : "#0F1828"}
            />
          </Pressable>
        </View>
      </View>

      <View className="flex-1 bg-[#F7F7FC] dark:bg-[#0A1427]">
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="flex-row items-center px-4 py-3 bg-white dark:bg-[#0f1828] border-t border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center flex-1 bg-[#F7F7FC] dark:bg-[#152033] rounded-full px-4 py-3 mr-3">
            <Pressable className="mr-3">
              <Feather
                name="plus"
                size={20}
                color={applied === "dark" ? "#ADB5BD" : "#6B7280"}
              />
            </Pressable>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor={applied === "dark" ? "#ADB5BD" : "#6B7280"}
              className="flex-1 text-gray-900 dark:text-gray-100 text-base"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            onPress={sendMessage}
            disabled={message.trim() === ""}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              message.trim() === ""
                ? "bg-gray-300 dark:bg-gray-700"
                : "bg-[#4A61D1] dark:bg-[#6B82FF]"
            }`}
          >
            <MaterialIcons
              name="send"
              size={20}
              color={message.trim() === "" ? "#9CA3AF" : "white"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
