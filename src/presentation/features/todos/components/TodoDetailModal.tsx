import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SubToDo } from "../../../../domain/entities/SubToDo";
import { ToDo } from "../../../../domain/entities/ToDo";
import { ErrorHandler } from "../../../shared/utils/ErrorHandler";
import { useSubTodos } from "../../sub-todos/hooks/useSubTodos";
import { useTodos } from "../hooks/useTodos";
import { styles } from "./TodoDetailModalStyles";

interface TodoDetailModalProps {
  visible: boolean;
  todo: ToDo | null;
  onClose: () => void;
  onTodoUpdated: (updates?: {
    total_subtodos?: number;
    completed_subtodos?: number;
  }) => void;
}

export function TodoDetailModal({
  visible,
  todo,
  onClose,
  onTodoUpdated,
}: TodoDetailModalProps) {
  const { colors } = useTheme();
  const { updateTodo, deleteTodo } = useTodos();
  const { getSubTodosByTodo, createSubTodo, updateSubTodo, deleteSubTodo } =
    useSubTodos();

  const [subTodos, setSubTodos] = useState<SubToDo[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSubTodoTitle, setNewSubTodoTitle] = useState("");

  // Editing Parent Todo
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  // Editing SubTodo
  const [editingSubTodoId, setEditingSubTodoId] = useState<number | null>(null);
  const [editSubTodoTitle, setEditSubTodoTitle] = useState("");

  useEffect(() => {
    if (todo?.id && visible) {
      loadSubTodos();
      setEditTitle(todo.title);
      setIsEditingTitle(false);
      setNewSubTodoTitle("");
    }
  }, [todo?.id, visible]);

  const loadSubTodos = async () => {
    if (!todo) return;
    try {
      setLoading(true);
      const result = await getSubTodosByTodo(todo.id);
      setSubTodos(result);
    } catch (error) {
      ErrorHandler.handle(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodoTitle = async () => {
    if (!todo || !editTitle.trim()) return;
    try {
      if (editTitle !== todo.title) {
        await updateTodo(todo.id.toString(), { title: editTitle });
        onTodoUpdated();
      }
      setIsEditingTitle(false);
    } catch (error) {
      ErrorHandler.handle(error);
    }
  };

  const handleDeleteTodo = () => {
    if (!todo) return;
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo(todo.id.toString());
            onClose();
            onTodoUpdated();
          } catch (error) {
            ErrorHandler.handle(error);
          }
        },
      },
    ]);
  };

  const handleCreateSubTodo = async () => {
    if (!todo || !newSubTodoTitle.trim()) return;
    try {
      await createSubTodo(todo.id, {
        title: newSubTodoTitle,
        completed: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });
      setNewSubTodoTitle("");

      // Refresh list and notify parent
      const updatedSubTodos = await getSubTodosByTodo(todo.id);
      setSubTodos(updatedSubTodos);

      const total = updatedSubTodos.length;
      const completed = updatedSubTodos.filter(
        (st) => st.completed === 1
      ).length;
      onTodoUpdated({ total_subtodos: total, completed_subtodos: completed });
    } catch (error) {
      ErrorHandler.handle(error);
    }
  };

  const handleToggleSubTodo = async (subTodo: SubToDo) => {
    try {
      const newStatus = subTodo.completed === 1 ? 0 : 1;

      // 1. Optimistic Update (Immediate)
      const updatedList = subTodos.map((item) =>
        item.id === subTodo.id ? { ...item, completed: newStatus } : item
      ) as SubToDo[];

      setSubTodos(updatedList);

      const total = updatedList.length;
      const completed = updatedList.filter((st) => st.completed === 1).length;
      onTodoUpdated({ total_subtodos: total, completed_subtodos: completed });

      // 2. Background Database Update
      updateSubTodo(subTodo.id.toString(), {
        completed: newStatus,
      }).catch((error) => {
        ErrorHandler.handle(error);
        // Revert on failure could be implemented here if critical
      });
    } catch (error) {
      ErrorHandler.handle(error);
    }
  };

  // Sub Todo Edit Logic
  const startEditingSubTodo = (subTodo: SubToDo) => {
    setEditingSubTodoId(subTodo.id);
    setEditSubTodoTitle(subTodo.title);
  };

  const cancelEditingSubTodo = () => {
    setEditingSubTodoId(null);
    setEditSubTodoTitle("");
  };

  const saveSubTodoTitle = async (id: number) => {
    if (!editSubTodoTitle.trim()) return;
    try {
      await updateSubTodo(id.toString(), { title: editSubTodoTitle });
      setSubTodos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, title: editSubTodoTitle } : item
        )
      );
      setEditingSubTodoId(null);
    } catch (error) {
      ErrorHandler.handle(error);
    }
  };

  const handleDeleteSubTodo = async (id: number) => {
    try {
      await deleteSubTodo(id.toString());

      const updatedList = subTodos.filter((item) => item.id !== id);
      setSubTodos(updatedList);

      const total = updatedList.length;
      const completed = updatedList.filter((st) => st.completed === 1).length;
      onTodoUpdated({ total_subtodos: total, completed_subtodos: completed });
    } catch (error) {
      ErrorHandler.handle(error);
    }
  };

  const renderSubTodoItem = ({ item }: { item: SubToDo }) => {
    const isEditing = editingSubTodoId === item.id;

    return (
      <View style={styles.subTodoItem}>
        {isEditing ? (
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.subTodoInput, { color: colors.text }]}
              value={editSubTodoTitle}
              onChangeText={setEditSubTodoTitle}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => saveSubTodoTitle(item.id)}
              style={styles.actionButton}
            >
              <Feather name="check" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelEditingSubTodo}
              style={styles.actionButton}
            >
              <Feather name="x" size={20} color={colors.notification} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.subTodoContent}
              onPress={() => handleToggleSubTodo(item)}
            >
              {item.completed === 1 ? (
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              ) : (
                <MaterialIcons
                  name="radio-button-unchecked"
                  size={20}
                  color={colors.text}
                />
              )}
              <Text
                style={[
                  styles.subTodoTitle,
                  { color: colors.text },
                  item.completed === 1 && {
                    textDecorationLine: "line-through",
                    opacity: 0.6,
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>

            <View style={styles.subTodoActions}>
              <TouchableOpacity
                onPress={() => startEditingSubTodo(item)}
                style={styles.actionButton}
              >
                <Feather name="edit-2" size={18} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteSubTodo(item.id)}
                style={styles.actionButton}
              >
                <Feather name="trash-2" size={18} color={colors.notification} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  if (!todo) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={[styles.modalView, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              {isEditingTitle ? (
                <>
                  <TextInput
                    style={[styles.titleInput, { color: colors.text }]}
                    value={editTitle}
                    onChangeText={setEditTitle}
                    autoFocus
                    onSubmitEditing={handleUpdateTodoTitle}
                  />
                  <TouchableOpacity
                    onPress={handleUpdateTodoTitle}
                    style={{ marginLeft: 10 }}
                  >
                    <Feather name="check" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.title, { color: colors.text }]}>
                      {todo.title}
                    </Text>
                    {todo.description ? (
                      <Text
                        style={[styles.descriptionText, { color: colors.text }]}
                      >
                        {todo.description}
                      </Text>
                    ) : null}
                    {todo.completed === 1 && todo.done_at && (
                      <Text style={[styles.doneAtText, { color: colors.text }]}>
                        Done at: {new Date(todo.done_at).toLocaleString()}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsEditingTitle(true)}
                    style={{ marginLeft: 10 }}
                  >
                    <Feather name="edit-2" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeleteTodo}
                    style={{ marginLeft: 10 }}
                  >
                    <Feather
                      name="trash-2"
                      size={20}
                      color={colors.notification}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* SubTasks List */}
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <FlatList
              data={subTodos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderSubTodoItem}
              style={styles.subTodoList}
              ListEmptyComponent={
                <Text style={styles.emptyListText}>No sub-todos created</Text>
              }
            />
          )}

          {/* Add SubTask */}
          <View style={styles.addSubTodoContainer}>
            <TextInput
              style={[
                styles.addSubTodoInput,
                { color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Add a subtask..."
              placeholderTextColor={colors.text + "80"}
              value={newSubTodoTitle}
              onChangeText={setNewSubTodoTitle}
            />
            <TouchableOpacity
              style={[
                styles.addSubTodoButton,
                {
                  backgroundColor: newSubTodoTitle.trim()
                    ? colors.primary
                    : "#ccc",
                },
              ]}
              disabled={!newSubTodoTitle.trim()}
              onPress={handleCreateSubTodo}
            >
              <Feather name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
