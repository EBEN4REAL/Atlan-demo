<template>
    <div class="flex flex-col p-3 rounded gap-y-3">
        <div class="flex items-center justify-between">
            <span class="text-gray-500">Depth</span>
            <a-dropdown :trigger="['click']">
                <span class="lineage-filter-menu">
                    {{ currDepthLabel }}
                    <AtlanIcon
                        icon="CaretRight"
                        class="transform rotate-90 outline-none"
                    ></AtlanIcon>
                </span>
                <template #overlay>
                    <a-menu>
                        <a-menu-item
                            v-for="item in lineageDepths"
                            :key="item.id"
                            :class="{
                                'ant-dropdown-menu-item-activee':
                                    currentDepth === item.id,
                            }"
                            @click="updateDepth(item.id)"
                        >
                            {{ item.label }}
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
        <div>
            <p class="mb-2 text-sm text-gray-500">Show/Hide</p>
            <div class="flex flex-wrap">
                <CustomRadioButton
                    v-model="localValue"
                    :list="displayProperties"
                    is-multiple
                    @change="handleChange"
                ></CustomRadioButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, ref, computed } from 'vue'
    import { useVModels } from '@vueuse/core'

    import CustomRadioButton from '@common/radio/customRadioButton.vue'

    export default defineComponent({
        components: { CustomRadioButton },
        props: {
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['updateDisplay'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const handleChange = (id) => {
                modelValue.value = localValue.value

                emit('updateDisplay', id)
            }

            /** INJECTIONS */
            const assetTypesLengthMapInjection = inject('assetTypesLengthMap')
            const depthInjection = inject('updateDepth')
            const currentDepth = inject('currentDepth')

            const filterInjection = inject('updateFilters')

            const displayProperties = [
                {
                    id: 'description',
                    label: 'Description',
                },
                {
                    id: 'terms',
                    label: 'Terms',
                },
                {
                    id: 'classifications',
                    label: 'Classifications',
                },
                {
                    id: 'process',
                    label: 'Process',
                },
            ]

            const lineageDepths = [
                { id: 1, label: 'Depth 1' },
                { id: 2, label: 'Depth 2' },
                { id: 3, label: 'Depth 3' },
                { id: 21, label: 'Max. Depth' },
            ]

            const currDepthLabel = computed(
                () =>
                    lineageDepths.find((x) => x.id === currentDepth.value)
                        ?.label
            )

            const updateDepth = (val) => {
                depthInjection(val)
            }

            return {
                displayProperties,
                lineageDepths,
                currentDepth,
                currDepthLabel,
                updateDepth,
                handleChange,
                localValue,
            }
        },
    })
</script>

<style scoped>
    .lineage-filter-menu {
        @apply flex items-center justify-between;
        @apply h-8 px-3;
        @apply text-sm border rounded cursor-pointer;
        min-width: 140px;
    }
</style>
