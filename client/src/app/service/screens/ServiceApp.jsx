import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

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
import useGetFeed from "../hooks/useFeed";
import { useGlobalState } from "../../../context/GlobalState";

const userImage = `https://avatar.iran.liara.run/public/boy?username=chad${Math.floor(
  Math.random() * 201 + 100
)}`;

const { width, height } = Dimensions.get("window");
const ServiceApp = () => {
  const insets = useSafeAreaInsets();
  const { user } = useGlobalState();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showRequestedModal, setShowRequestedModal] = useState({
    visible: false,
    details: undefined,
  });
  const [showCompletedModal, setShowCompletedModal] = useState({
    visible: false,
    details: undefined,
  });
  const [feed, setFeed] = useState({
    accepted: [],
    pending: [],
    completed: [],
  });
  const [showMap, setShowMap] = useState({
    visible: false,
    details: undefined,
  });
  const [loading, fetchFeed] = useGetFeed();
  const [aLoading, setALoading] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [cLoading, setCLoading] = useState(false);

  const loadFeed = async (type) => {
    if (type === "accepted") {
      setALoading(true);
    } else if (type === "pending") {
      setPLoading(true);
    } else {
      setCLoading(true);
    }
    try {
      const data = await fetchFeed(type);
      if (!data) {
        setFeed((prev) => ({ ...prev, [type]: "failed" }));
        return;
      }

      if (data && data.length === 0) {
        setFeed((prev) => ({ ...prev, [type]: "empty" }));
        return;
      }

      setFeed((prev) => ({ ...prev, [type]: data }));
    } catch (error) {
      console.log("error: ", error);
    } finally {
      if (type === "accepted") {
        setALoading(false);
      } else if (type === "pending") {
        setPLoading(false);
      } else {
        setCLoading(false);
      }
    }
  };

  useEffect(() => {
    loadFeed("accepted");
    loadFeed("pending");
    loadFeed("completed");
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/**** intro */}
      <View style={styles.intro}>
        <View style={[styles.profileImage, { backgroundColor: "#0003" }]}>
          {user?.photo && (
            <Image
              source={{
                uri: user.photo,
              }}
              style={styles.profileImage}
            />
          )}
        </View>

        <View style={styles.introDetails}>
          <Text style={styles.welcome}>Howdy, {user?.name}</Text>
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
            {aLoading ? (
              <Loader />
            ) : feed.accepted === "empty" ? (
              <FailedEmpty
                title="You have no current jobs"
                btnText="Check again"
                onPress={() => loadFeed("accepted")}
              />
            ) : feed.accepted === "failed" ? (
              <FailedEmpty
                title="Failed to get current jobs"
                btnText="Try again"
                onPress={() => loadFeed("accepted")}
              />
            ) : (
              <>
                {feed.accepted.map((job) => (
                  <CurrentJobCards
                    key={job._id}
                    job={job}
                    wrap
                    showMap={showMap}
                    setShowMap={setShowMap}
                  />
                ))}
              </>
            )}
          </View>
        ) : activeFilter === "all" ? (
          <ScrollView
            style={styles.jobLists}
            contentContainerStyle={styles.jobListsContainer}
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
          >
            {aLoading ? (
              <Loader />
            ) : feed.accepted === "empty" ? (
              <FailedEmpty
                title="You have no current jobs"
                btnText="Check again"
                onPress={() => loadFeed("accepted")}
              />
            ) : feed.accepted === "failed" ? (
              <FailedEmpty
                title="Failed to get current jobs"
                btnText="Try again"
                onPress={() => loadFeed("accepted")}
              />
            ) : (
              <>
                {feed.accepted.map((job) => (
                  <CurrentJobCards
                    key={job._id}
                    job={job}
                    showMap={showMap}
                    setShowMap={setShowMap}
                  />
                ))}
              </>
            )}
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
            {pLoading ? (
              <Loader />
            ) : feed.pending === "empty" ? (
              <FailedEmpty
                title="You haven't received any job requests yet"
                btnText="Check again"
                onPress={() => loadFeed("pending")}
              />
            ) : feed.pending === "failed" ? (
              <FailedEmpty
                title="Failed to get pending jobs"
                btnText="Try again"
                onPress={() => loadFeed("pending")}
              />
            ) : (
              <>
                {feed.pending.map((job) => (
                  <NewRequestsCard
                    key={job._id}
                    job={job}
                    wrap
                    setShowRequestedModal={setShowRequestedModal}
                  />
                ))}
              </>
            )}
          </View>
        ) : activeFilter === "all" ? (
          <ScrollView
            style={styles.jobLists}
            contentContainerStyle={styles.jobListsContainer}
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
          >
            {pLoading ? (
              <Loader />
            ) : feed.pending === "empty" ? (
              <FailedEmpty
                title="You haven't received any job requests yet"
                btnText="Check again"
                onPress={() => loadFeed("pending")}
              />
            ) : feed.pending === "failed" ? (
              <FailedEmpty
                title="Failed to get pending jobs"
                btnText="Try again"
                onPress={() => loadFeed("pending")}
              />
            ) : (
              <>
                {feed.pending.map((job) => (
                  <NewRequestsCard
                    key={job._id}
                    job={job}
                    setShowRequestedModal={setShowRequestedModal}
                  />
                ))}
              </>
            )}
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
            {cLoading ? (
              <Loader />
            ) : feed.completed === "empty" ? (
              <FailedEmpty
                title="You haven't completed any jobs yet"
                btnText="Check again"
                onPress={() => loadFeed("completed")}
              />
            ) : feed.completed === "failed" ? (
              <FailedEmpty
                title="Failed to get completed jobs"
                btnText="Try again"
                onPress={() => loadFeed("completed")}
              />
            ) : (
              <>
                {feed.completed.map((job) => (
                  <CompletedJobsCards
                    key={job._id}
                    job={job}
                    wrap
                    setShowCompletedModal={setShowCompletedModal}
                  />
                ))}
              </>
            )}
          </View>
        ) : activeFilter === "all" ? (
          <ScrollView
            style={styles.jobLists}
            contentContainerStyle={styles.jobListsContainer}
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
          >
            {cLoading ? (
              <Loader />
            ) : feed.completed === "empty" ? (
              <FailedEmpty
                title="You haven't completed any jobs yet"
                btnText="Check again"
                onPress={() => loadFeed("completed")}
              />
            ) : feed.completed === "failed" ? (
              <FailedEmpty
                title="Failed to get completed jobs"
                btnText="Try again"
                onPress={() => loadFeed("completed")}
              />
            ) : (
              <>
                {feed.completed.map((job) => (
                  <CompletedJobsCards
                    key={job._id}
                    job={job}
                    setShowCompletedModal={setShowCompletedModal}
                  />
                ))}
              </>
            )}
          </ScrollView>
        ) : (
          <></>
        )}
      </ScrollView>

      {showMap.visible && <Map showMap={showMap} setShowMap={setShowMap} />}
      {/*** request details */}
      {showRequestedModal.visible && (
        <CustomModal setShowModal={setShowRequestedModal}>
          <RequestJobDetails
            details={showRequestedModal.details}
            setShowRequestedModal={setShowRequestedModal}
            setFeed={setFeed}
          />
        </CustomModal>
      )}

      {/*** completed jobs details */}
      {showCompletedModal.visible && (
        <CustomModal setShowModal={setShowCompletedModal}>
          <CompletedJobDetails details={showCompletedModal} />
        </CustomModal>
      )}
    </View>
  );
};

const Loader = () => {
  return (
    <View style={[styles.jobLists, styles.loader]}>
      <ActivityIndicator size="large" color="#35b2a5" />
    </View>
  );
};

const FailedEmpty = ({ title, btnText, onPress }) => {
  return (
    <View style={[styles.jobLists, styles.loader]}>
      <Text style={styles.failedEmptyTitle}>{title}</Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.failedEmptyBtn}
      >
        <Text style={styles.failedEmptyBtnText}>{btnText}</Text>
      </TouchableOpacity>
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
  loader: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },

  failedEmptyTitle: {
    fontSize: 15,
    color: "#555a",
    fontWeight: "800",
  },

  failedEmptyBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#35b2a5",
    marginTop: 10,
  },

  failedEmptyBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#35b2a5",
  },

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
    height: 180,
  },

  jobListsContainer: {
    minWidth: width,
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 15,
  },
});
