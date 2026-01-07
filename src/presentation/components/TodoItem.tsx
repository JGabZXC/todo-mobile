import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SubTodo, Todo } from "../../domain/models/Todo";
import { useTodoContext } from "../context/TodoContext";

interface Props {
  todo: Todo;
}

export const TodoItem = ({ todo }: Props) => {
  const { toggleTodo, removeTodo, addSubTodo, toggleSubTodo } =
    useTodoContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [subTodoText, setSubTodoText] = useState("");

  const handleAddSubTodo = async () => {
    if (!subTodoText.trim()) return;
    await addSubTodo(todo.id, subTodoText);
    setSubTodoText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <TouchableOpacity
          onPress={() => toggleTodo(todo)}
          style={styles.checkboxTouch}
        >
          <MaterialIcons
            name={todo.isCompleted ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={todo.isCompleted ? "#4CAF50" : "#757575"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, todo.isCompleted && styles.completedText]}
            >
              {todo.title}
            </Text>
          </View>

          <View style={styles.metaContainer}>
            {todo.subTodos.length > 0 && (
              <Text style={styles.subTaskCount}>
                {todo.subTodos.filter((st) => st.isCompleted).length}/
                {todo.subTodos.length}
              </Text>
            )}
            <MaterialIcons
              name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={24}
              color="#9e9e9e"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => removeTodo(todo.id)}
          style={styles.deleteButton}
        >
          <MaterialIcons name="delete-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.detailsContainer}>
          {todo.remarks ? (
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksLabel}>REMARKS</Text>
              <Text style={styles.remarksText}>{todo.remarks}</Text>
            </View>
          ) : null}

          <View style={styles.subTodosContainer}>
            <Text style={styles.subTodosHeader}>Subtasks</Text>
            {todo.subTodos.length === 0 && (
              <Text style={styles.emptySubTodos}>No subtasks yet</Text>
            )}
            {todo.subTodos.map((sub: SubTodo) => (
              <TouchableOpacity
                key={sub.id}
                style={styles.subTodoRow}
                onPress={() => toggleSubTodo(todo.id, sub.id)}
              >
                <MaterialIcons
                  name={
                    sub.isCompleted ? "check-box" : "check-box-outline-blank"
                  }
                  size={20}
                  color={sub.isCompleted ? "#4CAF50" : "#BDBDBD"}
                />
                <Text
                  style={[
                    styles.subTodoText,
                    sub.isCompleted && styles.completedText,
                  ]}
                >
                  {sub.description}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.addSubTodoRow}>
              <TextInput
                style={styles.subTodoInput}
                placeholder="Add a new subtask..."
                value={subTodoText}
                onChangeText={setSubTodoText}
                onSubmitEditing={handleAddSubTodo}
              />
              <TouchableOpacity
                onPress={handleAddSubTodo}
                disabled={!subTodoText.trim()}
              >
                <MaterialIcons
                  name="add-circle"
                  size={28}
                  color={subTodoText.trim() ? "#007AFF" : "#E0E0E0"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxTouch: {
    paddingRight: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  titleContainer: {
    flex: 1,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#BDBDBD",
  },
  subTaskCount: {
    fontSize: 12,
    color: "#757575",
    marginRight: 4,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  deleteButton: {
    paddingLeft: 12,
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  remarksContainer: {
    marginBottom: 16,
    backgroundColor: "#FFFBE6",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFF1B8",
  },
  remarksLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FAAD14",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  remarksText: {
    fontSize: 14,
    color: "#595959",
    lineHeight: 20,
  },
  subTodosContainer: {},
  subTodosHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9E9E9E",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subTodoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  subTodoText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#424242",
  },
  emptySubTodos: {
    fontSize: 14,
    color: "#BDBDBD",
    fontStyle: "italic",
    marginBottom: 12,
  },
  addSubTodoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  subTodoInput: {
    flex: 1,
    fontSize: 15,
    padding: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
});
