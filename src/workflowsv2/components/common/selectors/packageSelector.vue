<template>
    <BaseSelector
        :type="type"
        :value="value"
        :list="packageList"
        placeholder="Select package"
        not-found-content="No package found"
        @update:value="$emit('update:value', $event)"
    />
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue'
    import BaseSelector from './baseSelector.vue'
    import { useWorkflowStore } from '~/workflowsv2/store/index'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

    export default defineComponent({
        name: 'PackageSelector',
        components: { BaseSelector },
        props: {
            value: { type: String, required: false, default: () => undefined },
            type: {
                type: String as PropType<'default' | 'minimal'>,
                default: () => 'default',
            },
        },
        emits: ['update:value'],
        setup() {
            const workflowStore = useWorkflowStore()

            const init = async () => {
                await workflowStore.fetchActivePackages()
                workflowStore.fetchActivePackageMeta()
            }

            const { identifier, name, icon, emoji } = usePackageInfo()

            const packageList = computed(() =>
                Object.values(workflowStore.packageMeta).map((pkg) => ({
                    id: identifier(pkg),
                    icon: icon(pkg),
                    label: name(pkg),
                    count: workflowStore.activePackageMap?.[identifier(pkg)],
                    emoji: emoji(pkg),
                }))
            )

            init()
            return { packageList }
        },
    })
</script>
