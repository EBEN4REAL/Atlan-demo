<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <div
        class="items-center justify-center border border-gray-200 rounded-lg"
        :class="isLoading ? `flex flex-grow` : `hidden`"
        style="height: 350px"
    >
        <AtlanLoader class="h-10" />
    </div>
    <a-tabs
        v-model:activeKey="relevantTab"
        :class="[$style.hometab, isLoading ? `hidden` : ``]"
        class="px-6 py-1.5 border border-gray-200 rounded-lg"
        @change="selectRelevantTab($event)"
    >
        <a-tab-pane
            v-for="tab in relevantTabList"
            :key="tab.id"
            :tab="tab.name"
            style="height: 350px"
            force-render
        >
            <component
                :is="tab.component"
                :username="myUsername"
                :type-names="tab.typeName"
                :initial-filters="tab.filter"
                :icon="tab.icon"
                :empty-text="tab.emptyText"
                :preference="tab.preference"
                :dependent-key="tab.dependentKey"
                @list-loaded="listLoaded(tab.id, $event)"
            />
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        defineAsyncComponent,
        computed,
        watch,
    } from 'vue'
    import whoami from '~/composables/user/whoami'
    import AssetList from '~/components/home/assets/index.vue'

    export default defineComponent({
        name: 'Relevant',
        components: {
            AssetList,
            recentlyViewedAssets: defineAsyncComponent(
                () => import('~/components/home/recentlyViewedAssets.vue')
            ),
        },
        setup() {
            const relevantTab = ref('2')
            const { username: myUsername } = whoami()
            const assetCounts = ref({})
            const relevantTabList = ref([
                {
                    id: '2',
                    name: 'My Assets',
                    component: 'AssetList',
                    typeName: ['Table'],
                    icon: 'NoRelevantAsset',
                    filter: {
                        owners: {
                            ownerUsers: [myUsername.value],
                        },
                    },
                    emptyText: 'All your assets will appear here.',
                    preference: undefined,
                    dependentKey: 'DEFAULT_ASSET_LIST_HOME',
                    assetCount: 0,
                },
                {
                    id: '3',
                    name: 'Recently Verified Assets',
                    component: 'AssetList',
                    typeName: ['Table'],
                    icon: 'NoRelevantAsset',
                    filter: {
                        certificateStatus: ['VERIFIED'],
                    },
                    emptyText:
                        'The most recently verified assets will show up here.',
                    preference: {
                        sort: 'certificateUpdatedAt-desc',
                    },
                    dependentKey: 'DEFAULT_ASSET_LIST_RECENTLY_VERIFIED',
                    assetCount: 0,
                },
            ])

            /**
             * ATTENTION, CODER: The part of code under this comment will
             * need to be changed if additional tabs are added in the future.
             */

            // If we have been able to fetch the number of assets of each tab
            const isLoading = computed(
                () =>
                    Object.keys(assetCounts.value).length !==
                    relevantTabList.value.length
            )

            /**
             * A utility function to select the active tab.
             * @param val
             */
            const selectRelevantTab = (val: string) => {
                relevantTab.value = val
            }

            /**
             * If the list has been loaded, store the number of assets.
             * @param tabId
             * @param assetCount
             */
            const listLoaded = (tabId: string, assetCount: number) => {
                const indexOfTab = relevantTabList.value.findIndex(
                    (tab) => tab.id === tabId
                )
                relevantTabList.value[indexOfTab].assetCount = assetCount
                assetCounts.value[tabId] = assetCount
            }

            // When we have fetched all asset counts, reverse the order of tabs
            // if the user does not own any assets.
            watch(isLoading, () => {
                if (!isLoading.value) {
                    if (relevantTabList.value[0].assetCount === 0) {
                        relevantTabList.value.reverse()
                        relevantTab.value = relevantTabList.value[0].id
                    }
                }
            })

            return {
                relevantTab,
                relevantTabList,
                selectRelevantTab,
                myUsername,
                isLoading,
                listLoaded,
            }
        },
    })
</script>

<style lang="less" module>
    .hometab {
        :global(.ant-tabs-nav) {
            @apply mb-0 !important;
        }
    }
</style>
