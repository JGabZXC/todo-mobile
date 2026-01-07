import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TodoList } from "../../src/presentation/components/TodoList";
import { useTodoContext } from "../../src/presentation/context/TodoContext";

export default function HomeScreen() {
  const { todos, isLoading } = useTodoContext();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (todos.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.oopsText}>Oops there's no todo</Text>
        <Text style={styles.subText}>Create one?</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/create")}
        >
          <Text style={styles.createButtonText}>Create New Todo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TodoList />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/create")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  oopsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
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
  fabText: {
    fontSize: 32,
    color: "#fff",
    marginTop: -4,
  },
});
