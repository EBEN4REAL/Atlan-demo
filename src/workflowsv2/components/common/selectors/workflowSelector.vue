<!-- FIXME: Deprecated component -->
<template>
    <BaseSelector
        :type="type"
        :value="value"
        :list="workflowList"
        :loading="isLoading"
        :placeholder="
            $attrs.disabled ? 'Select a package first' : 'Select workflow'
        "
        :not-found-content="isLoading ? 'Loading' : 'No workflow found'"
        @update:value="$emit('update:value', $event)"
    />
</template>

<script lang="ts">
    import { whenever } from '@vueuse/core'
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { useWorkflowDiscoverList } from '~/workflowsv2/composables/useWorkflowDiscoverList'
    import { useWorkflowStore } from '~/workflowsv2/store'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    import BaseSelector from './baseSelector.vue'

    /** @deprecated - Remove this component*/
    export default defineComponent({
        name: 'WorkflowSelector',
        components: { BaseSelector },
        props: {
            value: { type: String, required: false, default: () => undefined },
            packageName: {
                type: String,
                required: false,
                default: () => undefined,
            },
            type: {
                type: String as PropType<'default' | 'minimal'>,
                default: () => 'default',
            },
        },
        emits: ['update:value'],
        setup(props, { emit }) {
            const { packageName } = toRefs(props)
            const workflowName = ref(undefined)
            const workflowStore = useWorkflowStore()
            const workflowList = ref([])

            const pkg = computed(() =>
                packageName.value
                    ? workflowStore.packageMeta?.[packageName.value]
                    : {}
            )
            const { displayName } = useWorkflowInfo()

            const { list, quickChange, isLoading } = useWorkflowDiscoverList({
                facets: computed(() => ({
                    ui: true,
                    packageName:
                        pkg.value?.metadata?.annotations?.[
                            'package.argoproj.io/name'
                        ],
                })),
                limit: ref(100),
                source: ref({
                    excludes: ['spec'],
                }),
                preference: ref({
                    sort: 'metadata.creationTimestamp-desc',
                }),
                immediate: false,
            })

            whenever(list, () => {
                workflowList.value = list.value.map((workflow) => ({
                    id: workflow.metadata.name,
                    label: displayName(pkg.value, workflow.metadata.name),
                }))
            })

            watch(packageName, () => {
                workflowList.value = []
                emit('update:value', undefined)

                if (packageName.value) {
                    quickChange()
                }
            })
            return { workflowName, workflowList, pkg, list, isLoading }
        },
    })
</script>
