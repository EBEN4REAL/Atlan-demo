<template>
  <div class="max-h-full">
    <div v-if="selectedGroup && selectedGroup.id">
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
          <component :is="tab.component" :selectedGroup="selectedGroup" @refreshTable="getGroup" />
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
export default defineComponent({
  name: "GroupPreview",
  components: {
    About,
    Members,
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
    const { groupList, getGroup } = useGroup({
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
    };
  },
});
</script>
  
  <style></style>
  