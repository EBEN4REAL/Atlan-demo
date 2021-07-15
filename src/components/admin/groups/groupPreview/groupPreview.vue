<template>
  <div class="h-full py-6">
    <div
      class="flex flex-col items-center justify-center h-full bg-white"
      v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
    >
      <ErrorView>
        <div class="mt-3">
          <a-button
            size="large"
            type="primary"
            ghost
            @click="
              () => {
                getGroup();
              }
            "
          >
            <fa icon="fal sync" class="mr-2"></fa>Try again
          </a-button>
        </div>
      </ErrorView>
    </div>
    <div v-else-if="selectedGroup && selectedGroup.id">
      <div class="flex px-6 mb-3">
        <div class="ml-3">
          <div class="text-lg font-bold capitalize cursor-pointer text-gray">
            {{ selectedGroup.name }}
          </div>
        </div>
      </div>
      <a-tabs
        :defaultActiveKey="activeKey"
        :tabBarStyle="{ paddingLeft: '1rem', paddingRight: '1rem' }"
      >
        <a-tab-pane v-for="tab in tabs" :key="tab.key">
          <template #tab>
            <span class="mb-0">{{ tab.name }}</span>
          </template>
          <component
            class="px-6 overflow-auto component-height"
            :is="tab.component"
            :selectedGroup="selectedGroup"
            @refreshTable="getGroup"
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
import { defineComponent, computed } from "vue";
import About from "./about.vue";
import Members from "./members.vue";
import { useGroup } from "~/composables/group/useGroups";
import { useGroupPreview } from "~/composables/drawer/showGroupPreview";
import ErrorView from "@common/error/index.vue";
export default defineComponent({
  name: "GroupPreview",
  components: {
    About,
    Members,
    ErrorView,
  },
  setup(props, context) {
    const { groupId, groupAlias, defaultTab, uniqueAttribute, finalTabs } =
      useGroupPreview();
    const activeKey = defaultTab;
    let filterObj = {};
    if (uniqueAttribute.value === "groupAlias")
      filterObj = {
        $and: [{ name: groupAlias.value }],
      };
    else filterObj = { $and: [{ id: groupId.value }] };
    const { groupList, getGroup, state, STATES } = useGroup({
      limit: 1,
      offset: 0,
      // sort: "alias",
      filter: filterObj,
    });
    const groupObj = computed(() => {
      return groupList && groupList.value && groupList.value.length
        ? groupList.value[0]
        : [];
    });
    return {
      getNameInitials,
      getNameInTitleCase,
      tabs: finalTabs,
      getGroup,
      activeKey,
      selectedGroup: groupObj,
      state,
      STATES,
    };
  },
});
</script>
  
<style lang="less" scoped>
.component-height {
  max-height: calc(100vh - 12rem);
}
</style>
  