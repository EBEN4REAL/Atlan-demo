<template>
    <Loader v-if="isLoading"></Loader>
    <AssetProfile
        v-else
        :asset="localSelected"
        @preview="emit('preview', $event)"
    ></AssetProfile>
</template>

<script lang="ts">
    import { computed, defineComponent, inject, ref, watch } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

    import AssetProfile from '@/common/assets/profile/index.vue'
    import Loader from '@/common/loaders/page.vue'

    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
        DefaultRelationAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        components: {
            AssetProfile,
            Loader,
        },
        emits: ['preview'],
        setup(props, { emit }) {
            const { selectedAsset } = useAssetInfo()

            const localSelected = ref()
            const route = useRoute()
            const id = computed(() => route?.params?.id || null)
            const handlePreview = inject('preview')

            if (selectedAsset.value?.guid === id.value) {
                localSelected.value = selectedAsset.value
                handlePreview(localSelected.value)
            }

            useHead({
                title:
                    localSelected.value?.attributes.displayName ||
                    localSelected.value?.attributes.name,
            })

            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                guid: id.value,
            })
            const fetchKey = computed(() => {
                if (selectedAsset.value.guid === id.value) {
                    return null
                }
                return id.value
            })
            const dependentKey = ref(fetchKey.value)
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
            ])
            const relationAttributes = ref([...DefaultRelationAttributes])
            const { updateList, list, isLoading } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            /* const updateCurrentList = (asset) => {
                updateList(asset)
                 handlePreview(asset)
            } */

            watch(list, () => {
                if (list.value.length > 0) {
                    localSelected.value = list.value[0]

                    handlePreview(list.value[0])
                }
            })
            watch(selectedAsset, () => {
                localSelected.value = selectedAsset.value
            })

            return {
                fetchKey,
                isLoading,
                emit,
                localSelected,
                handlePreview,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
