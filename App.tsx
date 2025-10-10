import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SettingScreen from "./src/screens/SettingScreen";
import ContactScreen from "./src/screens/ContactScreen";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { UserRegistrationProvider } from "./src/components/UserContext";
import HomeTabs from "./HomeTabs";
import ChatScreen from "./src/screens/SingleChatScreen";
import SingleChatScreen from "./src/screens/SingleChatScreen";
import { WebSocketProvider } from "./src/socket/WebSocketProvider";
import NewChatScreen from "./src/screens/NewChatScreen";
import { useWebSocketPing } from "./src/socket/UseWebSocketPing";
import { AuthContext, AuthProvider } from "./src/components/AuthProvider";
import { useContext } from "react";
import InfoScreen from "./src/screens/InfoScreen";

export type RootStack = {
  SplashScreen: undefined;
  InfoScreen: undefined;
  ContactScreen: undefined;
  SignUpScreen: undefined;
  LoginScreen: undefined;
  HomeScreen: undefined;
  ProfileScreen: undefined;
  SettingScreen: undefined;
  SingleChatScreen: {
    chatId: number;
    friendName: string;
    lastSeenTime: string;
    profileImage: string;
  };
  NewChatScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStack>();

function Chatty() {
  const auth = useContext(AuthContext);
  return (
    <WebSocketProvider userId={1}>
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="HomeScreen"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="InfoScreen" component={InfoScreen} />
              <Stack.Screen name="ContactScreen" component={ContactScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="HomeScreen" component={HomeTabs} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="SettingScreen" component={SettingScreen} />
              <Stack.Screen name="NewChatScreen" component={NewChatScreen} />
              <Stack.Screen
                name="SingleChatScreen"
                component={SingleChatScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    </WebSocketProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Chatty />
    </AuthProvider>
  );
}
