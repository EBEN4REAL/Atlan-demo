<template>
  <div class="max-h-full">
    <div v-if="selectedUser && selectedUser.id">
      <div class="flex mb-3">
        <div>
          <a-avatar
            shape="square"
            class="mr-1 ant-tag-blue text-primary-500 avatars"
            :size="48"
          >{{ getNameInitials(getNameInTitleCase(selectedUser.name)) }}</a-avatar>
        </div>
        <div class="ml-3">
          <div
            class="text-lg font-bold capitalize cursor-pointer text-primary-500"
          >{{ selectedUser.name }}</div>
        </div>
      </div>
      <a-tabs>
        <a-tab-pane v-for="tab in tabs" :key="tab.name">
          <template #tab>
            <span class="mb-0">{{ tab.name }}</span>
          </template>
          <component
            :is="tab.component"
            :selectedUser="selectedUser"
            @reloadTable="$emit('reloadTable')"
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
} from "~/composables/utils/string-operations";
import whoami from "~/composables/user/whoami";
import { defineComponent, computed } from "vue";
import About from "./about.vue";
import Groups from "./groups.vue";
import AccessLogs from "./accessLogs.vue";
import Sessions from "./sessions.vue";
export default defineComponent({
  name: "UserPreview",
  components: {
    About,
    Groups,
    AccessLogs,
    Sessions,
  },
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
  },
  setup(props, context) {
    const { username } = whoami();
    const tabs = computed(() => {
      let allTabs = [
        {
          name: "About",
          iconClass: "",
          component: "About",
        },
        {
          name: "Groups",
          iconClass: "",
          component: "Groups",
        },
        {
          name: "Sessions",
          iconClass: "",
          component: "Sessions",
        },
        {
          name: "Access Logs",
          iconClass: "",
          component: "AccessLogs",
        },
      ];
      if (props.selectedUser.username === username.value) return allTabs;
      return allTabs.slice(1);
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
    