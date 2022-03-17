<template>
    <BaseSelector
        v-model:value="packageName"
        :list="packageList"
        placeholder="Select package"
        not-found-content="No package found"
    />
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import BaseSelector from './baseSelector.vue'
    import { useWorkflowStore } from '~/workflowsv2/store/index'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

    export default defineComponent({
        name: 'PackageSelector',
        components: { BaseSelector },
        props: {},
        emits: [],
        setup() {
            const packageName = ref(undefined)
            const workflowStore = useWorkflowStore()

            const init = async () => {
                await workflowStore.fetchActivePackages()
                workflowStore.fetchActivePackageMeta()
            }
            const { identifier, name, icon } = usePackageInfo()

            const packageList = computed(() =>
                Object.values(workflowStore.packageMeta).map((pkg) => ({
                    id: identifier(pkg),
                    label: name(pkg),
                    icon: icon(pkg),
                }))
            )

            init()
            return { packageList, packageName }
        },
    })
</script>
