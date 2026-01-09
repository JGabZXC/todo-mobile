import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorHandler } from "../../../shared/utils/ErrorHandler";
import { useGroups } from "../hooks/useGroups";
import { styles } from "./CreateGroupButtonStyles";

interface CreateGroupButtonProps {
  onGroupCreated?: () => void;
}

export default function CreateGroupButton({
  onGroupCreated,
}: CreateGroupButtonProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [open, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const dynamicBottom = insets.bottom > 0 ? insets.bottom + 20 : 40;

  const { createGroup } = useGroups();

  async function handleCreateGroup() {
    try {
      setLoading(true);
      await createGroup(groupName);
      setIsOpen(false);
      setGroupName("");
      onGroupCreated?.();
    } catch (error) {
      ErrorHandler.handle(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => {
          setIsOpen(false);
          setGroupName("");
        }}
      >
        <View style={styles.container}>
          <View style={[styles.view, { backgroundColor: colors.card }]}>
            <Text style={[styles.text, { color: colors.text }]}>
              Create Group
            </Text>

            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Group Name"
              placeholderTextColor="gray"
              value={groupName}
              onChangeText={setGroupName}
            />

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#db0e0eff" }]}
                disabled={loading}
                onPress={() => setIsOpen(false)}
              >
                <Text style={{ color: "#fff" }}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleCreateGroup}
                disabled={loading || !groupName.trim()}
              >
                <Text style={{ color: "#fff" }}>
                  {loading ? "Creating..." : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.fab,
          { backgroundColor: colors.primary, bottom: dynamicBottom },
        ]}
        onPress={() => setIsOpen(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </>
  );
}
