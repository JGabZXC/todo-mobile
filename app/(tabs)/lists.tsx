import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTodoContext } from "../../src/presentation/context/TodoContext";

export default function ListsScreen() {
  const { lists, todos } = useTodoContext();
  const router = useRouter();

  const getCount = (listId: string) =>
    todos.filter((t) => t.listId === listId && !t.isCompleted).length;

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
              router.push({
                pathname: "/list/[id]",
                params: { id: item.id, name: item.name },
              })
            }
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="folder" size={24} color="#007AFF" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.listMeta}>
                {getCount(item.id)} active tasks
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No lists created yet.</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/create-list")}
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
  listContent: {
    padding: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  listMeta: {
    fontSize: 13,
    color: "#888",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});
