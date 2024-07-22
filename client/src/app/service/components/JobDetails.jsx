import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useAcceptHireRequest, useRejectHireRequest } from "../hooks/useHire";

const RequestJobDetails = ({ details, setFeed, setShowRequestedModal }) => {
  const [aLoading, acceptHire] = useAcceptHireRequest();
  const [rLoading, rejectHire] = useRejectHireRequest();

  const acceptRequest = async () => {
    const data = await acceptHire(details._id);
    if (data) {
      setShowRequestedModal((prev) => ({ ...prev, visible: false }));
      setFeed((prev) => ({
        ...prev,
        pending: prev.pending.filter((req) => req._id !== details._id),
        accepted: [details, ...prev.accepted],
      }));
    }
  };

  const rejectRequest = async () => {
    const data = await rejectHire(details._id);
    if (data) {
      setShowRequestedModal((prev) => ({ ...prev, visible: false }));
      setFeed((prev) => ({
        ...prev,
        pending: prev.pending.filter((req) => req._id !== details._id),
      }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {details?.customer?.photo && (
          <Image
            source={{ uri: details.customer.photo }}
            style={styles.headerImage}
          />
        )}
        <Text style={styles.headerName}>{details?.customer?.name}</Text>
        <Text style={styles.headerTime}>12.43</Text>
      </View>

      <View style={styles.jobDetails}>
        {/**** job title */}
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Title </Text>
          <Text style={styles.detailDescription}>{details?.title}</Text>
        </View>

        {/*** budget */}
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Budget</Text>
          <Text style={styles.detailDescription}>
            {details?.bid?.budget} GHC
          </Text>
          {details?.bid?.negotiable && (
            <View style={styles.negotiable}>
              <View style={styles.blob} />
              <Text style={styles.negotiableText}>negotiable</Text>
            </View>
          )}
        </View>

        {/*** job description */}
        <View style={[styles.detail, styles.description]}>
          <Text style={styles.detailTitle}>Job Description </Text>
          <Text style={[styles.detailDescription, styles.descriptionText]}>
            {details?.jobDescription}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={acceptRequest}
          activeOpacity={0.8}
          style={styles.footerAction}
        >
          {aLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.footerText}>Accept</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={rejectRequest}
          activeOpacity={0.8}
          style={[styles.footerAction, styles.decline]}
        >
          {rLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.footerText}>Decline</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CompletedJobDetails = ({ details }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {details?.customer?.photo && (
          <Image
            source={{ uri: details.customer.photo }}
            style={styles.headerImage}
          />
        )}
        <Text style={styles.headerName}>{details?.customer?.name}</Text>
        <Text style={styles.headerTime}>12:43</Text>
      </View>

      <View style={styles.jobDetails}>
        {/**** job title */}
        <View style={styles.detail}>
          <Text style={[styles.detailTitle, styles.resolvedBackground]}>
            Title
          </Text>
          <Text style={[styles.detailDescription]}>{details?.title}</Text>
        </View>

        {/*** budget */}
        <View style={styles.detail}>
          <Text style={[styles.detailTitle, styles.resolvedBackground]}>
            Budget
          </Text>
          <Text style={[styles.detailDescription]}>
            {details?.bid?.budget} GHC
          </Text>
          {details?.bid?.negotiable && (
            <View style={styles.negotiable}>
              <View style={[styles.blob, styles.resolvedBackground]} />
              <Text style={[styles.negotiableText, { color: "#555c" }]}>
                negotiable
              </Text>
            </View>
          )}
        </View>

        {/*** job description */}
        <View style={[styles.detail, styles.description]}>
          <Text style={[styles.detailTitle, styles.resolvedBackground]}>
            Job Description
          </Text>
          <Text style={[styles.detailDescription, styles.descriptionText]}>
            {details?.jobDescription}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => console.log("Accepted offer")}
        activeOpacity={0.8}
        disabled
        style={[styles.resolved]}
      >
        <Text style={styles.resolvedText}>Completed</Text>
      </TouchableOpacity>
    </View>
  );
};

export { RequestJobDetails, CompletedJobDetails };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 30,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  headerImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },

  headerName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333c",
  },

  headerTime: {
    marginLeft: "auto",
  },
  jobDetails: {
    width: "100%",
    paddingHorizontal: 15,
    gap: 10,
  },

  detail: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  description: {
    flexDirection: "column",
    gap: 0,
  },

  detailTitle: {
    backgroundColor: "#35b2a5",
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "800",
  },

  detailDescription: {
    fontSize: 15,
    color: "#333c",
    fontWeight: "700",
  },

  descriptionText: {
    alignSelf: "flex-start",
    fontWeight: "600",
    color: "#222d",
    textAlign: "left",
  },

  negotiable: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  blob: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 5,
    backgroundColor: "#35b2a5",
  },

  negotiableText: {
    color: "#333",
    fontSize: 15,
    textTransform: "capitalize",
    color: "#35b2a5",
    fontWeight: "800",
  },

  footer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    marginHorizontal: 15,
    flexDirection: "row-reverse",
    gap: 10,
  },

  footerAction: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#35b2a5",
    borderRadius: 10,
  },

  decline: {
    backgroundColor: "#0c0d34cc",
  },

  footerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  resolved: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "#0005",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 10,
  },

  resolvedText: {
    color: "#fff9",
    fontSize: 16,
    fontWeight: "700",
  },

  resolvedBackground: {
    backgroundColor: "#0005",
  },
});
