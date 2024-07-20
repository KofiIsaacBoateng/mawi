import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CompletedJobsCards,
  CurrentJobCards,
  NewRequestsCard,
} from "../components/UserCards";
import Map from "../components/Map";
import CustomModal from "../components/CustomModal";
import Feather from "react-native-vector-icons/Feather";
import {
  CompletedJobDetails,
  RequestJobDetails,
} from "../components/JobDetails";

const userImage = `https://avatar.iran.liara.run/public/boy?username=chad${Math.floor(
  Math.random() * 201 + 100
)}`;

const ServiceApp = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showRequestedModal, setShowRequestedModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showMap, setShowMap] = useState({
    visible: false,
    details: undefined,
  });

  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/**** intro */}
      <View style={styles.intro}>
        <Image
          source={{
            uri: userImage,
          }}
          style={styles.profileImage}
        />

        <View style={styles.introDetails}>
          <Text style={styles.welcome}>Howdy, John Doe</Text>
        </View>
        <TouchableOpacity
          onPress={() => console.log("show more")}
          activeOpacity={0.8}
          style={styles.menu}
        >
          <Feather name="more-vertical" size={25} color="#333" />
        </TouchableOpacity>
      </View>

      {/**** intro */}
      <ScrollView
        style={styles.filters}
        contentContainerStyle={styles.filtersContainer}
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => setActiveFilter("all")}
          activeOpacity={0.8}
          style={[
            styles.filter,
            activeFilter === "all" && { borderBottomWidth: 3 },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "all" && { color: "#35b2a5", fontWeight: "700" },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveFilter("active")}
          activeOpacity={0.8}
          style={[
            styles.filter,
            activeFilter === "active" && { borderBottomWidth: 3 },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "active" && {
                color: "#35b2a5",
                fontWeight: "700",
              },
            ]}
          >
            Current Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveFilter("pending")}
          activeOpacity={0.8}
          style={[
            styles.filter,
            activeFilter === "pending" && { borderBottomWidth: 3 },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "pending" && {
                color: "#35b2a5",
                fontWeight: "700",
              },
            ]}
          >
            Job Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter("completed")}
          activeOpacity={0.8}
          style={[
            styles.filter,
            activeFilter === "completed" && { borderBottomWidth: 3 },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "completed" && {
                color: "#35b2a5",
                fontWeight: "700",
              },
            ]}
          >
            Completed Jobs
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 15 }}
      >
        {/***** current jobs */}
        {(activeFilter === "all" || activeFilter === "active") && (
          <Text style={styles.title}>Current Jobs</Text>
        )}
        {activeFilter === "active" ? (
          <View style={styles.jobListsWrap}>
            <CurrentJobCards wrap showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards wrap showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards wrap showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards wrap showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards wrap showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards wrap showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards wrap showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards wrap showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards wrap showMap={showMap} setShowMap={setShowMap} />
          </View>
        ) : activeFilter === "all" ? (
          <ScrollView
            style={styles.jobLists}
            contentContainerStyle={styles.jobListsContainer}
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
          >
            <CurrentJobCards showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards showMap={showMap} setShowMap={setShowMap} />
            <CurrentJobCards showMap={showMap} setShowMap={setShowMap} />
          </ScrollView>
        ) : (
          <></>
        )}

        {/***** Job Requests */}
        {(activeFilter === "all" || activeFilter === "pending") && (
          <Text style={styles.title}>Job Requests</Text>
        )}
        {activeFilter === "pending" ? (
          <View style={styles.jobListsWrap}>
            <NewRequestsCard
              wrap
              setShowRequestedModal={setShowRequestedModal}
            />
            <NewRequestsCard
              wrap
              setShowRequestedModal={setShowRequestedModal}
            />
            <NewRequestsCard
              wrap
              setShowRequestedModal={setShowRequestedModal}
            />
            <NewRequestsCard
              wrap
              setShowRequestedModal={setShowRequestedModal}
            />
            <NewRequestsCard
              wrap
              setShowRequestedModal={setShowRequestedModal}
            />
            <NewRequestsCard
              wrap
              setShowRequestedModal={setShowRequestedModal}
            />
            <NewRequestsCard
              wrap
              setShowRequestedModal={setShowRequestedModal}
            />
            <NewRequestsCard
              wrap
              setShowRequestedModal={setShowRequestedModal}
            />
            <NewRequestsCard
              wrap
              setShowRequestedModal={setShowRequestedModal}
            />
          </View>
        ) : activeFilter === "all" ? (
          <ScrollView
            style={styles.jobLists}
            contentContainerStyle={styles.jobListsContainer}
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
          >
            <NewRequestsCard setShowRequestedModal={setShowRequestedModal} />
            <NewRequestsCard setShowRequestedModal={setShowRequestedModal} />
            <NewRequestsCard setShowRequestedModal={setShowRequestedModal} />
            <NewRequestsCard setShowRequestedModal={setShowRequestedModal} />
            <NewRequestsCard setShowRequestedModal={setShowRequestedModal} />
            <NewRequestsCard setShowRequestedModal={setShowRequestedModal} />
            <NewRequestsCard setShowRequestedModal={setShowRequestedModal} />
            <NewRequestsCard setShowRequestedModal={setShowRequestedModal} />
            <NewRequestsCard setShowRequestedModal={setShowRequestedModal} />
          </ScrollView>
        ) : (
          <></>
        )}

        {/***** current jobs */}
        {(activeFilter === "all" || activeFilter === "completed") && (
          <Text style={styles.title}>Completed Jobs</Text>
        )}
        {activeFilter === "completed" ? (
          <View style={styles.jobListsWrap}>
            <CompletedJobsCards
              wrap
              setShowCompletedModal={setShowCompletedModal}
            />
            <CompletedJobsCards
              wrap
              setShowCompletedModal={setShowCompletedModal}
            />
            <CompletedJobsCards
              wrap
              setShowCompletedModal={setShowCompletedModal}
            />
            <CompletedJobsCards
              wrap
              setShowCompletedModal={setShowCompletedModal}
            />
            <CompletedJobsCards
              wrap
              setShowCompletedModal={setShowCompletedModal}
            />
            <CompletedJobsCards
              wrap
              setShowCompletedModal={setShowCompletedModal}
            />
            <CompletedJobsCards
              wrap
              setShowCompletedModal={setShowCompletedModal}
            />
            <CompletedJobsCards
              wrap
              setShowCompletedModal={setShowCompletedModal}
            />
            <CompletedJobsCards
              wrap
              setShowCompletedModal={setShowCompletedModal}
            />
          </View>
        ) : activeFilter === "all" ? (
          <ScrollView
            style={styles.jobLists}
            contentContainerStyle={styles.jobListsContainer}
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
          >
            <CompletedJobsCards setShowCompletedModal={setShowCompletedModal} />
            <CompletedJobsCards setShowCompletedModal={setShowCompletedModal} />
            <CompletedJobsCards setShowCompletedModal={setShowCompletedModal} />
            <CompletedJobsCards setShowCompletedModal={setShowCompletedModal} />
            <CompletedJobsCards setShowCompletedModal={setShowCompletedModal} />
            <CompletedJobsCards setShowCompletedModal={setShowCompletedModal} />
            <CompletedJobsCards setShowCompletedModal={setShowCompletedModal} />
            <CompletedJobsCards setShowCompletedModal={setShowCompletedModal} />
            <CompletedJobsCards setShowCompletedModal={setShowCompletedModal} />
          </ScrollView>
        ) : (
          <></>
        )}
      </ScrollView>

      {showMap.visible && <Map showMap={showMap} setShowMap={setShowMap} />}
      {/*** request details */}
      {showRequestedModal && (
        <CustomModal setShowModal={setShowRequestedModal}>
          <RequestJobDetails details={"details"} />
        </CustomModal>
      )}

      {/*** completed jobs details */}
      {showCompletedModal && (
        <CustomModal setShowModal={setShowCompletedModal}>
          <CompletedJobDetails details={"details"} />
        </CustomModal>
      )}
    </View>
  );
};

export default ServiceApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    position: "relative",
  },

  intro: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },

  profileImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
  },

  introDetails: {},
  welcome: {
    fontSize: 18,
    color: "#555",
    fontWeight: "800",
  },

  info: {
    fontSize: 15,
    color: "#555",
  },

  menu: {
    marginLeft: "auto",
  },

  /***** filters */
  filters: {
    maxHeight: 50,
  },

  filtersContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 15,
    gap: 15,
  },

  filter: {
    paddingBottom: 5,
    paddingHorizontal: 14,
    borderBottomColor: "#35b2a5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  filterText: {
    fontWeight: "500",
    color: "#555c",
  },

  /**** job lists */
  title: {
    fontSize: 15,
    color: "#333a",
    fontWeight: "800",
    marginLeft: 15,
    marginBottom: 10,
  },

  jobListsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    paddingHorizontal: 15,
  },

  jobLists: {
    marginBottom: 20,
    maxHeight: 180,
  },

  jobListsContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 15,
  },
});
