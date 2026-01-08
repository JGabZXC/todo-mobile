import { Group } from "@/src/domain/entities/Group";
import { ToDo } from "@/src/domain/entities/ToDo";
import { useGroups } from "@/src/presentation/features/groups/hooks/useGroups";
import { CreateTodoButton } from "@/src/presentation/features/todos/components/CreateTodoButton";
import { TodoList } from "@/src/presentation/features/todos/components/TodoList";
import { useTodos } from "@/src/presentation/features/todos/hooks/useTodos";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type FilterType = "all" | "active" | "completed";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = parseInt(id!, 10);
  const isAnonymous = numericId === -1;

  const { getGroup, deleteGroup, updateGroup } = useGroups();
  const { getTodosByGroup, updateTodo } = useTodos();
  const { colors } = useTheme();

  const [group, setGroup] = useState<Group | null>(null);
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const LIMIT = 100;

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const fetchData = useCallback(
    async (loadMore = false) => {
      if (loadMore) {
        if (!hasMore || isFetchingMore) return;
        setIsFetchingMore(true);
      } else {
        setLoading(true);
        setHasMore(true);
      }

      try {
        if (!loadMore) {
          // Initial load - fetch group info too
          if (isAnonymous) {
            setGroup({
              id: -1,
              name: "Tasks without a group",
              created_at: new Date(),
              updated_at: new Date(),
            });
          } else {
            const fetchedGroup = await getGroup(numericId);
            setGroup(fetchedGroup);
          }
        }

        const currentOffset = loadMore ? todos.length : 0;
        const fetchedTodos = await getTodosByGroup(
          isAnonymous ? null : numericId,
          LIMIT,
          currentOffset
        );

        if (fetchedTodos.length < LIMIT) {
          setHasMore(false);
        }

        if (loadMore) {
          setTodos((prev) => [...prev, ...fetchedTodos]);
        } else {
          setTodos(fetchedTodos);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [
      numericId,
      isAnonymous,
      getGroup,
      getTodosByGroup,
      hasMore,
      isFetchingMore,
      todos.length,
    ]
  );

  useEffect(() => {
    fetchData(false);
  }, []); // Run once on mount

  const handleRefresh = () => fetchData(false);
  const handleLoadMore = () => fetchData(true);

  const handleEditPress = () => {
    setEditName(group?.name || "");
    setSettingsVisible(false);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!group || !editName.trim()) return;

    const previousName = group.name;
    const newName = editName.trim();

    // Optimistic update
    setGroup({ ...group, name: newName });
    setIsEditing(false);

    try {
      await updateGroup(group.id, newName);
      // No need to fetch data, we already updated the UI
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update group name");
      // Revert optimization
      setGroup({ ...group, name: previousName });
    }
  };

  const handleDeleteGroup = async () => {
    setSettingsVisible(false);
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group and all its tasks?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGroup(numericId);
              router.back();
            } catch (error) {
              console.error("Failed to delete group", error);
              Alert.alert("Error", "Failed to delete group");
            }
          },
        },
      ]
    );
  };

  const handleToggleComplete = async (todoId: number) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;

    const newCompleted = todo.completed === 1 ? 0 : 1;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, completed: newCompleted } : t))
    );

    try {
      await updateTodo(todoId.toString(), { completed: newCompleted });
    } catch (e) {
      console.error(e);
      // Revert on error
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todoId ? { ...t, completed: todo.completed } : t
        )
      );
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return todo.completed === 0;
    if (filter === "completed") return todo.completed === 1;
    return true;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If group not found and not loading/anonymous, maybe deleted
  if (!group && !loading) {
    return (
      <View style={styles.center}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: false,
          headerTitle: group?.name || "Group",
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerShadowVisible: true,
          headerTintColor: colors.text,
          headerRight: () =>
            !isAnonymous ? (
              <TouchableOpacity onPress={() => setSettingsVisible(true)}>
                <AntDesign name="setting" size={24} color={colors.text} />
              </TouchableOpacity>
            ) : null,
        }}
      />

      <View
        style={[
          styles.filterContainer,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        {(["all", "active", "completed"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              { backgroundColor: colors.border },
              filter === f && { backgroundColor: colors.primary },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                { color: colors.text },
                filter === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredTodos.length === 0 && todos.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: colors.text, opacity: 0.5 }}>
            No tasks in this group
          </Text>
          <CreateTodoButton
            groupId={isAnonymous ? null : numericId}
            onTodoCreated={handleRefresh}
          />
        </View>
      ) : (
        <>
          <TodoList
            todos={filteredTodos}
            onPressTodo={(id) => console.log("Pressed todo", id)}
            onToggleComplete={handleToggleComplete}
            onEndReached={handleLoadMore}
            isFetchingMore={isFetchingMore}
          />
          <CreateTodoButton
            groupId={isAnonymous ? null : numericId}
            onTodoCreated={handleRefresh}
          />
        </>
      )}

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSettingsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSettingsVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
            >
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleEditPress}
              >
                <AntDesign name="edit" size={24} color={colors.text} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>
                  Edit Group Name
                </Text>
              </TouchableOpacity>
              <View
                style={[styles.separator, { backgroundColor: colors.border }]}
              />
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleDeleteGroup}
              >
                <AntDesign name="delete" size={24} color="red" />
                <Text style={[styles.modalOptionText, { color: "red" }]}>
                  Delete Group
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Edit Group Modal */}
      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.editModalContent, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Group Name
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                style={styles.modalButton}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={{ color: "white" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  editModalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
});
