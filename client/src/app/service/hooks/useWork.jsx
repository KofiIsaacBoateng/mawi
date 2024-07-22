import { COMPLETE_WORK } from "../../../utils/ENDPOINTS";

const useCompleteWork = () => {
  const { setAuthStatus } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const Toast = new ToastAPI();

  const completeWork = async (id) => {
    setLoading(true);
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      Toast.error(
        "Verification Error!",
        "Please login again or register if this is your first time."
      );
      setAuthStatus("no-auth");
      await SecureStore.setItemAsync("auth-status", "no-auth");
    }

    try {
      const res = await fetch(`${COMPLETE_WORK}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, data, msg } = await res.json();

      if (success) {
        Toast.success(
          "Job complete added!",
          "Congratulations on completing this job."
        );
        return data;
      } else {
        Toast.error(
          "Request failed!",
          "Failed to complete job! Please try again!"
        );
        console.log(msg);
        return false;
      }
    } catch (error) {
      Toast.error("ERROR!", "Something went wrong please try again");
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, completeWork];
};

export default useCompleteWork;
