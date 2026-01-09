import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkbox: {
    padding: 8,
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 16,
    marginRight: 8,
  },
  subTodoCount: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  description: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
