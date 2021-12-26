<template>
    <div>
        <div
            class="flex flex-col p-4 overflow-y-scroll bg-white rounded-md"
            style="height: 600px"
        >
            <div class="flex items-center sticky-top">
                <AtlanIcon icon="AssetIcon" class="h-8" />
                <div class="mx-2">
                    <span class="mb-1 text-base font-bold">Assets</span>
                </div>
            </div>
            <AssetsWrapper
                :initial-filters="filterConfig"
                :show-filters="false"
                :static-use="true"
                page="classifications"
                class="bg-white"
                :enable-sidebar-drawer="true"
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
    import AssetsWrapper from '@/assets/index.vue'

    export default defineComponent({
        name: 'ClassificationOverviewTab',
        components: {
            AssetsWrapper,
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
                    classifications: [selectedClassification.value.name],
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
