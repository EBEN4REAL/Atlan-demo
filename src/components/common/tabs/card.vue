


<template>
  <a-tabs
    :tabPosition="tabPosition"
    :class="$style.previewtab"
    v-model:activeKey="activeKey"
    @change="handleChange"
  >
    <a-tab-pane :key="item.id" v-for="item in list">
      <template #tab>
        <a-tooltip :title="item.description" placement="right">
          <p class="mb-0 text-center">
            <fa :icon="item.icon" class="mr-1" />
          </p> </a-tooltip
      ></template> </a-tab-pane
  ></a-tabs>
</template>
      
    <script lang="ts">
import { MenuArray } from "~/types";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<MenuArray>,
      required: false,
      default(): MenuArray {
        return [];
      },
    },
    tabPosition: {
      type: String,
      required: false,
      default(): string {
        return "left";
      },
    },
    defaultActiveKey: {
      type: String,
      required: false,
      default(): string {
        return "";
      },
    },
  },
  data() {
    return {
      localActiveKey: "",
    };
  },
  computed: {
    activeKey: {
      get(): string {
        if (this.localActiveKey) {
          return this.localActiveKey;
        }
        return this.defaultActiveKey;
      },
      // setter
      set(newValue: string) {
        this.localActiveKey = newValue;
      },
    },
  },
  emits: ["change"],
  methods: {
    handleChange(activeKey: string) {
      this.$emit("change", activeKey);
    },
  },
});
</script>
      
      
    <style lang="less" module>
.previewtab {
  :global(.ant-tabs-tab) {
    padding: 6px 8px !important;
    max-width: 60px !important;
    margin-right: 4px !important;
    //   min-height: 48px !important;
    //   line-height: 40px;
  }
  :global(.ant-tabs-bar) {
    margin-bottom: 0px;
    //   min-height: 48px !important;
    //   line-height: 40px;
  }
  //   :global(.ant-tabs-ink-bar) {
  //     @apply bg-primary-200;
  //     right: 0px !important;
  //     border-top-right-radius: 1px !important;
  //     border-bottom-right-radius: 1px !important;
  //     width: 0px !important;
  //     right: auto !important;
  //   }
  //   :global(.ant-tabs-left-bar) {
  //     border: 0px !important;
  //     min-width: 60px !important;
  //   }
  //   :global(.ant-tabs-nav-container) {
  //     margin-right: 0px !important;
  //   }

  //   :global(.ant-tabs-nav-wrap) {
  //     margin-right: 0px !important;
  //   }
  //   :global(.ant-tabs-tab-active) {
  //     @apply bg-gray-100 bg-opacity-10 text-white !important;
  //     transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  //   }
}
</style>
      