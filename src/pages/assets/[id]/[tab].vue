<template>
    <Loader v-if="isLoading"></Loader>
    <AssetProfile
        v-else
        :asset="selectedAsset"
        @preview="emit('preview', $event)"
    ></AssetProfile>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
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

    export default defineComponent({
        components: {
            AssetProfile,
            Loader,
        },
        props: {
            selectedAsset: {
                type: Object,
                required: true,
            },
        },
        setup(props, { emit }) {
            useHead({
                title: 'Assets',
            })
            const { selectedAsset } = toRefs(props)
            const route = useRoute()
            const id = computed(() => route?.params?.id || null)
            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                guid: id.value,
            })
            const fetchKey = computed(() => {
                if (selectedAsset.value.guid) {
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
            const { handleSelectedAsset, list, isLoading } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })
            watch(list, () => {
                if (list.value.length > 0) {
                    handleSelectedAsset(list.value[0])
                }
            })
            return {
                fetchKey,
                isLoading,
                emit,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
