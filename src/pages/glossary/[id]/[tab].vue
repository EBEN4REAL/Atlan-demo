<template>
    <Loader v-if="isLoading || isReadmeLoading"></Loader>
    <GlossaryProfile
        v-else
        :asset="localSelected"
        page="glossary"
    ></GlossaryProfile>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        toRefs,
        watch,
        inject,
        provide,
    } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'
    import { whenever } from '@vueuse/core'

    import GlossaryProfile from '@/common/assets/profile/index.vue'
    import Loader from '@/common/loaders/page.vue'

    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
        AssetRelationAttributes,
        GlossaryAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'
    import useGlossaryStore from '~/store/glossary'
    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'

    export default defineComponent({
        name: 'GlossaryIdPage',
        components: {
            GlossaryProfile,
            Loader,
        },
        props: {
            selectedAsset: {
                type: Object,
                required: true,
            },
            // guids of assets which should be fetched again due to updates
            refreshGuids: {
                type: Array,
                required: false,
                default: () => [],
            },
        },
        setup(props) {
            useHead({
                title: 'Glossary',
            })
            const { selectedAsset, refreshGuids } = toRefs(props)
            const localSelected = ref()
            const localReadmeAsset = ref()

            const route = useRoute()
            const id = computed(() => route?.params?.id || null)
            const handlePreview = inject('preview')
            const updateList = inject('updateList')
            const limit = ref(1)
            const offset = ref(0)
            const glossaryStore = useGlossaryStore()
            const handleSelectGlossary = inject('handleSelectGlossary')

            const facets = ref({
                guid: id.value,
            })
            if (selectedAsset.value?.guid === id?.value) {
                localSelected.value = selectedAsset.value
                handlePreview(localSelected.value)
            }
            const fetchKey = computed(() => {
                if (
                    selectedAsset.value.guid === id.value &&
                    !refreshGuids.value?.includes(selectedAsset.value?.guid)
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
            const relationAttributes = ref([
                ...AssetRelationAttributes,
                'categories',
            ])

            const { list, isLoading, fetch } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

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

            const sendPageEvent = () => {
                let name = 'glossary'
                const type = localSelected?.value?.typeName
                if (type === 'AtlasGlossaryCategory') {
                    name = 'category'
                } else if (type === 'AtlasGlossaryTerm') {
                    name = 'term'
                }
                useTrackPage('gtc', name)
            }
            const setActiveGlossary = (asset) => {
                const parentGlossaryQF =
                    asset.value?.attributes?.anchor?.uniqueAttributes
                        ?.qualifiedName

                if (
                    glossaryStore?.activeGlossaryQualifiedName !== '' &&
                    glossaryStore?.activeGlossaryQualifiedName !==
                        parentGlossaryQF &&
                    asset.value?.guid
                ) {
                    if (asset.value?.typeName !== 'AtlasGlossary') {
                        handleSelectGlossary(parentGlossaryQF)
                    } else {
                        if (asset?.value?.attributes?.qualifiedName)
                            handleSelectGlossary(
                                asset?.value?.attributes?.qualifiedName
                            )
                    }
                }
            }
            watch(list, () => {
                if (list.value.length > 0) {
                    console.log("called ", list.value[0]?.displayText)
                    localSelected.value = list.value[0]
                    if (
                        list.value[0] &&
                        list.value[0]?.typeName === 'AtlasGlossary'
                    ) {
                        const found = glossaryStore.list?.find(
                            (el) => el?.guid === list.value[0]?.guid
                        )
                        if (found) {
                            localSelected.value = found
                            handlePreview(found)
                        }
                    } else updateList(list.value[0])
                    setActiveGlossary(localSelected)
                }
            })
            watch(id, () => {
                if (id.value && selectedAsset.value?.guid !== id.value) {
                    dependentKey.value = id.value
                    facets.value.guid = id.value
                    fetch()
                }
                setActiveGlossary(selectedAsset)
            })
            watch(selectedAsset, () => {
                localSelected.value = selectedAsset.value
                sendPageEvent()
            })

            return {
                list,
                fetchKey,
                isLoading,
                localSelected,
                id,
                facets,
                dependentKey,
                isReadmeLoading,
                localReadmeAsset,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
