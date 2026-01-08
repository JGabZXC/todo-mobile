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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterType = "all" | "active" | "completed";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = parseInt(id!, 10);
  const isAnonymous = numericId === -1;

  const { getGroup, deleteGroup } = useGroups();
  const { getTodosByGroup, updateTodo } = useTodos();
  const { colors } = useTheme();

  const [group, setGroup] = useState<Group | null>(null);
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const LIMIT = 100;

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

  const handleDeleteGroup = async () => {
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
          title: group?.name || "Group",
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.card },
          headerRight: () =>
            !isAnonymous ? (
              <TouchableOpacity onPress={handleDeleteGroup}>
                <AntDesign name="delete" size={24} color="red" />
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
});
