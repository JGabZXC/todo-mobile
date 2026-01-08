import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Group } from "../../../../domain/entities/Group";
import { CreateGroupButton } from "./CreateGroupButton";

interface GroupListProps {
  groups: (Group | { id: number; name: string; isAnonymous: boolean })[];
  onPressGroup: (groupId: number) => void;
  onRefresh?: () => void;
  onEndReached?: () => void;
  isFetchingMore?: boolean;
  onSearch?: (query: string) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  onPressGroup,
  onRefresh,
  onEndReached,
  isFetchingMore,
  onSearch,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {onSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Search groups..."
            placeholderTextColor={colors.text}
            onChangeText={onSearch} // Consider debouncing this in parent
          />
        </View>
      )}
      <FlatList
        data={groups}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressGroup(item.id)}
            style={styles.itemContainer}
            activeOpacity={0.7}
          >
            <View style={styles.textContainer}>
              <Text style={[styles.itemText, { color: colors.text }]}>
                {item.name}
              </Text>
              {(item as any).isAnonymous && (
                <Text style={styles.subText}>Tasks without a group</Text>
              )}
            </View>
            <AntDesign name="right" size={16} color={colors.border} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />
        )}
        onRefresh={onRefresh}
        refreshing={false}
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
      <CreateGroupButton onGroupCreated={onRefresh} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 80, // Accommodate floating button
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: -0.4,
  },
  subText: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 24,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
