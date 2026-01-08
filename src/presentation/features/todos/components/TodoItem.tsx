import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ToDo } from "../../../../domain/entities/ToDo";

interface TodoItemProps {
  todo: ToDo;
  onPress: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

export function TodoItem({ todo, onPress, onToggleComplete }: TodoItemProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
      ]}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggleComplete(todo.id)}
      >
        {todo.completed === 1 ? (
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
        ) : (
          <MaterialIcons
            name="check-circle-outline"
            size={24}
            color={colors.text}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.content} onPress={() => onPress(todo.id)}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            todo.completed === 1 && styles.completedText,
          ]}
        >
          {todo.title}
        </Text>
        {todo.description && (
          <Text style={styles.description} numberOfLines={1}>
            {todo.description}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkbox: {
    padding: 8,
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  description: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
