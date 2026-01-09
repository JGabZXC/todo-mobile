import { HomeScreen } from "@/src/presentation/features/groups/screens/HomeScreen";
import DebugModal from "@/src/presentation/shared/components/DebugModal";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />

      {__DEV__ && <DebugModal />}
    </View>
  );
}
