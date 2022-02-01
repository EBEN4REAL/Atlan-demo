<template>
    <a-select
        placeholder="Sorting"
        style="min-width: 100px"
        v-model:value="localValue"
        :allowClear="false"
        :showSearch="false"
        @change="handleChange"
        :get-popup-container="(target) => target.parentNode"
    >
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="mb-1" />
        </template>
        <a-select-option
            :value="item.id"
            v-for="item in sortList"
            :key="item.id"
        >
            {{ item.label }}
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, ref, toRefs, computed } from 'vue'

    import { discoverySorting } from '~/constant/filters/discoverySorting'

    export default defineComponent({
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return undefined
                },
            },
            assetType: {
                type: String,
                required: false,
                default() {
                    return '__all'
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const { assetType, defaultValue } = toRefs(props)

            const localValue = ref(modelValue.value)

            // if (!localValue.value) {
            //     localValue.value = 'default'
            // }

            const handleChange = (value) => {
                modelValue.value = value
                emit('change')
            }

            const sortList = computed(() =>
                discoverySorting.filter((i) => {
                    let flag = true
                    if (i.includes) {
                        if (
                            !i.includes.some(
                                (t) =>
                                    t.toLowerCase() ===
                                    assetType?.value.toLowerCase()
                            )
                        ) {
                            flag = false
                        }
                    }
                    if (i.excludes) {
                        if (
                            i.excludes.some(
                                (t) =>
                                    t.toLowerCase() === typeName?.toLowerCase()
                            )
                        ) {
                            flag = false
                        }
                    }
                    return flag
                })
            )

            return {
                handleChange,
                discoverySorting,
                localValue,
                sortList,
                defaultValue,
            }
        },
    })
</script>

<style lang="less" scoped></style>
