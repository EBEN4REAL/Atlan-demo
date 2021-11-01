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
    import { defineComponent, ref, computed } from 'vue'
    import Card from '@/home/shared/card.vue'
    import { topNavKeys, bottomNavKeys } from '~/constant/navigation'

    export default defineComponent({
        name: 'YourWorkspace',
        components: { Card },
        setup() {
            const orgname = 'Aliaxis'

            const worksplaceListMeta = {
                assets: {
                    desc: `Discover & enrich all data assets in ${orgname}`,
                    icon: 'AssetIcon',
                },
                glossary: {
                    desc: `All of ${orgname}’s business terms in one place`,
                    icon: 'GlossaryIcon',
                },
                insights: {
                    desc: `Query Datasets across ${orgname} and empower your business`,
                    icon: 'InsightsIcon',
                },
                workflows: {
                    desc: 'Setup, run & monitor workflow runs',
                    icon: 'WorkflowsIcon',
                },
                admin: {
                    desc: 'One place to manage your Workspace',
                    icon: 'AdminCenterIcon',
                },
            }

            const worksplaceList = computed(() => {
                let list: Array<{}> = []
                list = topNavKeys.map((i) => ({
                    ...i,
                    ...worksplaceListMeta[i.id],
                }))
                const admin = bottomNavKeys.find((x) => x.id === 'admin')
                list.push({ ...admin, ...worksplaceListMeta.admin })
                return list
            })
            return { worksplaceList }
        },
    })
</script>

<style scoped></style>
