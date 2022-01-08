<template>
    <div class="flex flex-col p-4 bg-white rounded-md">
        <div class="flex items-center mb-7">
            <AtlanIcon icon="AssetIcon" class="h-8" />
            <div class="mx-2">
                <span class="mb-1 text-base font-bold">Assets</span>
            </div>
        </div>
        <div style="max-height: 281px">
            <AssetList
                class="flex-grow bg-white"
                :enable-sidebar-drawer="true"
                :filters="filterConfig"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        ref,
        PropType,
        toRefs,
        watch,
    } from 'vue'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import AssetList from '@/common/assetList/assetList.vue'

    export default defineComponent({
        name: 'ClassificationAssetWidget',
        components: {
            AssetList,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        emits: ['openAssetsTab'],
        setup(props, { emit }) {
            const { classification: selectedClassification } = toRefs(props)

            const filterConfig = computed(() => ({
                __traitNames: {
                    classifications: [selectedClassification?.value?.name],
                },
            }))

            return {
                selectedClassification,
                filterConfig,
            }
        },
    })
</script>

<style lang="less"></style>
