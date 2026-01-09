import { LocalDatabase } from "@/src/data/sources/LocalDatabase";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const activeTheme = isDark ? DarkTheme : DefaultTheme;
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        await LocalDatabase.init();
        setDbInitialized(true);
      } catch (e) {
        console.error("Failed to initialize database", e);
      }
    };

    initDb();
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={activeTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="group/[id]" options={{ title: "Group Details" }} />
      </Stack>
    </ThemeProvider>
  );
}
