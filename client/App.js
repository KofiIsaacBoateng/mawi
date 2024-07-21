import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./src/navigation/index";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import GlobalState from "./src/context/GlobalState";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaProvider style={{ flex: 1 }}>
        <NavigationContainer>
          <GlobalState>
            <AppNavigation />
            <Toast />
          </GlobalState>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
}
