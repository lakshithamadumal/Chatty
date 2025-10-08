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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useRef, useMemo } from "react";
import { RootStack } from "../../App";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useSingleChat } from "../socket/UseSingleChat";
import { useSendChat } from "../socket/UseSendChat";
import { Chat, User } from "../socket/chat";
import { formatChatTime } from "../Util/DateFomatter";

// Local UI helpers are derived from the Chat model returned by the socket hook


type SingleChattProps = NativeStackScreenProps<RootStack, "SingleChatScreen">;

export default function SingleChatScreen({
  route,
  navigation,
}: SingleChattProps) {
  const { chatId, friendName, lastSeenTime, profileImage } = route.params;

  const { messages, friend, sendToFriend } = useSingleChat(chatId);
  const sendChat = useSendChat();
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);

  const { applied } = useTheme();
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList<Chat>>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [selectedMessageText, setSelectedMessageText] = useState<string>("");
  const [selectedMessageSender, setSelectedMessageSender] = useState<
    "me" | "friend"
  >("me");

  const sendMessage = () => {
    if (message.trim() === "") return;
    try {
      console.log("Sending message:", {
        toFriendId: chatId,
        content: message.trim(),
      });
      sendChat(chatId, message.trim());
    } catch (e) {}
    setMessage("");
  };

  const handleDeleteMessage = (
    messageId: string,
    messageText: string,
    sender: "me" | "friend"
  ) => {
    setSelectedMessageId(messageId);
    setSelectedMessageText(messageText);
    setSelectedMessageSender(sender);
    setShowDeleteModal(true);
  };

  const deleteForMe = () => {
    // Log delete for me with message id
    try {
      console.log("Delete for me requested:", { messageId: selectedMessageId });
    } catch (e) {}
    // Deletion can be implemented via websocket action; for now just close modal
    closeDeleteModal();
    try {
      console.log("Deleted message (for me):", { messageId: selectedMessageId });
    } catch (e) {}
  };

  const deleteForEveryone = () => {
    // Log delete for everyone with message id
    try {
      console.log("Delete for everyone requested:", {
        messageId: selectedMessageId,
      });
    } catch (e) {}
    // Deletion can be implemented via websocket action; for now just close modal
    closeDeleteModal();
    try {
      console.log("Deleted message (for everyone):", {
        messageId: selectedMessageId,
      });
    } catch (e) {}
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedMessageId(null);
    setSelectedMessageText("");
  };

  const renderMessage = ({ item }: { item: Chat }) => {
    const isFromFriend = item.from.id === chatId;
    const messageText = (item as any).message ?? item.lastMessage;
    const timeText = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const syntheticId = `${item.createdAt}-${item.from.id}`;

    return (
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={500}
        onLongPress={() =>
          handleDeleteMessage(
            syntheticId,
            messageText,
            isFromFriend ? "friend" : "me"
          )
        }
        className={`flex-row px-4 py-1 ${isFromFriend ? "justify-start" : "justify-end"}`}
      >
        <View
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isFromFriend
              ? "bg-[#F0F2F5] dark:bg-[#152033] rounded-bl-md"
              : "bg[#4A61D1] dark:bg-[#6B82FF] rounded-br-md".replace(
                  "bg[",
                  "bg-["
                )
          }`}
        >
          <Text
            className={`text-base ${
              isFromFriend ? "text-gray-900 dark:text-gray-100" : "text-white"
            }`}
          >
            {messageText}
          </Text>
          <View className="flex-row items-center justify-end mt-1 space-x-1">
            <Text
              className={`text-xs ${
                isFromFriend ? "text-gray-400 dark:text-gray-500" : "text-blue-100"
              }`}
            >
              {timeText}
            </Text>
            {!isFromFriend && item.status && (
              (() => {
                const normalized = String(item.status).toUpperCase();
                const isRead = normalized === "READ";
                const isDelivered = normalized === "DELIVERED";
                const iconName = isDelivered || isRead ? ("checkmark-done" as const) : ("checkmark" as const);
                const iconColor = isRead
                  ? (applied === "dark" ? "#BFD1FF" : "#4A61D1")
                  : (applied === "dark" ? "#64748B" : "#9CA3AF");
                return (
                  <Ionicons name={iconName} size={14} color={iconColor} />
                );
              })()
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const pattern =
    applied === "dark"
      ? require("../../assets/patternDark.png")
      : require("../../assets/patternLight.png");

  const headerSubtitle = (() => {
    if (friend?.status === "ONLINE") {
      return "Online";
    }
    const last = friend?.updatedAt ?? lastSeenTime;
    if (!last) return "";
    return `Last seen ${formatChatTime(last)}`;
  })();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0f1828]">
      <StatusBar
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor={applied === "dark" ? "#0f1828" : "#ffffff"}
      />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1828]">
        <View className="flex-row items-center">
          <Pressable className="mr-4" onPress={() => navigation.goBack()}>
            <Feather
              name="arrow-left"
              size={24}
              color={applied === "dark" ? "#F1F5F9" : "#0F1828"}
            />
          </Pressable>
          <View className="flex-row items-center">
            <Image
              source={{
                uri: profileImage,
              }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {friendName}
              </Text>
              {headerSubtitle !== "" && (
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {headerSubtitle}
                </Text>
              )}
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

      {/* Messages + Pattern BG */}
      <View className="flex-1 bg-[#F7F7FC] dark:bg-[#0A1427]">
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
        <FlatList
          ref={flatListRef}
          data={sortedMessages}
          keyExtractor={(item) => `${item.createdAt}-${item.from.id}`}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      </View>

      {/* Input */}
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
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
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

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View
            className={`w-full rounded-t-3xl ${
              applied === "dark" ? "bg-[#1e293b]" : "bg-white"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <View
              className={`p-4 border-b ${
                applied === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <Text
                className={`text-center text-sm ${
                  applied === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Delete this message?
              </Text>
              <View
                className={`mt-3 p-3 rounded-lg ${
                  applied === "dark" ? "bg-[#152033]" : "bg-[#F0F2F5]"
                }`}
              >
                <Text
                  className={`text-base ${
                    applied === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {selectedMessageText}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={deleteForMe}
              className={`py-4 border-b ${
                applied === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <Text className="text-center text-red-500 text-lg font-semibold">
                Delete for Me
              </Text>
            </TouchableOpacity>

            {selectedMessageSender === "me" && (
              <TouchableOpacity
                onPress={deleteForEveryone}
                className={`py-4 border-b ${
                  applied === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <Text className="text-center text-red-500 text-lg font-semibold">
                  Delete for Everyone
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={closeDeleteModal} className="py-4">
              <Text
                className={`text-center text-lg ${
                  applied === "dark" ? "text-blue-400" : "text-blue-500"
                }`}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <View className="pb-6" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
