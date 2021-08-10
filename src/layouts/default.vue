<template>
  <a-layout class="min-h-full">
    <a-layout-header
      class="h-12 p-0 m-0"
    >
      <div
        class="flex px-4 bg-white text-gray border-b justify-between h-full"
      >
        <div class="flex flex-row items-center text-base font-bold space-x-8">
            <img
            src="https://atlan.com/assets/img/logo.40c9d1d3.svg"
            class="w-auto h-3  cursor-pointer"
          />

          <div class="cursor-pointer">Discover</div>
          <div class="cursor-pointer">Glossary</div>
          <div class="cursor-pointer">Insights</div>
          <div class="cursor-pointer">Connectors</div>
        </div>
        
        <div class="flex items-center space-x-6">
          <a-input
            placeholder="Search Atlan"
            size="small"
            class="h-8 rounded "
            style= "background: #F0F2F7"
          >
          </a-input>
          <div class="cursor-pointer">Admin</div>
          <fa icon="fal bell w-3"></fa>
          <div class="flex text-center items-center">
            <UserPersonalAvatar></UserPersonalAvatar>
          </div>
        </div>
      </div>
    </a-layout-header>

    <a-layout class="h-full">
      <a-layout-content
        class="overflow-hidden"
        style="height: calc(100vh - 32px) !important"
      >
        <router-view class="flex-grow" />
      </a-layout-content>
    </a-layout>
  </a-layout>
  <PreviewDrawer />
  <!-- <div class="mx-auto mt-5" @click="themeToggle">[Default Layout]</div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PageLoader from "@common/loaders/page.vue";
import KeycloakMixin from "~/mixins/keycloak";
import Sidebar from "./sidebar/index.vue";
import UserPersonalAvatar from "~/components/common/avatar/me.vue";
import PreviewDrawer from "~/components/common/previewDrawer.vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    PageLoader,
    Sidebar,
    UserPersonalAvatar,
    PreviewDrawer,
  },
  mixins: [KeycloakMixin],
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

.sidebar {
  @apply bg-gradient-to-b from-primary-600 via-primary-700 to-primary-800    !important;
  .sidebartab {
    :global(.ant-tabs-tab) {
      @apply text-primary-muted !important;
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
      @apply bg-primary-100 bg-opacity-5 text-primary-muted !important;
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
//       @apply text-primary-muted mb-3 rounded-lg ease-in transition-colors text-center text-xl leading-6 !important;
//       padding: 8px 0px !important;
//       margin-left: 6px !important;

//       margin-right: 6px !important;
//       height: inherit !important;

//       &:global(.ant-menu-item-selected) {
//         @apply bg-gray-50 text-primary !important;
//       }
//     }
//   }
// }
</style>
