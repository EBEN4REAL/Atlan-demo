


<template>
  <a-layout class="min-h-full">
    <a-layout-header
      style="height: 32px; padding: 0 0px; line-height: 32px"
      class="shadow-sm"
    >
      <div
        class="flex items-center justify-between px-3 align-middle border-b shadow-sm "
        :class="$style.topbar"
      >
        <div class="flex items-center align-middle">
          <img
            src="https://atlan.com/assets/img/logo.40c9d1d3.svg"
            class="w-auto h-3 mr-3"
          />
          <!-- <a-input
            style="min-width: 400px"
            placeholder="Click or Cmd/Ctrl+K"
            size="small"
            class="text-white placeholder-gray-300 bg-opacity-50 rounded bg-primary-200 border-primary-500"
          >
          </a-input> -->
        </div>
        <div></div>
        <div class="flex space-x-3 text-white">
           
          <fa icon="fal bell w-3"></fa>
          <fa icon="fal gift"></fa>
          <fa icon="fal question-circle"></fa>
          <div class="text-center border-b border-primary-500">
            <UserPersonalAvatar></UserPersonalAvatar>
          </div>
        </div>
      </div>
    </a-layout-header>

    <a-layout class="h-full">
      <a-layout-sider
        :collapsed="true"
        :collapsedWidth="60"
        :class="$style.sidebar"
        :collapsible="false"
      >
        <div class="flex flex-col h-full">
          <Sidebar class="flex-grow mt-2" />
          <a-button
            class="mx-1 mb-3"
            size="large"
            type="ghost"
            @click="handleNewPage"
          >
            <fa icon="fal plug" class="text-white"></fa>
          </a-button>
        </div>
      </a-layout-sider>
      <a-layout-content
        class="overflow-hidden"
        style="height: calc(100vh - 32px) !important"
      >
        <router-view class="flex-grow" />
      </a-layout-content>
    </a-layout>
  </a-layout>
  <!-- <div class="mx-auto mt-5" @click="themeToggle">[Default Layout]</div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KeycloakMixin from "~/mixins/keycloak";
import PageLoader from "@common/loaders/page.vue";
import Sidebar from "./sidebar/index.vue";
import UserPersonalAvatar from "~/components/common/avatar/me.vue";
import { useStore } from "~/store";

export default defineComponent({
  name: "HelloWorld",
  mixins: [KeycloakMixin],
  components: {
    PageLoader,
    Sidebar,
    UserPersonalAvatar,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    handleNewPage() {
      this.$router.push("/connections");
    },
  },

  // mixins: [KeycloakMixin],
  // const getDarkTheme = () => import("~/styles/dark.less");
  // const getLightTheme = () => import("~/styles/light.less");

  //   function themeToggle() {
  //     const htmlTag = document.querySelector("html");
  //     if (htmlTag.classList.contains("dark")) {
  //       htmlTag.className = "light";
  //     } else {
  //       htmlTag.className = "dark";
  //     }

  //     getCurrentTheme().forEach((element: string) => {
  //       if (element === "dark") {
  //         getDarkTheme();
  //       } else {
  //         getLightTheme();
  //       }
  //     });
  //   };

  // const getCurrentTheme = function (): any {
  //   const htmlTag = document.querySelector("html");
  //   return htmlTag?.classList;
  // };
});
</script>



<style lang="less" module>
.topbar {
  @apply bg-gradient-to-b from-primary-500 via-primary-500 to-primary-600    !important;
}

.sidebar {
  @apply bg-gradient-to-b from-primary-500 via-primary-600 to-primary-700    !important;
  .sidebartab {
    :global(.ant-tabs-tab) {
      @apply text-primary-200 !important;
      padding: 8px 12px !important;
      max-width: 60px !important;
    }
    :global(.ant-tabs-ink-bar) {
      @apply bg-primary-600;
      border-top-right-radius: 1px !important;
      border-bottom-right-radius: 1px !important;
      width: 3px !important;
      right: auto !important;
    }
    :global(.ant-tabs-left-bar) {
      border: 0px !important;
      min-width: 60px !important;
    }
    :global(.ant-tabs-nav-container) {
      margin-right: 0px !important;
    }
    :global(.ant-tabs-nav-wrap) {
      margin-right: 0px !important;
    }
    :global(.ant-tabs-tab-active) {
      @apply bg-primary-100 bg-opacity-5 text-primary-100 !important;
      transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
}

// .sidebarMenu {
//   @apply mt-3 !important;
//   width: 48px !important;
//   border: 0px !important;
//   background: transparent !important;

//   &:global(.ant-menu-inline-collapsed) {
//     :global(.ant-menu-item) {
//       @apply text-primary-100 mb-3 rounded-lg ease-in transition-colors text-center text-xl leading-6 !important;
//       padding: 8px 0px !important;
//       margin-left: 6px !important;

//       margin-right: 6px !important;
//       height: inherit !important;

//       &:global(.ant-menu-item-selected) {
//         @apply bg-gray-50 text-primary-500 !important;
//       }
//     }
//   }
// }
</style>
