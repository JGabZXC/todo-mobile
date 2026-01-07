import { Stack } from "expo-router";
import { TodoProvider } from "../src/presentation/context/TodoContext";

export default function RootLayout() {
  return (
    <TodoProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f5f5f5" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#f5f5f5" },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            presentation: "modal",
            title: "New Todo",
          }}
        />
        <Stack.Screen
          name="create-list"
          options={{
            presentation: "modal",
            title: "New List",
          }}
        />
        <Stack.Screen
          name="list/[id]"
          options={{
            title: "List View",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </TodoProvider>
  );
}
