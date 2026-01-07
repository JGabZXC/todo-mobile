import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TodoList } from "../../src/presentation/components/TodoList";
import { useTodoContext } from "../../src/presentation/context/TodoContext";

export default function ListDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const { lists } = useTodoContext();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: (name as string) || "List Details" }} />
      <TodoList listId={id as string} />
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({ pathname: "/create", params: { listId: id } })
        }
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 50, // Moved up to avoid bottom navigation/back button
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});
