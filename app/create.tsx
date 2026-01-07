import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTodoContext } from "../src/presentation/context/TodoContext";

export default function CreateTodoScreen() {
  const { listId } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedListId, setSelectedListId] = useState<string | undefined>(
    undefined
  );

  const { addTodo, lists } = useTodoContext();
  const router = useRouter();

  useEffect(() => {
    if (listId) {
      setSelectedListId(listId as string);
    } else {
      const anon = lists.find((l) => l.name === "Anonymous");
      if (anon) {
        setSelectedListId(anon.id);
      }
    }
  }, [lists, listId]);

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a title for the task.");
      return;
    }
    await addTodo(title, remarks, selectedListId);
    router.back();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Buy Groceries"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        <Text style={styles.label}>Select List</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.listSelector}
        >
          {lists.map((list) => (
            <TouchableOpacity
              key={list.id}
              style={[
                styles.chip,
                selectedListId === list.id && styles.chipSelected,
              ]}
              onPress={() => setSelectedListId(list.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedListId === list.id && styles.chipTextSelected,
                ]}
              >
                {list.name}
              </Text>
            </TouchableOpacity>
          ))}
          {lists.length === 0 && (
            <Text style={styles.noListsText}>
              No lists. 'Anonymous' will be created.
            </Text>
          )}
        </ScrollView>

        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any additional details..."
          value={remarks}
          onChangeText={setRemarks}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Create Task</Text>
          <MaterialIcons
            name="arrow-forward"
            size={20}
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  listSelector: {
    flexDirection: "row",
    marginBottom: 8,
  },
  chip: {
    backgroundColor: "#f1f3f5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: "#E3F2FD",
    borderColor: "#007AFF",
  },
  chipText: {
    color: "#495057",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#007AFF",
    fontWeight: "700",
  },
  noListsText: {
    color: "#adb5bd",
    fontStyle: "italic",
    marginTop: 8,
  },
});
