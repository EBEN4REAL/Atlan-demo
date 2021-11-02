<template>
    <div class="flex flex-col py-1 rounded gap-y-3 preference-container">
        <div class="flex items-center justify-between">
            <p class="mb-1 text-sm text-gray-500">Sort By</p>
            <Sorting
                v-model="localValue.sort"
                @change="handleChangeSort"
                :assetType="assetType"
            ></Sorting>
        </div>
        <div class="">
            <p class="mb-2 text-sm text-gray-500">Show/Hide</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, ref, toRefs } from 'vue'

    import Sorting from '@/common/select/sorting.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        components: {
            Sorting,
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
        emits: ['change', 'sort', 'state'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const localValue = ref(modelValue.value)

            const { assetType } = toRefs(props)

            const handleChangeSort = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                localValue,
                handleChangeSort,
                assetType,
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
