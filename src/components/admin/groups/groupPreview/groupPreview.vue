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
      <a-tabs>
        <a-tab-pane v-for="tab in tabs" :key="tab.name">
          <template #tab>
            <span class="mb-0">{{ tab.name }}</span>
          </template>
          <component :is="tab.component" :selectedGroup="selectedGroup" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { getNameInitials, getNameInTitleCase } from "../useGroups";
import { defineComponent, computed } from "vue";
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
  },
  setup(props, context) {
    const tabs = computed(() => {
      return [
        {
          name: "About",
          iconClass: "",
          component: "About",
        },
        {
          name: "Members",
          iconClass: "",
          component: "Members",
        },
      ];
    });
    return {
      getNameInitials,
      getNameInTitleCase,
      tabs,
    };
  },
});
</script>
  
  <style></style>
  