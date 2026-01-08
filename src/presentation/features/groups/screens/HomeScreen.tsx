import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Group } from "../../../../domain/entities/Group";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useTodos } from "../../todos/hooks/useTodos";
import { CreateGroupButton } from "../components/CreateGroupButton";
import { GroupList } from "../components/GroupList";
import { useGroups } from "../hooks/useGroups";

const ITEMS_PER_PAGE = 20;

export function HomeScreen() {
  const { getGroups } = useGroups();
  const { getTodosByGroup } = useTodos();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasAnonymousTasks, setHasAnonymousTasks] = useState(false);

  const checkAnonymous = useCallback(async () => {
    try {
      const anonymousTodos = await getTodosByGroup(null, 1, 0);
      setHasAnonymousTasks(anonymousTodos.length > 0);
    } catch (error) {
      console.error(error);
    }
  }, [getTodosByGroup]);

  const loadGroups = useCallback(
    async (reset = false) => {
      if (reset) {
        setLoading(true);
        setHasMore(true);
      } else {
        if (!hasMore || isFetchingMore) return;
        setIsFetchingMore(true);
      }

      try {
        const currentOffset = reset ? 0 : groups.length;
        const fetchedGroups = await getGroups(
          ITEMS_PER_PAGE,
          currentOffset,
          debouncedSearch
        );

        if (fetchedGroups.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }

        if (reset) {
          setGroups(fetchedGroups);
        } else {
          setGroups((prev) => [...prev, ...fetchedGroups]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [getGroups, debouncedSearch, hasMore, isFetchingMore, groups.length]
  );

  useFocusEffect(
    useCallback(() => {
      loadGroups(true);
      if (!debouncedSearch) {
        checkAnonymous();
      }
    }, [debouncedSearch, loadGroups, checkAnonymous])
  );

  const handleRefresh = useCallback(() => {
    loadGroups(true);
    checkAnonymous();
  }, [loadGroups, checkAnonymous]);

  const handleLoadMore = useCallback(() => {
    loadGroups(false);
  }, [loadGroups]);

  // Combined data for display
  const displayData = useMemo(() => {
    const data: (Group | { id: number; name: string; isAnonymous: boolean })[] =
      [...groups];
    if (hasAnonymousTasks && !debouncedSearch) {
      data.push({
        id: -1,
        name: "Anonymous Group",
        isAnonymous: true,
      } as any);
    }
    return data;
  }, [groups, hasAnonymousTasks, debouncedSearch]);

  if (loading && groups.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (
    !loading &&
    groups.length === 0 &&
    !hasAnonymousTasks &&
    !debouncedSearch
  ) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No groups or todos found.</Text>
        <CreateGroupButton onGroupCreated={handleRefresh} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GroupList
        groups={displayData}
        onPressGroup={(id) =>
          router.push({
            pathname: "/group/[id]",
            params: { id: id.toString() },
          })
        }
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        isFetchingMore={isFetchingMore}
        onSearch={setSearchQuery}
      />
    </View>
  );
}
