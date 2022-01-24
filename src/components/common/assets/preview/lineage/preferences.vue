<template>
    <div class="flex flex-col p-3 rounded gap-y-3">
        <div>
            <p class="mb-2 text-sm text-gray-500">Show/Hide</p>
            <div class="flex flex-wrap">
                <CustomRadioButton
                    :model-value="display"
                    :list="displayProperties"
                    is-multiple
                    @update:model-value="$emit('update:display', $event)"
                ></CustomRadioButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, ref, computed, PropType } from 'vue'

    import CustomRadioButton from '@common/radio/customRadioButton.vue'
    import { displayProperties } from '~/constant/displayProperties'

    export default defineComponent({
        components: { CustomRadioButton },
        props: {
            display: {
                type: Array as PropType<string[]>,
                default: () => [],
            },
        },
        emits: ['update:display'],
        setup(props, { emit }) {
            /** INJECTIONS */
            const assetTypesLengthMapInjection = inject('assetTypesLengthMap')
            const depthInjection = inject('updateDepth')
            const filterInjection = inject('updateFilters')

            return {
                displayProperties,
            }
        },
    })
</script>
