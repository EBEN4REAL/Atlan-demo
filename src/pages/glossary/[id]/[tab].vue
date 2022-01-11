<template>
    <Loader v-if="isLoading"></Loader>
    <GlossaryProfile
        v-else
        :asset="localSelected"
        page="glossary"
    ></GlossaryProfile>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch, inject } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

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
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'
    import useGlossaryStore from '~/store/glossary'

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
        },
        setup(props) {
            useHead({
                title: 'Glossary',
            })
            const { selectedAsset } = toRefs(props)
            const localSelected = ref()
            const route = useRoute()
            const id = computed(() => route?.params?.id || null)
            const handlePreview = inject('preview')
            const limit = ref(1)
            const offset = ref(0)
            const glossaryStore = useGlossaryStore()
            const handleSelectGlossary = inject('handleSelectGlossary')
            console.log(handleSelectGlossary)
            const facets = ref({
                guid: id.value,
            })
            if (selectedAsset.value?.guid === id?.value) {
                localSelected.value = selectedAsset.value
                handlePreview(localSelected.value)
            }
            const fetchKey = computed(() => {
                if (selectedAsset.value.guid === id.value) {
                    return null
                }
                return id.value
            })
            const { customMetadataProjections } = useTypedefData()

            const dependentKey = ref(fetchKey.value)
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...GlossaryAttributes,
                ...customMetadataProjections,
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

                console.log(parentGlossaryQF)
                if (
                    glossaryStore?.activeGlossaryQualifiedName !== '' &&
                    glossaryStore?.activeGlossaryQualifiedName !==
                        parentGlossaryQF &&
                    asset.value?.guid
                ) {
                    if (asset.value?.typeName !== 'AtlasGlossary') {
                        console.log('change QF')
                        handleSelectGlossary(parentGlossaryQF)
                    }
                }
            }
            watch(list, () => {
                if (list.value.length > 0) {
                    localSelected.value = list.value[0]
                    handlePreview(list.value[0])
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
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
