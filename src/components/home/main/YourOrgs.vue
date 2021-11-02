<template>
    <h2 class="mb-3 text-xl font-bold">Your organization</h2>
    <a-tabs v-model:activeKey="orgTab" @change="selectOrgTab($event)">
        <a-tab-pane v-for="t in orgTabList" :key="t.id" :tab="t.name">
            <component
                :is="t.component"
                :typeNames="t.typeName"
                :icon="t.icon"
                :empty-text="t.emptyText"
            >
                <template #listFooter>
                    <router-link :to="t.path"
                        ><div class="flex mt-6 ml-1 font-bold text-primary">
                            {{ t.footer }}
                            <atlan-icon
                                icon="ArrowRight"
                                class="w-auto h-4 mt-1 ml-1"
                            /></div
                    ></router-link>
                </template>
            </component>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    import { defineComponent, ref, defineAsyncComponent } from 'vue'
    //import { allTypeNames } from '~/components/discovery/useTabMapped'

    export default defineComponent({
        name: 'YourOrgs',
        components: {
            AssetList: defineAsyncComponent(
                () => import('~/components/home/assetList.vue')
            ),
        },
        setup() {
            const orgTab = ref(1)

            const orgTabList = [
                {
                    id: 1,
                    name: 'Assets',
                    component: 'AssetList',
                    footer: 'Show all assets',
                    path: '/assets',
                    typeName: ['Table'],
                    icon: 'NoAssetOrganization',
                    emptyText: 'Your organisation’s assets will appear here.',
                },
                {
                    id: 2,
                    name: 'Business Terms',
                    component: 'AssetList',
                    footer: 'Show all business terms',
                    path: '/glossary',
                    typeName: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
                    icon: 'NoAssetOrganization',
                    emptyText: 'Your organisation’s terms will appear here.',
                },
                {
                    id: 3,
                    name: 'Saved Queries',
                    component: 'AssetList',
                    footer: 'Show all queries',
                    path: '/insights',
                    typeName: ['Query'],
                    icon: 'NoAssetOrganization',
                    emptyText:
                        'Your organisation’s saved queries will appear here.',
                },
                {
                    id: 4,
                    name: 'Workflow runs',
                    component: 'AssetList',
                    footer: 'Show all workflows',
                    path: '/workflows',
                    typeName: [],
                    icon: 'NoAssetOrganization',
                    emptyText:
                        'Your organisation’s workflows will appear here.',
                },
            ]

            const selectOrgTab = (val: number) => {
                orgTab.value = val
            }

            return { orgTab, orgTabList, selectOrgTab }
        },
    })
</script>
