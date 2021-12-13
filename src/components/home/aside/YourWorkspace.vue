<template>
    <h2 class="mb-3 text-xl font-bold">Your Workspaces</h2>
    <Card
        v-for="l in worksplaceList"
        :url="l.path"
        :desc="l.desc"
        :head="l.label"
        :icon="l.icon"
        :key="l.id"
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

            const worksplaceListMeta = {
                assets: {
                    desc: `Discover & enrich all data assets in ${orgname.value}`,
                    icon: 'AssetIcon',
                },
                glossary: {
                    desc: `All of ${orgname.value}’s business terms in one place`,
                    icon: 'GlossaryIcon',
                },
                insights: {
                    desc: `Query Datasets across ${orgname.value} and empower your business`,
                    icon: 'InsightsIcon',
                },
                workflows: {
                    desc: 'Setup, run & monitor workflow runs',
                    icon: 'WorkflowsIcon',
                },
                // TODO: Hidden for paytm rollout, will enable it back
                // admin: {
                //     desc: 'One place to manage your Workspace',
                //     icon: 'AdminCenterIcon',
                // },
            }

            const worksplaceList = computed(() => {
                let list: Array<any> = []
                list = topNavKeys.map((i) => ({
                    ...i,
                    ...worksplaceListMeta[i.id],
                }))
                // TODO: Hidden for paytm rollout, will enable it back
                //const admin = bottomNavKeys.find((x) => x.id === 'admin')
                //list.push({ ...admin, ...worksplaceListMeta.admin })
                return list
            })
            return { worksplaceList }
        },
    })
</script>

<style scoped></style>
