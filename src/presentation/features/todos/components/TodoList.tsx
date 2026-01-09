import { useTheme } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToDo } from "../../../../domain/entities/ToDo";
import { TodoItem } from "./TodoItem";
import { styles } from "./TodoListStyles";

interface TodoListProps {
  todos: ToDo[];
  onPressTodo: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onEndReached?: () => void;
  isFetchingMore?: boolean;
}

export function TodoList({
  todos,
  onPressTodo,
  onToggleComplete,
  onEndReached,
  isFetchingMore,
}: TodoListProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onPress={onPressTodo}
            onToggleComplete={onToggleComplete}
          />
        )}
        contentContainerStyle={styles.listContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
}
