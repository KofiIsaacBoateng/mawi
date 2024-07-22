import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const NewRequestsCard = ({ wrap, setShowRequestedModal, job }) => {
  return (
    <View style={[styles.container, wrap && { flexGrow: 1 }]}>
      {/**** profile-photo */}
      <View style={styles.profileImageWrapper}>
        <Image
          source={{
            uri: job.customer.photo,
          }}
          style={styles.profileImage}
        />
      </View>
      {/***** name */}
      <View style={styles.details}>
        <Text style={styles.name}>{job.customer.name}</Text>

        {/**** call to action */}
        <TouchableOpacity
          onPress={() => setShowRequestedModal({ visible: true, details: job })}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Read more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CurrentJobCards = ({ showMap, setShowMap, wrap, job }) => {
  return (
    <View style={[styles.container, wrap && { flexGrow: 1 }]}>
      {/**** profile-photo */}
      <View style={styles.profileImageWrapper}>
        {job?.customer?.photo && (
          <Image
            source={{
              uri: job.customer.photo,
            }}
            style={styles.profileImage}
          />
        )}
      </View>
      {/***** name */}
      <View style={styles.details}>
        <Text style={styles.name}>{job?.customer?.name}</Text>
        {/**** call to action */}
        <TouchableOpacity
          onPress={() =>
            setShowMap((prev) => ({ visible: true, details: job }))
          }
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CompletedJobsCards = ({ wrap, setShowCompletedModal, job }) => {
  return (
    <View style={[styles.container, wrap && { flexGrow: 1 }]}>
      {/**** profile-photo */}
      <View style={styles.profileImageWrapper}>
        {job?.customer?.photo && (
          <Image
            source={{
              uri: job.customer.photo,
            }}
            style={styles.profileImage}
          />
        )}
      </View>
      {/***** name */}
      <View style={styles.details}>
        <Text style={styles.name}>{job?.customer?.name}</Text>
        {/**** call to action */}
        <TouchableOpacity
          onPress={() => setShowCompletedModal({ visible: true, details: job })}
          activeOpacity={0.8}
          style={styles.button}
        >
          <Text style={styles.buttonText}>See Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export { CurrentJobCards, NewRequestsCard, CompletedJobsCards };

const styles = StyleSheet.create({
  container: {
    width: 150,
    paddingVertical: 15,
    paddingHorizontal: 3,
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#eee3",
    maxWidth: "50%",
  },

  profileImageWrapper: {
    width: 80,
    backgroundColor: "#3bd6c6",
    padding: 3,
    borderRadius: 50,
  },

  profileImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 50,
  },

  details: {
    alignItems: "center",
    marginTop: 5,
  },

  name: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333",
  },

  description: {
    color: "#333",
    fontWeight: "600",
    paddingHorizontal: 2,
  },

  button: {
    width: 130,
    paddingVertical: 5,
    backgroundColor: "#35b2a5",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
