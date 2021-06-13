


<template>
  <SidebarTabs
    :list="List"
    tabPostion="left"
    :defaultActiveKey="activeKey"
    :class="$style.sidebartab"
    @change="handleChange"
  ></SidebarTabs>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import { RouteLocationRaw } from "vue-router";
import { List } from "./list";
import SidebarTabs from "@common/tabs/line.vue";

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
        let url: RouteLocationRaw = find.url;
        this.$router.push(url);
      }
    },
  },
});
</script>
  
  
  
<style lang="less" module>
.sidebartab {
  :global(.ant-tabs-tab) {
    @apply text-primary-500 !important;
    padding: 6px 8px !important;
    max-width: 48px !important;
  }
  :global(.ant-tabs-ink-bar) {
    @apply bg-primary-200;
    right: 0px !important;
    border-top-right-radius: 1px !important;
    border-bottom-right-radius: 1px !important;
    width: 0px !important;
    right: auto !important;
  }
  :global(.ant-tabs-left-bar) {
    border: 0px !important;
    min-width: 48px !important;
  }
  :global(.ant-tabs-nav-container) {
    margin-right: 0px !important;
  }

  :global(.ant-tabs-nav-wrap) {
    margin-right: 0px !important;
  }
  :global(.ant-tabs-tab-active) {
    @apply bg-gray-200 bg-opacity-10 text-primary-500 !important;
    transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>
  