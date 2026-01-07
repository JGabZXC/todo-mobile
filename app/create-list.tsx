import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTodoContext } from "../src/presentation/context/TodoContext";

export default function CreateListScreen() {
  const [name, setName] = useState("");
  const { createNewList } = useTodoContext();
  const router = useRouter();

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter a list name.");
      return;
    }
    await createNewList(name);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>List Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Work, Shopping, Vacation"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Create List</Text>
          <MaterialIcons
            name="playlist-add"
            size={24}
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 24,
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
});
