<template>
  <div class="max-h-full">
    <div v-if="selectedGroup && selectedGroup.id">
      <div class="flex mb-3">
        <div>
          <a-avatar
            shape="square"
            class="mr-1 ant-tag-blue text-primary-500 avatars"
            :size="48"
          >{{ getNameInitials(getNameInTitleCase(selectedGroup.name)) }}</a-avatar>
        </div>
        <div class="ml-3">
          <div
            class="text-lg font-bold capitalize cursor-pointer text-primary-500"
          >{{ selectedGroup.name }}</div>
        </div>
      </div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="tab in tabs" :key="tab.key">
          <template #tab>
            <span class="mb-0">{{ tab.name }}</span>
          </template>
          <component
            :is="tab.component"
            :selectedGroup="selectedGroup"
            @refreshTable="$emit('refreshTable')"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import {
  getNameInitials,
  getNameInTitleCase,
} from "~/composables//utils/string-operations";
import { defineComponent, computed, ref } from "vue";
import About from "./about.vue";
import Members from "./members.vue";
export default defineComponent({
  name: "GroupPreview",
  components: {
    About,
    Members,
  },
  props: {
    selectedGroup: {
      type: Object,
      default: {},
    },
    defaultTab: {
      type: String,
      default: "members",
    },
  },
  setup(props, context) {
    const activeKey = ref(props.defaultTab);
    const tabs = computed(() => {
      return [
        {
          name: "About",
          iconClass: "",
          component: "About",
          key: "about",
        },
        {
          name: "Members",
          iconClass: "",
          component: "Members",
          key: "members",
        },
      ];
    });
    return {
      getNameInitials,
      getNameInTitleCase,
      tabs,
      activeKey,
    };
  },
});
</script>
  
  <style></style>
  