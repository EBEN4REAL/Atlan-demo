<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <a-tabs v-model:activeKey="relevantTab" @change="selectRelevantTab($event)">
        <a-tab-pane v-for="t in relevantTabList" :key="t.id" :tab="t.name"
            ><component
                :is="t.component"
                :username="myUsername"
                :typeNames="t.typeName"
                :icon="t.icon"
                :empty-text="t.emptyText"
            >
            </component
        ></a-tab-pane>
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
                () => import('~/components/home/assetList.vue')
            ),
            recentlyViewedAssets: defineAsyncComponent(
                () => import('~/components/home/recentlyViewedAssets.vue')
            ),
        },
        setup() {
            const relevantTab = ref(1)

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
                {
                    id: 1,
                    name: 'Recently visited',
                    component: 'recentlyViewedAssets',
                    typeName: ['Table'],
                    icon: 'NoRelevantAsset',
                    emptyText: 'All your assets will appear here.',
                },
                {
                    id: 2,
                    name: 'My Assets',
                    component: 'AssetList',
                    typeName: ['Table'],
                    icon: 'NoRelevantAsset',
                    emptyText: 'All your assets will appear here.',
                },
                /*{
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

            const { username: myUsername } = whoami()

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
