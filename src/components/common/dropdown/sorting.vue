<template>
    <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
            <a-badge :color="modelValue !== 'default' ? '#5278d7' : null">
                <AtlanIcon icon="Filter" class="w-4 h-4 px-1" />
                <DownOutlined />
            </a-badge>
        </a>
        <template #overlay>
            <a-menu @click="handleChange">
                <a-menu-item
                    :value="item.id"
                    v-for="item in sortList"
                    :key="item.id"
                    :class="isActive(item.id) ? 'bg-primary-menu' : ''"
                >
                    <div class="flex items-center justify-between">
                        <span>
                            {{ item?.label }} 
                            <span class="text-gray-500"> {{item?.suffix}}</span>
                        </span>
                        <AtlanIcon
                            icon="RunSuccess"
                            class="w-3 h-3 pl-3"
                            v-if="isActive(item.id)"
                        />
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
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
                modelValue.value = value.key
                emit('change')
            }

            const isActive = (value) => {
                if (modelValue.value === value) {
                    return true
                }
                return false
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
                isActive,
            }
        },
    })
</script>

<style lang="less" scoped></style>
