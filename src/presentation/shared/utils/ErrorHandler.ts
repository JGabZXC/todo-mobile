import { Alert } from "react-native";

export class ErrorHandler {
  static handle(error: unknown) {
    let message = "An unexpected error occurred.";

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    if (__DEV__) {
      console.log("ErrorHandler caught:", message);
    }

    Alert.alert("Error", message);
  }
}
