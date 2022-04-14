<template>
    <Loader v-if="isPageLoading"></Loader>
    <WorkflowProfile
        v-else
        :workflowObject="workflowObject"
        :packageObject="packageObject"
    ></WorkflowProfile>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        inject,
        provide,
        ref,
        watch,
        nextTick,
        onMounted,
    } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

    import WorkflowProfile from '~/workflows/components/workflows/profile/index.vue'
    import Loader from '@/common/loaders/page.vue'

    import { useWorkflowDiscoverList } from '~/workflows/composables/package/useWorkflowDiscoverList'
    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'
    import { usePackageByName } from '~/workflows/composables/package/usePackageByName'

    export default defineComponent({
        name: 'WorkflowProfileTabWrapper',
        components: {
            WorkflowProfile,
            Loader,
        },
        emits: ['preview'],
        setup(props, { emit }) {
            const route = useRoute()
            const { id } = route.params

            const limit = ref(1)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                name: id,
            })
            const dependentKey = ref('workflow_profile')

            const { isLoading, list, error, refresh } = useWorkflowDiscoverList(
                {
                    isCache: false,
                    dependentKey,
                    facets,
                    limit,
                    offset,
                    queryText,
                    source: ref({}),
                }
            )

            provide('refetchWorkflowObject', refresh)

            const workflowObject = computed(() => {
                if (list.value?.length > 0) {
                    return list.value[0]
                }
                return {}
            })

            const { packageName } = useWorkflowInfo()

            const {
                workflowPackage: packageObject,
                changeName,
                isLoading: isPackageLoading,
            } = usePackageByName(packageName(workflowObject.value), false)

            watch(workflowObject, () => {
                const workflowTemplateName = packageName(workflowObject.value)
                if (workflowTemplateName) {
                    changeName(
                        workflowTemplateName
                            .replaceAll('@', '')
                            .replaceAll('/', '-')
                    )
                }
            })

            const isPageLoading = computed(
                () => isPackageLoading.value || isLoading.value
            )

            return {
                workflowObject,
                packageName,
                packageObject,
                isPackageLoading,
                isPageLoading,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
