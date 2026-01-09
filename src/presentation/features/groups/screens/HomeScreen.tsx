import { useTheme } from "@react-navigation/native";
import { View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import GroupList from "../components/GroupList";
import { styles } from "./HomeScreenStyles";

export function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <GroupList />
    </View>
  );
}
