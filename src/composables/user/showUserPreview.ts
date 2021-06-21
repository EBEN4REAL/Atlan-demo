import { ref } from "vue";
import { getAPIPath, getAxiosClient } from "~/api";
import useUsers from "./useUsers";
import { useUser } from "./useUsers";
const showPreview = ref(false);
const userId = ref("");
const username = ref("");
const uniqueAttribute = ref("");

export function usePreview() {
  const togglePreview = () => {
    if (showPreview.value == false) {
      showPreview.value = true;
    } else {
      showPreview.value = false;
    }
  };
  const setUserUniqueAttribute = (value, key = "id") => {
    if (key === "username") {
      setUserUsername(value);
    } else setUserId(value);
    uniqueAttribute.value = key;
  };
  const setUserId = (id: string) => {
    console.log("setting user id", id);
    userId.value = id;
    console.log("done", userId.value);
  };
  const setUserUsername = (id: string) => {
    console.log("setting user id", id);
    username.value = id;
    console.log("done", username.value);
  };
  const getUser = () => {
    console.log("HERE");
    // const { userList } = useUser({
    //   limit: 1,
    //   offset: 0,
    //   sort: "first_name",
    //   filter: { $and: [{ email_verified: true }, { id: userId.value }] },
    // });

    // await getAxiosClient().get(getAPIPath("auth", "/users"), {
    //   params: { filter: { $and: [{ email_verified: true }, { id: userId }] } },
    // });
    console.log("IN COMPOSABLE", userList.value.records);
    return userList.value.records || [];
  };

  return {
    showPreview,
    togglePreview,
    userId,

    setUserUniqueAttribute,
    uniqueAttribute,
    username,
  };
}
