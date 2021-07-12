<template>
  <div class="max-h-full">
    <div
      class="flex items-center justify-center h-full"
      v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
    >
      <ErrorView></ErrorView>
    </div>
    <div v-else-if="selectedGroup && selectedGroup.id">
      <div class="flex mb-3">
        <div>
          <a-avatar shape="square" class="mr-1 ant-tag-blue text-gray avatars" :size="48">
            {{
            getNameInitials(getNameInTitleCase(selectedGroup.name))
            }}
          </a-avatar>
        </div>
        <div class="ml-3">
          <div
            class="text-lg font-bold capitalize cursor-pointer text-gray"
          >{{ selectedGroup.name }}</div>
        </div>
      </div>
      <a-tabs :defaultActiveKey="activeKey">
        <a-tab-pane v-for="tab in tabs" :key="tab.key">
          <template #tab>
            <span class="mb-0">{{ tab.name }}</span>
          </template>
          <component
            class="overflow-auto component-height"
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
  