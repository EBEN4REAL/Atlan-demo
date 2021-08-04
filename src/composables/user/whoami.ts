import { computed, getCurrentInstance } from "vue";

export default function whoami() {
  const app = getCurrentInstance();
  const name = computed(() => app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed
      ?.name);
  const username = computed(() => app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed
      ?.username);
  const role = computed(() => app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed
      ?.role);
  const user =
    app?.appContext?.config?.globalProperties?.$keycloak?.tokenParsed;
  return {
    name,
    username,
    role,
    user,
  };
}
