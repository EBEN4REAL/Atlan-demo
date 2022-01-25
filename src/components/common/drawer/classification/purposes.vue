<template>
    <div class="px-4 py-5 overflow-hidden tab-content-wrapper">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanLoader class="h-10" />
        </div>

        <div v-else class="h-full">
            <div class="mb-3 text-base font-bold text-gray-500">
                Purposes
            </div>
            <PurposeList
                v-auth='[map.LIST_PURPOSE]'
                class="flex-grow"
                :classification-i-d="classification.typeName"
                :padding-y='0'
                custom-classes='flex-grow overflow-y-auto'
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent, PropType,
        toRefs,
    } from 'vue'
    import AtlanLoader from '@common/loaders/atlanLoader.vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import PurposeList from '@/governance/purposes/listPurpose/listPurpose.vue'
    import map from "~/constant/accessControl/map"
    import ErrorView from '@common/error/index.vue'

    export default defineComponent({
        name: 'ClassificationPurposes',
        components: {
            ErrorView,
            AtlanLoader,
            PurposeList
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

            return {
                classification,
                isLoading,
                map
            }
        },
    })
</script>
<style lang="less" scoped>
    .tab-content-wrapper {
        height: calc(100vh - 6rem) !important;
    }
</style>
