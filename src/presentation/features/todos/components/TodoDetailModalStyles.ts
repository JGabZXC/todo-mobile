import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    // flex: 1, // Removed flex: 1
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
  },
  closeButton: {
    padding: 5,
  },
  subTodoList: {
    flexGrow: 0,
    marginBottom: 20,
  },
  subTodoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  subTodoContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  subTodoTitle: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  subTodoInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 2,
  },
  subTodoActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  addSubTodoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 15,
  },
  addSubTodoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addSubTodoButton: {
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  doneAtText: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  emptyListText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    padding: 20,
  },
});
