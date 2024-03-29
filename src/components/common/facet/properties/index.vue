<template>
    <div class="w-full">
        <div
            class="flex items-center justify-between px-4"
            v-if="filteredAttributeList.length > 5 || queryText"
        >
            <SearchAdvanced
                ref="classificationSearchRef"
                v-model="queryText"
                placeholder="Search properties"
                class="-mt-1.5"
                :allowClear="true"
            >
            </SearchAdvanced>
        </div>

        <div class="flex flex-col w-full h-full px-2 mt-1">
            <div
                v-if="filteredAttributeList.length == 0"
                class="flex flex-col items-center justify-center h-full"
                style="min-height: 100px"
            >
                <div class="flex flex-col items-center">
                    <span class="text-gray-500">No properties found</span>
                </div>
            </div>
            <Popover
                v-for="attribute in filteredAttributeList"
                :key="attribute.name"
                :trigger="['click']"
                :attribute="attribute"
                v-model="localValue[attribute.name]"
                @change="handleChange"
                @visibility-change="visibilityChange"
                placement="rightBottom"
            >
                <Item
                    :attribute="attribute"
                    :condition="localValue[attribute.name]"
                    :activeProperty="activeProperty"
                    :popover-visibility="visibility"
                    @click="handleClick(attribute.name)"
                />
            </Popover>
            
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'

    import { useVModels } from '@vueuse/core'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'

    import Popover from './popover.vue'
    import Item from './item.vue'

    export default defineComponent({
        name: 'PropertiesFacet',
        components: {
            SearchAdvanced,
            Popover,
            Item,
        },
        props: {
            modelValue: {
                required: false,
                default() {
                    return {}
                },
            },
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const queryText = ref('')
            const activeProperty = ref('')
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const { item } = toRefs(props)
            const visibility = ref<Boolean>(false)

            watch(modelValue, (newModelValue) => {
                localValue.value = newModelValue
            })

            const filteredAttributeList = computed(() =>
                item?.value.attributes.filter((i) =>
                    i.displayName
                        .toLowerCase()
                        .includes(queryText.value.toLowerCase())
                )
            )

            const handleClick = (id) => {
                activeProperty.value = id
            }

            const handleChange = (property, currentChange, allValues) => {
                Object.keys(localValue.value).forEach((key) => {
                    localValue.value[key] = localValue.value[key].filter(
                        (i) => {
                            if (
                                i.operator === 'isNull' ||
                                i.operator === 'isNotNull'
                            ) {
                                return true
                            }
                            return i.value != null || i.value !== ''
                        }
                    )
                })

                Object.keys(localValue.value).forEach((key) => {
                    if (localValue.value[key].length === 0) {
                        delete localValue.value[key]
                    }
                })

                modelValue.value = localValue.value
                emit('change', property, currentChange)
            }
            
            const visibilityChange = visible => {
                visibility.value = visible
            }

            return {
                filteredAttributeList,
                localValue,
                handleChange,
                queryText,
                handleClick,
                activeProperty,
                visibilityChange,
                visibility
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.atlan-reverse > span:nth-child(2)) {
        @apply w-full pl-0;
    }
</style>
