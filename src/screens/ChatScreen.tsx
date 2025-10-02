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
  ImageBackground,
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

    const pattern =
    applied === "dark"
      ? require("../../assets/patternDark.png")
      : require("../../assets/patternLight.png");

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
        {/* Pattern background */}
        <ImageBackground
          source={pattern}
          resizeMode="repeat"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            opacity: applied === "dark" ? 0.18 : 0.12,
          }}
        />
        {/* Chat messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          style={{ flex: 1 }}
        />

        {/* Floating input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingBottom: 12,
            paddingHorizontal: 12,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              backgroundColor: "transparent",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: applied === "dark" ? "#152033" : "#fff",
                borderRadius: 30,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <TextInput
                placeholder="Type a message..."
                placeholderTextColor={applied === "dark" ? "#ADB5BD" : "#6B7280"}
                style={{
                  flex: 1,
                  color: applied === "dark" ? "#fff" : "#222",
                  fontSize: 16,
                  maxHeight: 100,
                }}
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
            </View>
            <TouchableOpacity
              onPress={sendMessage}
              disabled={message.trim() === ""}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor:
                  message.trim() === ""
                    ? applied === "dark"
                      ? "#2d3748"
                      : "#e5e7eb"
                    : applied === "dark"
                    ? "#6B82FF"
                    : "#4A61D1",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <MaterialIcons
                name="send"
                size={22}
                color={message.trim() === "" ? "#9CA3AF" : "#fff"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
