<template>
    <a-select
        placeholder="Select"
        v-model:value="localValue"
        class="w-full"
        @change="handleChange"
    >
        <a-select-option
            v-for="item in nonGroupList"
            :value="item.value"
            :key="item.value"
        >
            {{ item.label }}
        </a-select-option>
        <a-select-opt-group v-for="group in groupList" :key="group.value">
            <template #label>
                <span> {{ group.label }}</span>
            </template>
            <a-select-option
                v-for="item in group.children"
                :value="item.value"
                :key="item.value"
            >
                {{ item.label }}
            </a-select-option>
        </a-select-opt-group>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, computed, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'

    import { activityTypeMap } from '~/constant/activityType'

    export default defineComponent({
        name: 'Activity Select',
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            modelValue: {
                type: [Array, String],
                required: false,
            },
            typeName: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { typeName } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const list = ref(activityTypeMap)

            const groupList = computed(() => {
                return list.value.filter((i) => {
                    if (i.isGroup) {
                        console.log('filter', typeName.value, i.includes)
                        if (typeName.value && i.includes?.length > 0) {
                            if (
                                i.includes?.includes(typeName.value) &&
                                i.isGroup
                            ) {
                                return true
                            }
                            return false
                        } else if (typeName.value && i.excludes?.length > 0) {
                            if (
                                !i.excludes?.includes(typeName.value) &&
                                i.isGroup
                            ) {
                                return true
                            }
                            return false
                        }
                        return true
                    }
                })
            })
            const nonGroupList = computed(() => {
                return list.value.filter((i) => {
                    if (!i.isGroup) {
                        if (typeName.value && i.includes?.length > 0) {
                            if (
                                i.includes?.includes(typeName.value) &&
                                !i.isGroup
                            ) {
                                return true
                            }
                            return false
                        } else if (typeName.value && i.excludes?.length > 0) {
                            if (
                                !i.excludes?.includes(typeName.value) &&
                                !i.isGroup
                            ) {
                                return true
                            }
                            return false
                        }
                        return true
                    }
                })
            })

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                list,
                localValue,
                handleChange,
                groupList,
                nonGroupList,
            }
        },
    })
</script>