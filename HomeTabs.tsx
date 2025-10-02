import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Platform } from "react-native";
import ChatsScreen from "./src/screens/ChatsScreen";
import StatusScreen from "./src/screens/StatusScreen";
import CallsScreen from "./src/screens/CallsScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "./src/theme/ThemeProvider";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  const { applied } = useTheme();

  const getTabBarIcon = (
    routeName: string,
    focused: boolean,
    color: string
  ) => {
    const iconSize = 24;

    switch (routeName) {
      case "Chats":
        return focused ? (
          <View className="items-center justify-center">
            <Ionicons name="chatbubble" size={iconSize} color={color} />
            <View className="w-1 h-1 bg-blue-500 rounded-full mt-1" />
          </View>
        ) : (
          <Ionicons name="chatbubble-outline" size={iconSize} color={color} />
        );
      case "Status":
        return focused ? (
          <View className="items-center justify-center">
            <MaterialIcons name="photo-filter" size={iconSize} color={color} />
            <View className="w-1 h-1 bg-green-500 rounded-full mt-1" />
          </View>
        ) : (
          <MaterialIcons name="photo-filter" size={iconSize} color={color} />
        );
      case "Calls":
        return focused ? (
          <View className="items-center justify-center">
            <Ionicons name="call" size={iconSize} color={color} />
            <View className="w-1 h-1 bg-purple-500 rounded-full mt-1" />
          </View>
        ) : (
          <Ionicons name="call-outline" size={iconSize} color={color} />
        );
      default:
        return null;
    }
  };

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return getTabBarIcon(route.name, focused, color);
        },
        tabBarStyle: {
          backgroundColor: applied === "dark" ? "#0f1828" : "#ffffff",
          borderTopColor: applied === "dark" ? "#1e293b" : "#e2e8f0",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: applied === "dark" ? 0.1 : 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: applied === "dark" ? "#6B82FF" : "#2563eb",
        tabBarInactiveTintColor: applied === "dark" ? "#64748b" : "#94a3b8",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: applied === "dark" ? "#0f1828" : "#ffffff",
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTitleStyle: {
          color: applied === "dark" ? "#f1f5f9" : "#0f172a",
          fontWeight: "bold",
        },
        headerTintColor: applied === "dark" ? "#6B82FF" : "#2563eb",
      })}
    >
      <Tabs.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Chats",
        }}
      />
      <Tabs.Screen
        name="Status"
        component={StatusScreen}
        options={{
          headerTitle: "Status",
          tabBarLabel: "Status",
        }}
      />
      <Tabs.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          headerTitle: "Calls",
          tabBarLabel: "Calls",
        }}
      />
    </Tabs.Navigator>
  );
}
