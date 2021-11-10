<template>
    <div class="h-full pb-6">
        <div
            v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
            class="flex flex-col items-center justify-center h-full bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <AtlanButton
                        color="secondary"
                        @click="
                            () => {
                                getGroup()
                            }
                        "
                    >
                        <AtlanIcon icon="Reload" />
                        Try again
                    </AtlanButton>
                </div>
            </ErrorView>
        </div>
        <template v-else-if="selectedGroup && selectedGroup.id">
            <div class="relative flex m-6">
                <div class="ml-3">
                    <div class="text-xl capitalize text-gray">
                        {{ selectedGroup.name }}
                    </div>
                    <AtlanIcon
                        icon="Cross"
                        class="absolute top-0 right-0 cursor-pointer"
                        @click="$emit('close')"
                    />
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
                :class="$style.previewtab"
                tab-position="left"
                class="border-t"
            >
                <a-tab-pane v-for="(tab, index) in tabs" :key="tab.key">
                    <template #tab>
                        <SidePanelTabHeaders
                            :title="tab.name"
                            :icon="tab.icon"
                            :is-active="activeKey === tab.key"
                            :active-icon="tab.activeIcon"
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
        </template>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, defineAsyncComponent } from 'vue'
    import ErrorView from '@common/error/index.vue'
    import { useGroup } from '~/composables/group/useGroups'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'

    export default defineComponent({
        name: 'GroupPreview',
        components: {
            About: defineAsyncComponent(() => import('./about.vue')),
            Members: defineAsyncComponent(() => import('./members.vue')),
            ErrorView,
            Assets: defineAsyncComponent(
                () => import('~/components/admin/users/userPreview/assets.vue')
            ),
            SidePanelTabHeaders,
        },
        emits: ['close'],
        setup(props, context) {
            const {
                groupId,
                groupAlias,
                defaultTab,
                uniqueAttribute,
                finalTabs,
            } = useGroupPreview()
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
            @apply p-0 justify-center !important;
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
