<template>
    <a-select
        placeholder="Select a glossary"
        :v-model:value="selectedValue"
        :allowClear="true"
        :showSearch="true"
        :alwaysOpen="true"
        @search="handleSearch"
        @change="handleChange"
        :class="isTransparent ? $style.transparent : ''"
        :get-popup-container="(target) => target.parentNode"
        notFoundContent="No glossary found"
    >
        <a-select-option
            :value="item.attributes?.qualifiedName"
            v-for="item in filteredList"
            :key="item.guid"
        >
            <div class="flex items-center">
                <div class="flex flex-col">
                    <div class="flex items-center">
                        <AtlanIcon icon="Glossary" class="pr-1"></AtlanIcon>
                        <div class="overflow-ellipsis">
                            {{
                                item?.attributes.displayName ||
                                item.attributes.name
                            }}
                        </div>
                    </div>

                    <span class="text-xs text-gray-500"
                        >{{ item.termsCount }} terms</span
                    >
                </div>
            </div>
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, ref, computed, toRefs } from 'vue'

    import useGlossaryData from '~/composables/glossary/useGlossaryData'
    import AtlanIcon from '../icon/atlanIcon.vue'

    export default defineComponent({
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return undefined
                },
            },
            showCount: {
                type: Boolean,
                required: false,
                default() {
                    return true
                },
            },
            isTransparent: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const { isTransparent } = toRefs(props)

            const { list } = useGlossaryData()
            const queryText = ref('')
            const selectedValue = ref(modelValue.value)
            const handleChange = (value) => {
                modelValue.value = value
                emit('change')
            }
            const handleSearch = (val) => {
                queryText.value = val
            }
            const filteredList = computed(() => {
                let tempList = []
                tempList = list
                    .filter((i) => {
                        if (queryText?.value !== '') {
                            return (
                                i.attributes?.name
                                    ?.toLowerCase()
                                    .includes(queryText.value.toLowerCase()) ||
                                i.attributes?.displayName
                                    ?.toLowerCase()
                                    .includes(queryText.value.toLowerCase())
                            )
                        }
                        return true
                    })
                    .sort((a, b) =>
                        a.termsCount < b.termsCount
                            ? 1
                            : b.termsCount < a.termsCount
                            ? -1
                            : 0
                    )
                return tempList
            })
            return {
                list,
                filteredList,
                selectedValue,
                handleChange,
                isTransparent,
                handleSearch,
            }
        },
        components: { AtlanIcon },
    })
</script>

<style lang="less" module>
    .transparent {
        &:global(.ant-select:not(.ant-select-disabled)) {
            :hover {
                @apply border-0  rounded-none  !important;
            }
        }

        &:global(.ant-select-focused) {
            @apply border-0  rounded-none  !important;
            :global(.ant-select-selector) {
                @apply border-0  border-r-0 rounded-none shadow-none  !important;
            }
        }
        :global(.ant-select-selector) {
            @apply border-0   border-r-0 rounded-none shadow-none border-transparent  !important;
        }
    }
</style>
