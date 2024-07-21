import Toast from "react-native-toast-message";

export default class ToastAPI {
  constructor() {
    this.titleStyles = {
      fontFamily: "PoppinsRegular",
      fontSize: 14,
      color: "#0009",
    };
    this.messageStyles = {
      fontFamily: "PoppinsRegular",
      fontSize: 12,
      color: "#888",
    };
  }

  success(title, message) {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      text1Style: this.titleStyles,
      text2Style: this.messageStyles,
      text2NumberOfLines: 2,
      topOffset: 10,
      visibilityTime: 7000,
    });
  }

  error(title, message) {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
      text1Style: this.titleStyles,
      text2Style: this.messageStyles,
      text2NumberOfLines: 2,
      topOffset: 35,
      visibilityTime: 4000,
    });
  }

  info(title, message) {
    Toast.show({
      type: "info",
      text1: title,
      text2: message,
      text1Style: this.titleStyles,
      text2Style: this.messageStyles,
      text2NumberOfLines: 2,
      topOffset: 35,
      visibilityTime: 4000,
    });
  }
}
