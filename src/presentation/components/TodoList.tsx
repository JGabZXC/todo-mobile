import React from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTodoContext } from "../context/TodoContext";
import { TodoItem } from "./TodoItem";

interface Props {
  listId?: string;
}

export const TodoList = ({ listId }: Props) => {
  const { todos, lists, isLoading } = useTodoContext();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const filteredTodos = listId
    ? todos.filter((t) => t.listId === listId)
    : todos;

  if (filteredTodos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No tasks yet.</Text>
      </View>
    );
  }

  const relevantLists = listId ? lists.filter((l) => l.id === listId) : lists;

  const sections = relevantLists
    .map((list) => {
      const listTodos = filteredTodos.filter((t) => t.listId === list.id);
      return {
        title: list.name,
        data: listTodos,
      };
    })
    .filter((section) => section.data.length > 0);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TodoItem todo={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#9E9E9E",
    fontWeight: "500",
  },
  headerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
    letterSpacing: 0.5,
  },
});
