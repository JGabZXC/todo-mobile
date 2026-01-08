import { Text, useColorScheme, View } from "react-native";

export default function Index() {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  return (
    <View style={{}}>
      <Text style={{ color: isDark ? "white" : "black" }}>
        Try editing me! 🎉
      </Text>
    </View>
  );
}
