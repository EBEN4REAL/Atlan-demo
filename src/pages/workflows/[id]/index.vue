<template>
    <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-4 py-3 border-b">
            <div class="flex items-center">
                <a-button class="px-1 mr-2" @click="handleBack">
                    <atlan-icon
                        icon="ArrowRight"
                        class="w-auto h-4 text-gray-500 transform rotate-180"
                    />
                </a-button>
                <div class="flex flex-col">
                    <span class="font-semibold"> {{ name(item) }}</span>
                    {{ creationTimestamp(item, true) }}
                </div>
            </div>
            <a-dropdown>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1">1st item</a-menu-item>
                        <a-menu-item key="2">2nd item</a-menu-item>
                        <a-menu-item key="3">3rd item</a-menu-item>
                    </a-menu>
                </template>
                <a-button> Settings </a-button>
            </a-dropdown>
        </div>

        <MonitorWorkflow :workflowName="id"></MonitorWorkflow>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, inject, watch } from 'vue'

    import { packageFilters } from '~/constant/filters/packageFilters'

    import { useRoute, useRouter } from 'vue-router'
    import { useWorkflowDiscoverList } from '~/composables/package/useWorkflowDiscoverList'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import MonitorWorkflow from '@/workflows/monitor/index.vue'

    export default defineComponent({
        name: 'PackageDiscovery',
        components: { MonitorWorkflow },
        props: {},
        emits: ['setup', 'sandbox', 'select'],
        setup(props, { emit }) {
            const route = useRoute()
            const { id } = route.params
            const router = useRouter()

            const limit = ref(1)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                name: id,
            })

            const dependentKey = ref('workflow_profile')

            const handlePreview = inject('preview')

            const { isLoading, list, error } = useWorkflowDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                queryText,
                source: ref({
                    excludes: ['spec'],
                }),
            })

            const item = computed(() => {
                if (list.value?.length > 0) {
                    return list.value[0]
                }
                return {}
            })

            // watch(item, () => {
            //     handlePreview(item.value)
            // })

            const handleBack = () => {
                console.log('back')
                router.push('/workflows')
            }

            const { name, creationTimestamp } = useWorkflowInfo()

            return {
                isLoading,
                list,
                id,
                queryText,
                error,
                packageFilters,
                facets,
                item,
                name,
                creationTimestamp,
                handlePreview,
                handleBack,
                router,
            }
        },
    })
</script>
