<template>
    <Loader v-if="isLoading || isReadmeLoading"></Loader>
    <div v-else-if="showEmptyState">Hellloooo</div>
    <AssetProfile
        v-else
        :asset="localSelected"
        :key="localSelected.guid"
        :showEmptyState="showEmptyState"
    ></AssetProfile>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        inject,
        ref,
        watch,
        nextTick,
        onMounted,
        provide,
    } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

    import { whenever } from '@vueuse/core'
    import AssetProfile from '@/common/assets/profile/index.vue'
    import Loader from '@/common/loaders/page.vue'

    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
        AssetRelationAttributes,
        GlossaryAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'
    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'

    export default defineComponent({
        components: {
            AssetProfile,
            Loader,
        },
        emits: ['preview'],
        setup(props, { emit }) {
            const { selectedAsset } = useAssetInfo()

            const localSelected = ref()
            const localReadmeAsset = ref()
            const route = useRoute()
            const id = computed(() => route?.params?.id || null)
            const profileActiveTab = computed(() => route?.params?.tab)
            const handlePreview = inject('preview')
            const showEmptyState = ref(false)

            if (selectedAsset.value?.guid === id.value) {
                localSelected.value = selectedAsset.value
                handlePreview(localSelected.value)
            }

            useHead({
                title: computed(
                    () =>
                        localSelected.value?.attributes?.displayName ||
                        localSelected.value?.attributes?.name
                ),
            })

            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                guid: id.value,
            })
            const fetchKey = computed(() => {
                if (
                    selectedAsset.value.guid === id.value &&
                    selectedAsset.value.typeName !== 'Column'
                ) {
                    return null
                }
                return id.value
            })
            const dependentKey = ref(fetchKey.value)

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...GlossaryAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])
            const { list, isLoading, fetch } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            const sendPageTrack = () => {
                useTrackPage('assets', 'asset_profile', {
                    type: localSelected?.value?.typeName,
                    tab: profileActiveTab.value,
                })
            }

            const readmeAttribute = ref(['readme'])

            const {
                asset: readmeAsset,
                mutate: mutateReadme,
                isReady: isReadmeReady,
                isLoading: isReadmeLoading,
            } = useAssetAttributes({
                id,
                attributes: readmeAttribute,
            })

            mutateReadme()

            whenever(isReadmeReady, () => {
                localReadmeAsset.value = readmeAsset.value
            })

            provide('readmeAsset', localReadmeAsset)

            watch(list, () => {
                if (list.value.length > 0) {
                    localSelected.value = list.value[0]

                    handlePreview(list.value[0])
                } else {
                    showEmptyState.value = true
                }
            })

            watch(selectedAsset, () => {
                localSelected.value = selectedAsset.value
            })

            watch(
                () => id.value,
                () => {
                    showEmptyState.value = false
                    dependentKey.value = fetchKey.value
                    facets.value = {
                        guid: id.value,
                    }
                    fetch()
                }
            )

            watch(isLoading, async () => {
                await nextTick()
                console.log(
                    'asset profile loaded',
                    localSelected.value.typeName,
                    { profileActiveTab: profileActiveTab.value }
                )
                if (!isLoading.value) {
                    sendPageTrack()
                }
            })

            watch(profileActiveTab, () => {
                if (profileActiveTab.value) {
                    sendPageTrack()
                }
            })

            onMounted(() => {
                if (!fetchKey.value) {
                    sendPageTrack()
                }
            })

            return {
                fetchKey,
                isLoading,
                emit,
                localSelected,
                handlePreview,
                isReadmeLoading,
                localReadmeAsset,
                showEmptyState,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
