<template>
    <div class="flex flex-col w-full h-full px-5 py-4 overflow-hidden">
        <SearchAndFilter
            v-model:value="queryText"
            placeholder="Search workflows"
            class="mb-2"
        />
        <div class="flex flex-col flex-1 overflow-y-auto gap-y-3">
            <template v-for="workflow in list" :key="workflow.metadata.name">
                <Item
                    :item="workflow"
                    :packageObject="item"
                    @archive="archiveWorkflow"
                />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, h, provide, ref, toRefs, watch } from 'vue'
    import { debouncedWatch, until } from '@vueuse/core'
    import { Modal, message } from 'ant-design-vue'

    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'
    import { useWorkflowDiscoverList } from '~/workflows/composables/package/useWorkflowDiscoverList'
    import { useRunDiscoverList } from '~/workflows/composables/package/useRunDiscoverList'
    import { deleteWorkflowByName } from '~/workflows/composables/workflow/useWorkflowList'

    import Item from './item.vue'

    export default defineComponent({
        name: 'PropertiesWidget',
        components: {
            UserPill,
            PopOverUser,
            Item,
            SearchAndFilter,
        },
        props: {
            item: {
                type: Object,
                required: true,
            },
        },
        setup(props, { emit }) {
            const { item } = toRefs(props)

            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                ui: true,
                packageName:
                    item.value?.metadata.annotations[
                        'package.argoproj.io/name'
                    ],
            })
            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })
            const {} = useWorkflowInfo()
            const dependentKey = ref('default_workflows_sidebar')
            const { list, quickChange } = useWorkflowDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                queryText,
                source: ref({
                    excludes: ['spec'],
                }),
                preference,
            })

            const dependentKeyRun = ref()
            const facetRun = ref({})
            const aggregationRun = ref(['status'])

            const { quickChange: quickChangeRun, runByWorkflowMap } =
                useRunDiscoverList({
                    isCache: false,
                    dependentKey: dependentKeyRun,
                    facets: facetRun,
                    limit: ref(0),
                    offset,
                    aggregations: aggregationRun,
                    queryText: ref(''),
                    source: ref({
                        excludes: ['spec'],
                    }),
                    preference,
                })

            debouncedWatch(
                item.value?.metadata?.name,
                (prev, newv) => {
                    if (prev) {
                        quickChange()
                    }
                },
                { debounce: 100 }
            )

            watch(list, () => {
                const map = list.value.map((i) => i?.metadata?.name)
                facetRun.value = {
                    workflowTemplates: map,
                }
                // Only get the run details when there are actually any workflows from the previous API call
                if (map.length) quickChangeRun()
            })

            debouncedWatch(
                queryText,
                () => {
                    quickChange(true)
                },
                { debounce: 250 }
            )

            provide('runMap', runByWorkflowMap)

            const archiveWorkflow = (name: string) => {
                Modal.confirm({
                    title: 'Delete Workflow',
                    content: () =>
                        h('span', [
                            'Are you sure you want to delete ',
                            h('b', [name]),
                            ' workflow?',
                        ]),
                    okType: 'danger',
                    autoFocusButton: null,
                    okButtonProps: {
                        type: 'primary',
                    },
                    okText: 'Delete',
                    cancelText: 'Cancel',
                    async onOk() {
                        const { error, isLoading } = deleteWorkflowByName(
                            name,
                            true
                        )
                        await until(isLoading).toBe(false)
                        if (error.value)
                            message.error('Failed to delete workflow')
                        else {
                            message.success('Workflow deleted')
                            setTimeout(() => quickChange(true), 400)
                        }
                    },
                })
            }

            return {
                limit,
                offset,
                queryText,
                facets,
                list,
                quickChange,
                quickChangeRun,
                runByWorkflowMap,
                archiveWorkflow,
            }
        },
    })
</script>
