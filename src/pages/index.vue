<template>
  <div class="grid h-full grid-cols-12">
    <div class="h-full col-span-3 shadow-inner bg-gray-50">
      <div class="flex items-center p-3 border-b border-gray-200">
        <a-avatar
          :size="42"
          class="border-2 border-primary-300"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />

        <div class="flex flex-col ml-2">
          <p class="mb-0 text-base">{{ name }}</p>
          <p class="mb-0 text-sm text-gray-500">
            {{ username }}
          </p>
        </div>
      </div>

      <!-- <a-menu mode="inline" class="bg-transparent">
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
      </a-menu> -->
    </div>
    <div class="col-span-9 bg-white">
      <div class="flex justify-center pt-6 pb-10 align-middle border-b">
        <div>
          <img :src="displayNameHTML" class="mr-0" />
        </div>
      </div>

      <div class="flex px-6 -mt-4">
        <a-input placeholder="Command Center"></a-input>
        <a-button-group class="ml-2">
          <a-button>Button</a-button>
          <a-button>Button</a-button>
        </a-button-group>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";

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