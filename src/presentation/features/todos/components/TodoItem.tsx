import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ToDo } from "../../../../domain/entities/ToDo";
import { styles } from "./TodoItemStyles";

interface TodoItemProps {
  todo: ToDo;
  onPress: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

export function TodoItem({ todo, onPress, onToggleComplete }: TodoItemProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
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
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              todo.completed === 1 && styles.completedText,
            ]}
          >
            {todo.title}
          </Text>
          {todo.total_subtodos !== undefined && todo.total_subtodos > 0 && (
            <Text style={styles.subTodoCount}>
              ({todo.completed_subtodos}/{todo.total_subtodos})
            </Text>
          )}
        </View>
        {todo.description && (
          <Text style={styles.description} numberOfLines={1}>
            {todo.description.length > 50
              ? todo.description.slice(0, 50) + "..."
              : todo.description}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
