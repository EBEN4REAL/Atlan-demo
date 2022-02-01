<template>
    <div class="px-4 py-5 overflow-hidden tab-content-wrapper">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanLoader class="h-10" />
        </div>

        <div v-else class="h-full">
            <div class="mb-3 text-base font-bold text-gray-500">
                Linked Assets
            </div>
            <AssetList
                class="flex-grow bg-white"
                :enable-sidebar-drawer="true"
                :filters="filterConfig"
                :custom-placeholder="`Search assets linked to ${classification.displayName}`"
                initial-cache-key="CLASSIFICATION_LINKED_ASSETS"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    import {
        computed,
        defineComponent, PropType,
        toRefs,
    } from 'vue'
    import AtlanLoader from '@common/loaders/atlanLoader.vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import AssetList from '@/common/assetList/assetList.vue'

    dayjs.extend(relativeTime)

    export default defineComponent({
        name: 'ClassificationOverview',
        components: {
            AtlanLoader,
            AssetList
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
            isLoading: {
                type: Boolean,
                default: false,
                required: false
            }
        },
        emits: ['changeTab'],
        setup(props, { emit }) {
            const { classification, isLoading } = toRefs(props)

            const filterConfig = computed(() => ({
                __traitNames: {
                    classifications: [classification.value.name],
                },
            }))

            return {
                classification,
                isLoading,
                filterConfig
            }
        },
    })
</script>
<style lang="less" scoped>
    .tab-content-wrapper {
        height: calc(100vh - 6rem) !important;
    }
</style>
