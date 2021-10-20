<template>
    <div class="h-full py-6">
        <div
            v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
            class="flex flex-col items-center justify-center h-full bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <a-button
                        size="large"
                        type="primary"
                        ghost
                        @click="
                            () => {
                                getGroup()
                            }
                        "
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
        <div v-else-if="selectedGroup && selectedGroup.id">
            <div class="flex px-6 pb-6 border-b">
                <div class="ml-3">
                    <div class="text-xl capitalize text-gray">
                        {{ selectedGroup.name }}
                    </div>
                    <div class="text-gray-500">
                        <span class="mr-1">@{{ selectedGroup.alias }}</span>
                        <span v-if="selectedGroup.memberCountString">
                            <span class="text-gray-300">|</span>
                            <span class="ml-1">{{
                                selectedGroup.memberCountString
                            }}</span>
                        </span>
                    </div>
                </div>
            </div>
            <a-tabs
                v-model:activeKey="activeKey"
                tab-position="left"
                :class="$style.previewtab"
            >
                <a-tab-pane v-for="tab in tabs" :key="tab.key">
                    <template #tab>
                        <SidePanelTabHeaders
                            :title="tab.name"
                            :icon="tab.icon"
                            :isActive="activeKey === tab.key"
                            :activeIcon="tab.activeIcon"
                            :class="index === 0 ? 'mt-1' : ''"
                        />
                    </template>
                    <!-- <template #tab>
                        <span class="mb-0">{{ tab.name }}</span>
                    </template> -->
                    <component
                        :is="tab.component"
                        class="px-6 pt-3 overflow-auto component-height"
                        :selected-group="selectedGroup"
                        @refreshTable="getGroup"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import ErrorView from '@common/error/index.vue'
import {
    getNameInitials,
    getNameInTitleCase,
} from '~/composables/utils/string-operations'
import About from './about.vue'
import Members from './members.vue'
import Assets from '~/components/admin/users/userPreview/assets.vue'
import { useGroup } from '~/composables/group/useGroups'
import { useGroupPreview } from '~/composables/drawer/showGroupPreview'
import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'

export default defineComponent({
    name: 'GroupPreview',
    components: {
        About,
        Members,
        ErrorView,
        Assets,
        SidePanelTabHeaders,
    },
    setup(props, context) {
        const { groupId, groupAlias, defaultTab, uniqueAttribute, finalTabs } =
            useGroupPreview()
        const activeKey = defaultTab
        let filterObj = {}
        if (uniqueAttribute.value === 'groupAlias')
            filterObj = {
                $and: [{ name: groupAlias.value }],
            }
        else filterObj = { $and: [{ id: groupId.value }] }
        const { groupList, getGroup, state, STATES } = useGroup({
            limit: 1,
            offset: 0,
            // sort: "alias",
            filter: filterObj,
        })
        const groupObj = computed(() =>
            groupList && groupList.value && groupList.value.length
                ? groupList.value[0]
                : []
        )
        return {
            getNameInitials,
            getNameInTitleCase,
            tabs: finalTabs,
            getGroup,
            activeKey,
            selectedGroup: groupObj,
            state,
            STATES,
        }
    },
})
</script>
  
<style lang="less" module>
.component-height {
    max-height: calc(100vh - 12rem);
}
.previewtab {
    :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
        @apply ml-0 !important;
        @apply mt-4 !important;
    }

    :global(.ant-tabs-bar) {
        margin-bottom: 0px !important;
    }
    :global(.ant-tabs-nav-container) {
        width: 48px !important;
        @apply ml-0 !important;
    }
    :global(.ant-tabs-tab) {
        height: 48px !important;
        width: 48px !important;
        @apply p-0 !important;
    }

    :global(.ant-tabs-content) {
        @apply px-0 !important;
    }
    :global(.ant-tabs-ink-bar) {
        @apply rounded-t-sm;
        margin-bottom: 1px;
    }
    :global(.ant-tabs-tabpane) {
        @apply px-0 !important;
        @apply pb-0 !important;
    }
}
</style>
  