<template>
  <a-dropdown>
    <a-avatar
      :size="36"
      class="border-primary-300 border-2"
      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
    />
    <!-- <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              Hover me <a-icon type="down" />
            </a> -->
    <template #overlay>
      <a-menu>
        <a-menu-item>
          <div class="flex items-center">
            <a-avatar
              :size="42"
              class="border-primary-300 border-2"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />

            <div class="flex flex-col ml-2">
              <p class="mb-0 text-base">{{ name }}</p>
              <p class="text-gray-500 mb-0 text-sm">
                {{ username }}
              </p>
            </div>
          </div>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item>
          <a href="javascript:;">View Profile</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;">Admin Centre</a>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item>
          <a href="javascript:;">Help & Support</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;">Releases</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;">Keyboard Shortcuts</a>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item>
          <a href="javascript:;" @click="handleLogout">Logout</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>




<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
import KeycloakMixin from "~/mixins/keycloak";

export default defineComponent({
  name: "HelloWorld",
  mixins: [KeycloakMixin],
  props: {},
  data() {
    return {};
  },
  setup() {
    const app = getCurrentInstance();
    const handleLogout = () => {
      console.log(
        app.appContext.config.globalProperties.$keycloak.keycloak.logout({
          redirectUri: window.location.origin,
        })
      );
    };
    return {
      handleLogout,
    };
  },
});
</script>
  
  
  
<style lang="less" module>
.sidebar {
  @apply bg-gradient-to-b from-primary-600 via-primary-800 to-primary-900    !important;

  .sidebartab {
    :global(.ant-tabs-tab) {
      @apply text-primary-200 !important;
      padding: 8px 12px !important;
      max-width: 60px !important;
      //   min-height: 48px !important;
      //   line-height: 40px;
    }
    :global(.ant-tabs-ink-bar) {
      @apply bg-primary-200;
      right: 0px !important;
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
</style>
  