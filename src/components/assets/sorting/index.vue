<template>
    <Sorting
        v-model="localValue.sort"
        @change="handleChangeSort"
        :assetType="assetType"
    ></Sorting>
</template>

<script lang="ts">
    import { defineComponent, Ref, ref, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'
    import Sorting from '@/common/dropdown/sorting.vue'

    import { displayProperties } from '~/constant/displayProperties'
    import { searchMode } from '~/constant/searchMode'
    import CustomRadioButton from '@common/radio/customRadioButton.vue'

    export default defineComponent({
        name: 'PreferenceSelector',
        components: {
            Sorting,
            CustomRadioButton,
        },
        props: {
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            assetType: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            defaultSortValue: {
                type: String,
                required: false,
                default() {
                    return 'default'
                },
            },
        },
        emits: ['change', 'update:modelValue', 'display', 'mode'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { assetType } = toRefs(props)

            const handleChangeSort = () => {
                modelValue.value = localValue.value
                emit('change', 'sort')
            }

            const handleChangeDisplay = () => {
                modelValue.value = localValue.value
                emit('display')
            }

            const handleChangeMode = () => {
                modelValue.value = localValue.value
                emit('mode')
            }

            return {
                localValue,
                handleChangeSort,
                assetType,
                displayProperties,
                handleChangeDisplay,
                handleChangeMode,
                searchMode,
            }
        },
    })
</script>
<style lang="less" scoped>
    .preference-container {
        width: 240px;
    }
    .custom-icon-drop {
        transform: translateY(-2px);
    }
</style>
