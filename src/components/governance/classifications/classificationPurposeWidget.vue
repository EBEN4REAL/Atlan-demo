<template>
    <div class="flex flex-col p-4 bg-white rounded-md">
        <div class="flex items-center mb-7 sticky-top">
            <AtlanIcon icon="PolicyAlt" class="h-8" />
            <div class="mx-2">
                <span class="mb-1 text-base font-bold">Purposes</span>
            </div>
        </div>
        <PurposeList class="flex-grow" />
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
    import PurposeList from '@/governance/purposes/listPurpose/listPurpose.vue'

    export default defineComponent({
        name: 'ClassificationPurposeWidget',
        components: {
            PurposeList,
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
