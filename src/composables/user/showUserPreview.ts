import { ref, computed } from "vue";

const showPreview = ref(false);
const userId = ref("");
const username = ref("");
const uniqueAttribute = ref("");
const defaultTab = ref("about");

const allTabs = [
  {
    // tab name
    name: "About",
    // tab icon
    iconClass: "",
    // component name in userPreview.vue
    component: "About",
    // unique id for tab - the one that'll get passed from different components
    key: "about",
  },
  {
    name: "Assets",
    iconClass: "",
    component: "Assets",
    key: "assets",
  },
  {
    name: "Groups",
    iconClass: "",
    component: "Groups",
    key: "groups",
  },
  {
    name: "Sessions",
    iconClass: "",
    component: "Sessions",
    key: "sessions",
  },
  {
    name: "Access Logs",
    iconClass: "",
    component: "AccessLogs",
    key: "accessLogs",
  },
];

const blacklistedTabs = ref([]);
const allowedTabs = ref([]);
const finalTabs = computed(() => {
  if (allowedTabs.value && allowedTabs.value.length)
    return allTabs.filter((tab) => allowedTabs.value.includes(tab.key));
  return allTabs.filter((tab) => !blacklistedTabs.value.includes(tab.key));
});

export function useUserPreview() {
  const showUserPreview = (config?: { allowed?: any; blacklisted?: any }) => {
    blacklistedTabs.value = [...(config?.blacklisted || [])];
    allowedTabs.value = [...(config?.allowed || [])];
    showPreview.value = true;
  };
  const closePreview = () => {
    blacklistedTabs.value = [];
    allowedTabs.value = [];
    showPreview.value = false;
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
  const setAllowedTabs = (tabs) => {
    allowedTabs.value = [...tabs];
  };
  const setBlackListedTabs = (tabs) => {
    blacklistedTabs.value = [...tabs];
  };
  const setDefaultTab = (tab) => {
    defaultTab.value = tab;
  };

  return {
    showPreview,
    userId,
    setUserUniqueAttribute,
    setAllowedTabs,
    setBlackListedTabs,
    uniqueAttribute,
    username,
    finalTabs,
    showUserPreview,
    closePreview,
    defaultTab,
    setDefaultTab,
  };
}
