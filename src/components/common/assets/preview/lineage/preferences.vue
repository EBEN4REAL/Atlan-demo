<template>
    <div class="flex flex-col p-3 rounded gap-y-5">
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
        <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500">Show Process Nodes</p>

            <a-switch
                v-model:checked="localProcessValue"
                @change="handleChange"
            />
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
    import { displayProperties } from '~/constant/displayProperties'

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
            displayProcess: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['updateDisplay', 'update:modelValue', 'update:displayProcess'],
        setup(props, { emit }) {
            const { modelValue, displayProcess } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const localProcessValue = ref(displayProcess.value)
            const handleChange = (id) => {
                modelValue.value = localValue.value
                displayProcess.value = localProcessValue.value
                emit('updateDisplay', id)
            }

            /** INJECTIONS */
            const assetTypesLengthMapInjection = inject('assetTypesLengthMap')
            const depthInjection = inject('updateDepth')
            const currentDepth = inject('currentDepth')

            const filterInjection = inject('updateFilters')

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
                localProcessValue,
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
