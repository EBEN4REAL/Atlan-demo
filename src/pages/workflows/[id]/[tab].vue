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
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import { usePackageByName } from '~/workflows/composables/package/usePackageByName'

    export default defineComponent({
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

            // const { selectedAsset } = useAssetInfo()

            // const localSelected = ref()
            // const route = useRoute()
            // const id = computed(() => route?.params?.id || null)
            // const profileActiveTab = computed(() => route?.params?.tab)
            // const handlePreview = inject('preview')

            // if (selectedAsset.value?.guid === id.value) {
            //     localSelected.value = selectedAsset.value
            //     handlePreview(localSelected.value)
            // }

            // useHead({
            //     title:
            //         localSelected.value?.attributes?.displayName ||
            //         localSelected.value?.attributes?.name,
            // })

            // const limit = ref(1)
            // const offset = ref(0)
            // const facets = ref({
            //     guid: id.value,
            // })
            // const fetchKey = computed(() => {
            //     if (
            //         selectedAsset.value.guid === id.value &&
            //         selectedAsset.value.typeName !== 'Column'
            //     ) {
            //         return null
            //     }
            //     return id.value
            // })
            // const dependentKey = ref(fetchKey.value)

            // const { customMetadataProjections } = useTypedefData()
            // const defaultAttributes = ref([
            //     ...InternalAttributes,
            //     ...AssetAttributes,
            //     ...SQLAttributes,
            //     ...customMetadataProjections,
            //     ...GlossaryAttributes,
            // ])
            // const relationAttributes = ref([...AssetRelationAttributes])
            // const { list, isLoading, fetch } = useDiscoverList({
            //     isCache: false,
            //     dependentKey,
            //     facets,
            //     limit,
            //     offset,
            //     attributes: defaultAttributes,
            //     relationAttributes,
            // })

            // const sendPageTrack = () => {
            //     useTrackPage('assets', 'asset_profile', {
            //         type: localSelected?.value?.typeName,
            //         tab: profileActiveTab.value,
            //     })
            // }

            // watch(list, () => {
            //     if (list.value.length > 0) {
            //         localSelected.value = list.value[0]

            //         handlePreview(list.value[0])
            //     }
            // })

            // watch(selectedAsset, () => {
            //     localSelected.value = selectedAsset.value
            // })

            // watch(
            //     () => id.value,
            //     () => {
            //         dependentKey.value = fetchKey.value
            //         facets.value = {
            //             guid: id.value,
            //         }
            //         fetch()
            //     }
            // )

            // watch(isLoading, async () => {
            //     await nextTick()
            //     console.log(
            //         'asset profile loaded',
            //         localSelected.value.typeName,
            //         { profileActiveTab: profileActiveTab.value }
            //     )
            //     sendPageTrack()
            // })

            // watch(profileActiveTab, () => {
            //     if (profileActiveTab.value) {
            //         sendPageTrack()
            //     }
            // })

            // onMounted(() => {
            //     if (!isLoading.value) {
            //         sendPageTrack()
            //     }
            // })

            return {
                workflowObject,
                packageName,
                packageObject,
                isPackageLoading,
                isPageLoading,
            }
            // return {
            //     fetchKey,
            //     isLoading,
            //     emit,
            //     localSelected,
            //     handlePreview,
            // }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
