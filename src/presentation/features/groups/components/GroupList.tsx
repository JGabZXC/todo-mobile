import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Group } from "../../../../domain/entities/Group";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { ErrorHandler } from "../../../shared/utils/ErrorHandler";
import { useGroups } from "../hooks/useGroups";
import CreateGroupButton from "./CreateGroupButton";
import { styles } from "./GroupListStyles";

const PAGE_SIZE = 20;

export default function GroupList() {
  const { colors } = useTheme();
  const router = useRouter();
  const { getGroups, deleteGroup } = useGroups();
  const insets = useSafeAreaInsets();

  const [groups, setGroups] = useState<Group[]>([]);
  const [searchResults, setSearchResults] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadGroups = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      const result = await getGroups(PAGE_SIZE, currentOffset);

      if (reset) {
        setGroups(result);
        setOffset(PAGE_SIZE);
      } else {
        setGroups((prev) => [...prev, ...result]);
        setOffset((prev) => prev + PAGE_SIZE);
      }

      if (result.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      ErrorHandler.handle(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      const localMatches = groups.filter((g) =>
        g.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );

      if (localMatches.length > 0) {
        setSearchResults(localMatches);
      } else {
        try {
          setLoading(true);
          const result = await getGroups(
            undefined,
            undefined,
            debouncedSearchQuery
          );
          setSearchResults(result);
        } catch (error) {
          ErrorHandler.handle(error);
        } finally {
          setLoading(false);
        }
      }
    };

    handleSearch();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    loadGroups(true);
  }, []);

  const handleDeleteGroup = async (id: number) => {
    try {
      await deleteGroup(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      setSearchResults((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      ErrorHandler.handle(error);
    }
  };

  const onEndReached = () => {
    if (!searchQuery && hasMore) {
      loadGroups();
    }
  };

  const displayGroups = searchQuery ? searchResults : groups;

  const renderItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={[styles.groupItem, { backgroundColor: colors.card }]}
      onPress={() =>
        router.push({
          pathname: "/group/[id]",
          params: { id: item.id.toString() },
        })
      }
    >
      <Text style={[styles.groupName, { color: colors.text }]}>
        {item.name}
      </Text>
      <TouchableOpacity onPress={() => handleDeleteGroup(item.id)}>
        <AntDesign name="delete" size={20} color={colors.notification} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {groups.length > 0 && (
        <Text style={[styles.header, { color: colors.text }]}>
          Your Groups {__DEV__ && groups.length}
        </Text>
      )}

      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Search groups..."
        placeholderTextColor={colors.text}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View
        style={{
          paddingBottom: insets.bottom - 20,
          flex: 1,
        }}
      >
        <FlatList
          data={displayGroups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && displayGroups.length > 0 ? (
              <View style={{ padding: 20 }}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  {searchQuery
                    ? "No groups found"
                    : "There's no group, create one"}
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      <CreateGroupButton onGroupCreated={() => loadGroups(true)} />
    </View>
  );
}
