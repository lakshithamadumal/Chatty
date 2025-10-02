import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./src/screens/ChatsScreen";
import StatusScreen from "./src/screens/StatusScreen";
import CallsScreen from "./src/screens/CallsScreen";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Chats" component={ChatsScreen} />
      <Tabs.Screen name="Status" component={StatusScreen} />
      <Tabs.Screen name="Calls" component={CallsScreen} />
    </Tabs.Navigator>
  );
}
