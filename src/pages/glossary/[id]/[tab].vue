<template>
    <Loader v-if="isLoading"></Loader>
    <GlossaryProfile
        :selected-glossary="selectedGlossary"
        v-else
    ></GlossaryProfile>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

    import GlossaryProfile from '@/glossary/profile/index.vue'
    import Loader from '@/common/loaders/page.vue'

    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
        AssetRelationAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'

    export default defineComponent({
        components: {
            GlossaryProfile,
            Loader,
        },
        props: {
            selectedGlossary: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            useHead({
                title: 'Glossary',
            })

            const { selectedGlossary } = toRefs(props)
            const route = useRoute()
            const id = computed(() => route?.params?.id || null)
            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                guid: id.value,
            })
            const fetchKey = computed(() => {
                if (selectedGlossary.value?.guid) {
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
            const relationAttributes = ref([...AssetRelationAttributes])

            const { list, isLoading } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            const { handleSelectedGlossary } = useGlossaryData()

            watch(list, () => {
                if (list.value.length > 0) {
                    handleSelectedGlossary(list.value[0])
                }
            })

            return {
                fetchKey,
                isLoading,
                selectedGlossary,
                handleSelectedGlossary,
            }
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        width: 420px !important;
        max-width: 420px !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
