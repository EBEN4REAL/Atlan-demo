<template>
    <div class="flex items-center w-full">
        <div class="mr-1">
            <a-tooltip :title="typeName" placement="right" v-if="!isLoading">
                <AtlanIcon
                    class="w-4 h-4"
                    :icon="typeName + `Gray`"
                    :class="disabled ? 'text-gray-500' : 'text-gray-700'"
            /></a-tooltip>
            <a-spin v-else size="small" class="w-4 h-4"></a-spin>
        </div>
        <div style="width: calc(100% - 22px)">
            <a-select
                :placeholder="placeholder"
                :value="modelValue"
                :allowClear="true"
                :showSearch="true"
                :options="dropdownOption"
                class="w-full"
                :dropdownMatchSelectWidth="true"
                @change="handleChange"
                :disabled="disabled"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                dropdownClassName="connectorDropdown"
                :loading="isLoading"
                @search="handleSearch"
            >
                <template #suffixIcon>
                    <AtlanIcon icon="CaretDown" class="mb-0" />
                </template>
                <template v-if="isLoading" #notFoundContent>
                    <a-spin size="small" class="mr-1" />searching {{ typeName }}
                </template>
                <template v-if="error" #notFoundContent>
                    <AtlanIcon icon="Error"></AtlanIcon>
                </template>
            </a-select>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, toRefs, computed } from 'vue'
    import { useAssetListing } from '~/components/insights/common/composables/useAssetListing'
    import { message } from 'ant-design-vue'
    import { useDebounceFn } from '@vueuse/core'
    import bodybuilder from 'bodybuilder'

    export default defineComponent({
        name: 'AssetSelector',
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
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
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

            watch(error, () => {
                if (error.value) {
                    console.log(typeName.value)
                    // message.error({
                    //     content: `Failed to fetch ${typeName.value}s!`,
                    //     duration: 3,
                    // })
                }
            })
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

            const handleChange = (checkedValues: string) => {
                emit('update:modelValue', checkedValues)
                emit('change', checkedValues)
            }
            const dropdownOption = computed(() => {
                let data = list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    value: ls.attributes.qualifiedName,
                }))
                data.sort((x, y) => {
                    if (x.label < y.label) return -1
                    if (x.label > y.label) return 1
                    return 0
                })
                return data
            })

            return {
                typeName,
                list,
                handleChange,
                totalCount,
                data,
                isLoading,
                modelValue,
                dropdownOption,
                immediate,
                handleSearch,
                error,
            }
        },
    })
</script>
