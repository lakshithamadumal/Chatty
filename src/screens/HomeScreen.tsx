import {
  View,
  Text,
  StatusBar,
  Pressable,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { useTheme } from "../theme/ThemeProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useRef, useState } from "react";
import { RootStack } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useChatList } from "../socket/UseChatList";
import InitialsAvatar from "../components/InitialsAvatar";
import { formatChatTime, formatChatListTime } from "../Util/DateFomatter";

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

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Animations for modern iOS-style dropdown
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(0.96)).current;

  const openMenu = () => {
    setIsModalVisible(true);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(menuScale, {
          toValue: 1,
          damping: 16,
          stiffness: 180,
          mass: 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacity, {
          toValue: 1,
          duration: 140,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue: 0,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 0.96,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsModalVisible(false);
      }
    });
  };

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
        <InitialsAvatar
          name={item.name}
          uri={item.avatar}
          size={48}
          className="w-12 h-12"
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
        {formatChatListTime(item.timestamp)}
      </Text>
    </TouchableOpacity>
  );

  // Sort by most recent timestamp (newest first)
  const sortedChats = [...adaptedChats].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Search filter (preserves sorted order)
  const filteredChats = sortedChats.filter((chat) => {
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
        <Pressable
          className="p-2"
          onPress={openMenu}
        >
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
          onPress={() => navigation.navigate("NewChatScreen")}
        >
          <MaterialIcons name="edit" size={24} color="white" />
        </Pressable>
      </View>

      {/* iOS-style dropdown menu */}
      <Modal
        animationType="none"
        transparent
        visible={isModalVisible}
        onRequestClose={closeMenu}
      >
        <Pressable
          onPress={closeMenu}
          style={{ flex: 1 }}
        >
          {/* Backdrop with animated opacity */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              inset: 0 as any,
              backgroundColor: "rgba(0,0,0,0.18)",
              opacity: backdropOpacity,
            }}
          />
          <View
            pointerEvents="box-none"
            style={{
              flex: 1,
            }}
          >
            {/* container aligned to top-right under header */}
            <Animated.View
              style={{
                position: "absolute",
                top: 56, // adjust if header height differs
                right: 12,
                width: 200,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: applied === "dark" ? "#0b1220" : "#ffffff",
                shadowColor: "#000",
                shadowOpacity: applied === "dark" ? 0.35 : 0.12,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 12,
                borderWidth: applied === "dark" ? 0.5 : 0.5,
                borderColor: applied === "dark" ? "rgba(255,255,255,0.03)" : "rgba(15,24,40,0.04)",
                opacity: menuOpacity,
                transform: [{ scale: menuScale }],
              }}
            >
              {/* small top indicator like iOS popover */}
              <View
                style={{
                  position: "absolute",
                  top: -8,
                  right: 20,
                  width: 16,
                  height: 8,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    borderLeftWidth: 8,
                    borderRightWidth: 8,
                    borderBottomWidth: 8,
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderBottomColor: applied === "dark" ? "#0b1220" : "#ffffff",
                    transform: [{ translateY: 0 }],
                  }}
                />
              </View>

              <Pressable
                onPress={() => {
                  closeMenu();
                  navigation.navigate("ProfileScreen");
                }}
                android_ripple={{ color: applied === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.06)" }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Feather
                  name="user"
                  size={18}
                  color={applied === "dark" ? "#F1F5F9" : "#0F172A"}
                />
                <Text style={{ color: applied === "dark" ? "#F1F5F9" : "#0F172A", fontSize: 15 }}>
                  Profile
                </Text>
              </Pressable>

              <View
                style={{
                  height: 1,
                  backgroundColor: applied === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,24,40,0.04)",
                }}
              />

              <Pressable
                onPress={() => {
                  closeMenu();
                  navigation.navigate("SettingScreen");
                }}
                android_ripple={{ color: applied === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.06)" }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Feather
                  name="settings"
                  size={18}
                  color={applied === "dark" ? "#94A3B8" : "#374151"}
                />
                <Text style={{ color: applied === "dark" ? "#94A3B8" : "#374151", fontSize: 15 }}>
                  Setting
                </Text>
              </Pressable>

              <View
                style={{
                  height: 1,
                  backgroundColor: applied === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,24,40,0.04)",
                }}
              />

              <Pressable
                onPress={() => {
                  console.log("Logout pressed");
                  closeMenu();
                  navigation.replace("SplashScreen");
                }}
                android_ripple={{ color: "rgba(239,68,68,0.06)" }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <MaterialIcons name="logout" size={18} color="#ef4444" />
                <Text style={{ color: "#ef4444", fontSize: 15 }}>Logout</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
