<template>
  <div class="grid grid-cols-7 h-full">
    <div class="col-span-2 h-full bg-gray-50 shadow-inner">
      <div class="px-5 text-center mt-4">
        <img :src="displayNameHTML" class="mr-0" />
      </div>

      <a-menu mode="inline" class="bg-transparent">
        <a-menu-item key="1">
          <span>Home</span>
        </a-menu-item>
        <a-menu-item-group title="Discover">
          <a-menu-item key="2">
            <span>Assets</span>
          </a-menu-item>
          <a-menu-item key="2">
            <span>Terms</span>
          </a-menu-item>
          <a-menu-item key="2">
            <span>Connections</span>
          </a-menu-item>
          <a-menu-item key="2">
            <span>Projects</span>
          </a-menu-item>
        </a-menu-item-group>
      </a-menu>
    </div>
    <div class="col-span-5 bg-white">
      <SearchBox></SearchBox>
      <div class="text-base">Good Morning, Varun</div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";

import { useStore } from "~/store";
import { useWebWorkerFn } from "@vueuse/core";
import { ActionTypes } from "~/store/modules/entitydef/types-action";

import KeycloakMixin from "~/mixins/keycloak";

import PageLoader from "@common/loaders/page.vue";
import SearchBox from "@common/searchbox/searchlist.vue";

export default defineComponent({
  name: "HelloWorld",
  mixins: [KeycloakMixin],
  components: {
    PageLoader,
    SearchBox,
  },
  props: {
    msg: {
      type: String,
      default: "",
    },
  },
  mounted() {
    console.log("mounted");
  },
  setup() {
    const app = getCurrentInstance();
    console.log(app.appContext.config.globalProperties.$keycloak);
    // const handleLogout = () => {
    //   console.log(
    //     app.appContext.config.globalProperties.$keycloak.keycloak.logout({
    //       redirectUri: window.location.origin,
    //     })
    //   );
    // };
    return {};
  },
});
</script>



<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>