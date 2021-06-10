import { defineComponent, getCurrentInstance } from "vue";
import { useStore } from "~/store";

export default defineComponent({
  props: {},
  computed: {
    isReady() {
      const app = getCurrentInstance();
      if (app.appContext.config.globalProperties.$keycloak) {
        return app.appContext.config.globalProperties.$keycloak.ready;
      } else {
        return false;
      }
    },
    name() {
      const app = getCurrentInstance();
      console.log(app);
      if (app.appContext.config.globalProperties.$keycloak) {
        return app.appContext.config.globalProperties.$keycloak.tokenParsed.name;
      }
      return "";
    },
    username() {
      const app = getCurrentInstance();
      if (app.appContext.config.globalProperties.$keycloak) {
        return app.appContext.config.globalProperties.$keycloak.tokenParsed.username;
      }
      return "";
    },
    displayName() {
      const store = useStore();
      return store.getters.getDisplayName;
    },
    displayNameHTML() {
      const store = useStore();
      return store.getters.getDisplayNameHTML;
    },
    realm() {
      const store = useStore();
      return store.getters.getRealmName;
    },
  },
  methods: {},
});
