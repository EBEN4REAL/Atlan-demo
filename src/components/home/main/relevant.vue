<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <a-tabs
        v-model:activeKey="relevantTab"
        :class="$style.hometab"
        class="px-6 py-1.5 border border-gray-200 rounded-lg"
        @change="selectRelevantTab($event)"
    >
        <a-tab-pane v-for="t in relevantTabList" :key="t.id" :tab="t.name">
            <component
                :is="t.component"
                height="150px"
                :username="myUsername"
                :type-names="t.typeName"
                :initial-filters="t.filter"
                :icon="t.icon"
                :empty-text="t.emptyText"
                :preference="{
                    sort: '__modificationTimestamp-desc'
                }"
            />
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    import { defineComponent, ref, defineAsyncComponent } from 'vue'
    import whoami from '~/composables/user/whoami'
    //    import { allTypeNames } from '~/components/discovery/useTabMapped'

    export default defineComponent({
        name: 'Relevant',
        components: {
            AssetList: defineAsyncComponent(
                () => import('~/components/home/assets/index.vue')
            ),
            recentlyViewedAssets: defineAsyncComponent(
                () => import('~/components/home/recentlyViewedAssets.vue')
            ),
        },
        setup() {
            const relevantTab = ref(2)
            const { username: myUsername } = whoami()

            const relevantTabList = [
                /* {
                    id: 1,
                    name: 'Requests',
                    component: 'RequestsTab',
                },
                {
                    id: 2,
                    name: 'Recent',
                    component: 'Recent',
                }, */
                // {
                //     id: 1,
                //     name: 'Recently visited',
                //     component: 'recentlyViewedAssets',
                //     typeName: ['Table'],
                //     icon: 'NoRelevantAsset',
                //     emptyText: 'All your assets will appear here.',
                // },
                {
                    id: 2,
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
                },
                {
                    id: 3,
                    name: 'Recently Verified Assets',
                    component: 'AssetList',
                    typeName: ['Table'],
                    icon: 'NoRelevantAsset',
                    filter: {
                        certificateStatus: ['VERIFIED']
                    },
                    emptyText: 'The most recently verified assets will show up here.',
                },
                /* {
                    id: 2,
                    name: 'Your terms',
                    component: 'AssetList',
                    typeName: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
                    icon: 'NoRelevantAsset',
                    emptyText: 'All your terms will appear here.',
                },
                {
                    id: 3,
                    name: 'Your queries',
                    component: 'AssetList',
                    typeName: ['Query'],
                    icon: 'NoRelevantAsset',
                    emptyText: 'All your saved queries will appear here.',
                },
                {
                    id: 4,
                    name: 'Subscribed',
                    component: 'Subscribed',
                }, */
            ]

            const selectRelevantTab = (val: number) => {
                relevantTab.value = val
            }
            return {
                relevantTab,
                relevantTabList,
                selectRelevantTab,
                myUsername,
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
