<template>
    <div class="flex items-center w-full">
        <a-dropdown
            :trigger="['click']"
            class="relative"
            @click.stop="() => {}"
        >
            <a-input
                v-model:value="localValue"
                :placeholder="`All ${typeName}s`"
                allow-clear
                :disabled="disabled"
                class="w-full border-0 border-b border-gray-200 rounded-lg focus:outline-none"
                :class="[disabled ? 'cursor-not-allowed opacity-70' : '']"
                @change="handleInputChange"
                @search="handleSearch"
                :loading="isLoading"
            >
                <template #suffix>
                    <AtlanIcon
                        v-if="!localValue.length"
                        icon="CaretDown"
                        class="w-auto h-4 mb-0.5 -mx-1 absolute top-1.5 right-4"
                    />
                </template>
            </a-input>

            <template #overlay>
                <a-menu
                    class="pt-2 pl-2 pr-2 overflow-auto max-h-96"
                    :style="[
                        { minWidth: '280px' },
                        { overflow: disabled ? 'hidden !iimportant' : '' },
                    ]"
                    :class="[disabled ? 'bg-transparent opacity-0' : null]"
                >
                    <a-menu-item
                        v-for="item in dropdownOption"
                        :key="item.value"
                        @click="handleItemChange(item.value)"
                        :style="[
                            {
                                background: item.selected
                                    ? 'rgb(59, 130, 246 , .1)'
                                    : null,
                            },
                            { fontWeight: item.selected ? 'bold' : null },
                        ]"
                    >
                        {{ item.label }}
                    </a-menu-item>
                    <template v-if="isLoading && !disabled">
                        <a-spin size="small" class="mr-1" />searching
                        {{ typeName }}
                    </template>
                    <template v-if="error && !disabled" #notFoundContent>
                        <AtlanIcon icon="Error"></AtlanIcon>
                    </template>
                    <div
                        class="sticky bottom-0 flex justify-between py-2 pl-3 bg-white"
                        v-if="!isLoading && dropdownOption.length && !disabled"
                    >
                        <div class="w-1/2">
                            <div class="text-gray-500">
                                {{ dropdownOption.length }} of {{ totalCount }}
                                {{
                                    dropdownOption.length > 1
                                        ? `${typeName}s`
                                        : typeName
                                }}
                            </div>
                        </div>
                        <div class="w-1/3">
                            <div
                                class="cursor-pointer text-primary hover:underline"
                                v-if="isLoadMore"
                                @click="handleLoadMore"
                            >
                                load more...
                            </div>
                        </div>
                    </div>
                    <div
                        class="flex items-center p-20"
                        v-if="!dropdownOption.length && !isLoading && !disabled"
                    >
                        No {{ `${typeName}s` }} to show
                    </div>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, toRefs, ref, computed, inject } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { useDebounceFn } from '@vueuse/core'
    import bodybuilder from 'bodybuilder'
    import Tooltip from '@common/ellipsis/index.vue'
    import { truncateString } from '~/utils/truncateString'

    export default defineComponent({
        name: 'AssetSelector',
        components: {
            Tooltip,
        },
        props: {
            modelValue: {
                type: String,
                required: false,
            },
            filters: {
                type: Object,
                required: false,
            },
            placeholder: {
                type: String,
                required: true,
            },
            typeName: {
                type: String,
                required: false,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            bgGrayForSelector: {
                type: Boolean,
                default: true,
            },
            itemSelected: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const localValue = ref<string>('')
            const selectedValue = ref<string>('')
            const itemIndex = ref<number>()

            const loadMore = inject('loadMore') as Function

            const { disabled, filters, typeName, modelValue } = toRefs(props)
            const initialBody = {
                dsl: filters.value,
                attributes: ['name', 'displayName'],
            }

            const immediate = computed(() => {
                return !!modelValue.value
            })

            const { list, replaceBody, data, isLoading, error } =
                useAssetListing(initialBody, immediate.value)

            watch(localValue, () => {
                if (!localValue.value) {
                    itemIndex.value = -1
                    emit('update:modelValue', '')
                    emit('change', '')
                }
            })

            const handleSearch = useDebounceFn((searchText: string) => {
                const base = bodybuilder()
                if (searchText) {
                    base.orQuery('match', 'name', {
                        query: searchText,
                        boost: 40,
                    })

                    base.orQuery('match', 'name', {
                        query: searchText,
                        operator: 'AND',
                        boost: 40,
                    })

                    base.orQuery('match', 'name.keyword', {
                        query: searchText,
                        boost: 120,
                    })

                    base.orQuery('match_phrase', 'name', {
                        query: searchText,
                        boost: 70,
                    })
                    base.orQuery('wildcard', 'name', {
                        value: `${searchText.toLowerCase()}*`,
                    })
                    base.queryMinimumShouldMatch(1)

                    initialBody.dsl = {
                        query: {
                            bool: {
                                ...base.build()?.query?.bool,
                                ...filters.value?.query?.bool,
                            },
                        },
                        size: 100,
                    }
                } else {
                    initialBody.dsl = filters.value
                }

                replaceBody(initialBody)
            }, 200)

            const totalCount = computed(() => data.value?.approximateCount || 0)

            watch(
                filters,
                () => {
                    if (!disabled.value) {
                        if (!modelValue.value) {
                            initialBody.dsl = filters.value
                            replaceBody(initialBody)
                        }
                    }
                },
                { immediate: true }
            )

            const dropdownOption = computed(() => {
                let records: {
                    label: string
                    value: string
                    selected: boolean
                }[] = []
                list.value.forEach((item, index) => {
                    if (
                        item &&
                        (item?.attributes?.displayName ||
                            item?.attributes?.name)
                    ) {
                        records.push({
                            label:
                                item?.attributes?.displayName ||
                                item?.attributes?.name,
                            value: item?.attributes?.qualifiedName,
                            selected: index === itemIndex.value ? true : false,
                        })
                    }
                })
                return records
            })

            const handleItemChange = (checkedValues: string) => {
                itemIndex.value = dropdownOption.value.findIndex(
                    (item) => item.value === checkedValues
                )
                let arr = checkedValues.split('/')
                localValue.value = truncateString(
                    arr[arr.length - 1],
                    15,
                    '...'
                )
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }

            const handleInputChange = (e) => {
                handleSearch(e.target.value)
            }

            const handleLoadMore = async () => {
                await loadMore()
                if (modelValue.value) {
                    initialBody.dsl = filters.value
                    replaceBody(initialBody)
                }
            }

            const isLoadMore = computed(() => {
                if (totalCount.value > list?.value?.length) {
                    return true
                }
                return false
            })

            return {
                typeName,
                list,
                handleItemChange,
                totalCount,
                data,
                isLoading,
                modelValue,
                dropdownOption,
                immediate,
                handleSearch,
                error,
                localValue,
                selectedValue,
                handleInputChange,
                isLoadMore,
                handleLoadMore,
            }
        },
    })
</script>
