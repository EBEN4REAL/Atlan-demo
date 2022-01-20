<template>
    <h2 class="mb-3 text-xl font-bold">Workspace</h2>
    <Card
        v-for="l in worksplaceListMeta"
        :key="l.id"
        :url="l.path"
        :desc="l.desc"
        :head="l.label"
        :icon="l.icon"
    />
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import Card from '@/home/shared/card.vue'
    import { topNavKeys, bottomNavKeys } from '~/constant/navigation/workspace'
    import useTenantData from '~/composables/tenant/useTenantData'

    export default defineComponent({
        name: 'YourWorkspace',
        components: { Card },
        setup() {
            const { name: orgname } = useTenantData()

            const worksplaceListMeta = [
                {
                    id: 'assets',
                    label: 'Assets',
                    desc: `Discover & enrich all data assets in ${
                        orgname.value || 'your organization'
                    }`,
                    icon: 'AssetIcon',
                    path: '/assets',
                },
                {
                    id: 'glossary',
                    label: 'Glossary',
                    desc: `Discover & govern all your business terms and metrics`,
                    icon: 'GlossaryIcon',
                    path: '/glossary',
                },
                {
                    id: 'insights',
                    label: 'Insights',
                    desc: `Query datasets and derive business insights`,
                    icon: 'InsightsIcon',
                    path: '/insights',
                },

                // insights: {
                //     desc: `Query Datasets across ${
                //         orgname.value || 'your organization'
                //     }`,
                //     icon: 'InsightsIcon',
                // },
                // workflows: {
                //     desc: 'Setup, run & monitor workflow runs',
                //     icon: 'WorkflowsIcon',
                // },
                // TODO: Hidden for paytm rollout, will enable it back
                // admin: {
                //     desc: 'One place to manage your Workspace',
                //     icon: 'AdminCenterIcon',
                // },
            ]

            // const worksplaceList = computed(() => {
            //     let list: Array<any> = []
            //     list = topNavKeys.map((i) => ({
            //         ...i,
            //         ...worksplaceListMeta[i.id],
            //     }))
            //     // TODO: Hidden for paytm rollout, will enable it back
            //     //const admin = bottomNavKeys.find((x) => x.id === 'admin')
            //     //list.push({ ...admin, ...worksplaceListMeta.admin })
            //     return list
            // })
            return { worksplaceListMeta }
        },
    })
</script>

<style scoped></style>
