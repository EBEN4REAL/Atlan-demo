import { defineComponent, getCurrentInstance, computed, inject } from "vue";
import { useStore } from "~/store";

export default defineComponent({
  setup() {
    const store = useStore();
    const keycloak = inject("$keycloak");

    const isReady = () => keycloak.ready ? keycloak.ready : false;
    const name = () => keycloak.name ? keycloak.name : "";
    const username = () => keycloak.tokenParsed ? keycloak.tokenParsed.username : "";

    return {
      isReady,
      name, 
      username,
      displayName: computed(() => store.getters.getDisplayName),
      displayNameHTML: computed(() => store.getters.getDisplayNameHTML),
      realm: computed(() => store.getters.getRealmName),
    };
  },
  computed: {
    // isReady() {
    //   const app = getCurrentInstance();
    //   if (app.appContext.config.globalProperties.$keycloak) {
    //     return app.appContext.config.globalProperties.$keycloak.ready;
    //   } else {
    //     return false;
    //   }
    // },
    // name() {
    //   const app = getCurrentInstance();
    //   console.log(app);
    //   if (app.appContext.config.globalProperties.$keycloak) {
    //     return app.appContext.config.globalProperties.$keycloak.tokenParsed.name;
    //   }
    //   return "";
    // },
    // username() {
    //   const app = getCurrentInstance();
    //   if (app.appContext.config.globalProperties.$keycloak) {
    //     return app.appContext.config.globalProperties.$keycloak.tokenParsed.username;
    //   }
    //   return "";
    // },
    // displayName() {
      
    //   return store.getters.getDisplayName;
    // },
    // displayNameHTML() {
    //   const store = useStore();
    //   return store.getters.getDisplayNameHTML;
    // },
    // realm() {
    //   const store = useStore();
    //   return store.getters.getRealmName;
    // },
  },
  methods: {},
});
