


<template>
  <SidebarTabs
    class="flex-grow"
    :list="List"
    tab-postion="left"
    :default-active-key="activeKey"
    :class="$style.sidebartab"
    @change="handleChange"
  ></SidebarTabs>
</template>E
  
<script lang="ts">
import { defineComponent } from "vue";
import { RouteLocationRaw } from "vue-router";
import SidebarTabs from "@common/tabs/line.vue";
import { List } from "./list";

export default defineComponent({
  name: "HelloWorld",
  components: {
    SidebarTabs,
  },
  props: {},
  data() {
    return {
      List,
      activeKey: "",
    };
  },
  mounted() {
    const find = this.List.find(
      (item) => item.url == this.$router.currentRoute.value.path
    );
    if (find) {
      this.activeKey = find.id;
    }
  },
  methods: {
    handleChange(activeKey: any) {
      const find = this.List.find((item) => item.id == activeKey);
      if (find) {
        this.activeKey = find.id;
        const {url} = find;
        this.$router.push(url);
      }
    },
  },
});
</script>
  
  
  
<style lang="less" module>
.sidebartab {
  :global(.ant-tabs-tab) {
    @apply text-primary-light !important;
    padding: 8px 12px !important;
    max-width: 60px !important;
    //   min-height: 48px !important;
    //   line-height: 40px;
  }
  :global(.ant-tabs-ink-bar) {
    @apply bg-primary-light;
    right: 0px !important;
    border-top-right-radius: 1px !important;
    border-bottom-right-radius: 1px !important;
    width: 0px !important;
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
    @apply bg-gray-100 bg-opacity-10 text-white !important;
    transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>
  