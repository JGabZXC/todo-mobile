import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LocalDatabase } from "../../../data/sources/LocalDatabase";
import { styles } from "../../features/groups/components/CreateGroupButtonStyles";

export default function DebugModal() {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleClearDatabase = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete all data? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await LocalDatabase.clear();
              Alert.alert("Success", "Database cleared.");
              DeviceEventEmitter.emit("DATABASE_CLEARED");
              setIsOpen(false);
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to clear database.");
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Modal
        animationType="fade"
        visible={isOpen}
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.container}>
          <View style={[styles.view, { backgroundColor: colors.card }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginBottom: 20,
              }}
            >
              <Text style={[styles.text, { color: colors.text }]}>Debug</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <AntDesign name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#db0e0eff", width: "100%" },
              ]}
              onPress={handleClearDatabase}
            >
              <Text style={{ color: "#fff" }}>Clear Database</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.fab,
          { backgroundColor: "#ff0000ff", top: "50%", bottom: "50%" },
        ]}
        onPress={() => setIsOpen(true)}
      >
        <AntDesign name="bug" size={24} color="white" />
      </TouchableOpacity>
    </>
  );
}
