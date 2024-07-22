import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate, formatTime } from "../../../utils/dateFormatter";
import ToastAPI from "../../../utils/Toast";
import useSendHireRequest from "../hooks/useHire";

const { width, height } = Dimensions.get("window");
const RequestForm = ({
  selectedHire,
  setSelectedHire,
  setShowRequestForm,
  jobLocation,
}) => {
  const Toast = new ToastAPI();
  const insets = useSafeAreaInsets();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const bidRef = useRef(null);
  const [requestData, setRequestData] = useState({
    title: "",
    description: "",
    budget: "",
    negotiable: false,
    date: undefined,
  });
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date"); // 'date' or 'time'
  const [loading, sendRequest] = useSendHireRequest();

  const onChange = (event, selectedDate) => {
    if (
      new Date(selectedDate).getTime() <
      new Date(Date.now()).getTime() - 60000
    ) {
      console.log("Date cannot be before today!");
      return;
    }
    const currentDate = selectedDate || requestData.date;
    setShow(Platform.OS === "ios");
    setRequestData((prev) => ({ ...prev, date: currentDate }));
    console.log("date: ", currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode("date");
  };

  const showTimePicker = () => {
    showMode("time");
  };

  const handleRequestData = (name, value) => {
    setRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async () => {
    const { title, description, budget, date, negotiable } = requestData;
    if (!title || !description || !budget || !date) {
      Toast.error("Empty fields!", "You still have some values missing!");
      return;
    }
    const result = await sendRequest({
      title,
      jobDescription: description,
      bid: { budget, negotiable },
      servicer: selectedHire._id,
      dateTime: date,
      jobLocation,
    });

    if (result) {
      setShowRequestForm(false);
    }
    console.log("submitting...: \n", requestData);
  };

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutRight}
      style={styles.container}
    >
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      {/*** header */}
      <View style={[styles.header, { marginTop: insets.top + 15 }]}>
        {/**** back */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.back]}
          onPress={() => setShowRequestForm(false)}
        >
          <AntDesign name="arrowleft" size={28} color="#333" />
        </TouchableOpacity>

        {/**** selectedHire */}
        <View style={styles.hire}>
          <Image
            source={{
              uri: selectedHire.photo,
            }}
            style={styles.hireImage}
          />
          <View style={styles.hireDetails}>
            <View style={styles.hireNameWrapper}>
              <Text style={styles.hireName}>{selectedHire.name}</Text>
              <Text style={styles.hireIndicator}>New hire</Text>
            </View>
            <Text style={styles.hireTitle}>{selectedHire.title}</Text>
          </View>
        </View>
      </View>

      <View style={styles.form}>
        {/**** title */}
        <Text style={[styles.inputHeading]}>Title</Text>
        <TextInput
          ref={titleRef}
          keyboardType="default"
          id="name"
          value={requestData.title}
          placeholder="Title of your job request...eg. Leaky roof needs fixing"
          returnKeyLabel="next"
          returnKeyType="next"
          onChangeText={(text) => handleRequestData("title", text)}
          onSubmitEditing={() => descriptionRef.current?.focus()}
          onBlur={() => null}
          onFocus={() => null}
          style={[styles.textInput, styles.titleInput]}
        />

        {/**** description */}
        <Text style={[styles.inputHeading]}>Description</Text>
        <TextInput
          ref={descriptionRef}
          keyboardType="default"
          id="name"
          placeholder="A little bit of detail on what you need done"
          value={requestData.description}
          returnKeyLabel="next"
          returnKeyType="next"
          onChangeText={(text) => handleRequestData("description", text)}
          onSubmitEditing={() => bidRef.current?.focus()}
          onBlur={() => null}
          onFocus={() => null}
          multiline
          style={[styles.textInput, styles.descriptionInput]}
        />

        {/**** budget */}
        <Text style={[styles.inputHeading]}>Your budget</Text>
        <View style={styles.bidView}>
          <TextInput
            ref={bidRef}
            keyboardType="number-pad"
            id="bid"
            placeholder="How much you got ?"
            value={requestData.budget}
            returnKeyLabel="next"
            returnKeyType="next"
            onChangeText={(text) => handleRequestData("budget", text)}
            onSubmitEditing={() => null}
            onBlur={() => null}
            onFocus={() => null}
            style={[styles.textInput, styles.bidInput]}
          />
          <TouchableOpacity
            onPress={() =>
              handleRequestData("negotiable", !requestData.negotiable)
            }
            activeOpacity={0.8}
            style={styles.bidNegotiable}
          >
            <View
              style={[
                styles.negotiableInput,
                requestData.negotiable && {
                  borderColor: "transparent",
                  backgroundColor: "#35b2a5",
                },
              ]}
            >
              {requestData.negotiable && (
                <Ionicons name="checkmark" size={25} color="#fff" />
              )}
            </View>
            <Text
              style={[
                styles.negotiableInputText,
                requestData.negotiable && { color: "#35b2a5" },
              ]}
            >
              Negotiable
            </Text>
          </TouchableOpacity>
        </View>

        {/**** date and time */}
        {/**** selectors */}
        <View style={styles.dateSelectors}>
          <TouchableOpacity
            onPress={showDatePicker}
            activeOpacity={0.8}
            style={[styles.picker, styles.datePicker]}
          >
            <Fontisto name="date" size={24} color="#35b2a5" />
            <Text style={styles.date}>
              {requestData.date ? formatDate(requestData.date) : "Pick a date"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showTimePicker}
            activeOpacity={0.8}
            style={[styles.picker, styles.timePicker]}
          >
            <Ionicons name="time" size={24} color="#35b2a5" />
            <Text style={styles.date}>
              {requestData.date ? formatTime(requestData.date) : "Pick a time"}
            </Text>
          </TouchableOpacity>
        </View>

        {show && (
          <DateTimePicker
            value={requestData.date ?? new Date()}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <TouchableOpacity
        onPress={() => submit()}
        activeOpacity={0.8}
        style={styles.submit}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Hire Request</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default RequestForm;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
  },

  back: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  hire: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  hireImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
  },

  hireDetails: {
    // flex: 1,
  },

  hireNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  hireName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "800",
  },

  hireIndicator: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#24867ddd",
    color: "#fff",
    fontWeight: "800",
  },

  hireTitle: {
    marginVertical: 2,
    fontSize: 12,
    color: "#333d",
    fontWeight: "800",
  },

  /***** inputs */
  form: {
    paddingHorizontal: 10,
    marginTop: 30,
  },

  inputHeading: {
    fontSize: 15,
    fontWeight: "800",
    backgroundColor: "#35b2a5",
    color: "#fff",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#555c",
    marginTop: 5,
    marginBottom: 20,
    minHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },

  descriptionInput: {
    height: 150,
    textAlignVertical: "top",
  },

  bidView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bidInput: {
    width: "50%",
  },

  bidNegotiable: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  negotiableInput: {
    borderWidth: 1,
    borderColor: "#333",
    width: 30,
    aspectRatio: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  negotiableInputText: {
    fontWeight: "800",
    color: "#333c",
  },

  /**** picker */
  dateSelectors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },

  picker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  submit: {
    marginTop: "auto",
    paddingVertical: 10,
    width: width - 20,
    borderRadius: 5,
    backgroundColor: "#35b2a5",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
