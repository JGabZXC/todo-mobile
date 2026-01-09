import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTodos } from "../hooks/useTodos";
import { styles } from "./CreateTodoButtonStyles";

interface CreateTodoButtonProps {
  groupId: number | null;
  onTodoCreated?: () => void;
}

export function CreateTodoButton({
  groupId,
  onTodoCreated,
}: CreateTodoButtonProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({ title: "", description: "" });
  const { createTodo } = useTodos();

  const dynamicBottom = insets.bottom > 0 ? insets.bottom + 20 : 40;

  const handleCreate = async () => {
    if (!data.title.trim()) return;
    if (data.title.length > 30) {
      Alert.alert("Error", "Title cannot exceed 30 characters.");
      return;
    }
    if (data.description.length > 50) {
      Alert.alert("Error", "Description cannot exceed 50 characters.");
      return;
    }

    await createTodo(
      {
        title: data.title,
        description: data.description,
        completed: 0,
      },
      groupId === -1 ? undefined : groupId ?? undefined
    );

    setData({ title: "", description: "" });
    setModalVisible(false);
    onTodoCreated?.();
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <View style={[styles.modalView, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Create New Task
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Task Title"
              placeholderTextColor="gray"
              value={data.title}
              onChangeText={(text) =>
                setData((prev) => ({ ...prev, title: text }))
              }
              autoFocus={true}
            />

            <TextInput
              maxLength={50}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  height: "auto",
                },
              ]}
              placeholder="Task Description"
              placeholderTextColor="gray"
              value={data.description}
              onChangeText={(text) =>
                setData((prev) => ({ ...prev, description: text }))
              }
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.primary, marginLeft: 10 },
                ]}
                onPress={handleCreate}
              >
                <Text style={styles.textStyle}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.fab,
          { backgroundColor: colors.primary, bottom: dynamicBottom },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </>
  );
}
