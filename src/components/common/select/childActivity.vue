<template>
    <div class="flex items-center w-full">
        <a-select
            :placeholder="placeholder"
            :value="modelValue"
            :allowClear="true"
            :showSearch="true"
            class="w-full asset-select"
            :dropdownMatchSelectWidth="true"
            @change="handleChange"
            :disabled="disabled"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            dropdownClassName="connectorDropdown"
            :loading="isLoading"
            @search="handleSearch"
        >
            <template v-for="item in dropdownOption" :key="item.value">
                <a-select-option :value="item.value">
                    <div class="flex flex-col">
                        <div class="flex items-center">
                            <Tooltip
                                :tooltip-text="item.label"
                                placement="topLeft"
                            />
                        </div>
                    </div>
                </a-select-option>
            </template>
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
</template>

<script lang="ts">
    import {
        defineComponent,
        watch,
        toRefs,
        computed,
        ref,
        PropType,
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import bodybuilder from 'bodybuilder'
    import Tooltip from '@common/ellipsis/index.vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { assetInterface } from '~/types/assets/asset.interface'

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
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { disabled, filters, typeName, modelValue } = toRefs(props)

            const limit = ref(20)
            const offset = ref(0)
            const facets = ref({
                typeName: typeName.value,
            })
            const aggregations = ref([])
            const postFacets = ref({})
            const dependentKey = ref('CHILD_ASSET_LIST')

            const columnAttributes = ref([
                'name',
                'displayName',
                'description',
                'displayDescription',
                'userDescription',
                'certificateStatus',
                'certificateUpdatedBy',
                'meanings',
                'category',
                'dataType',
                'isPrimary',
                'isCustom',
                'isPartition',
                'isSort',
                'isIndexed',
                'isForeign',
                'isDist',
                'order',
            ])

            const defaultAttributes = ref([...columnAttributes.value])
            const preference = ref({
                sort: 'order-asc',
            })
            const relationAttributes = ref([...DefaultRelationAttributes])

            const assetQualifiedName = computed(
                () => selectedAsset.value?.attributes?.qualifiedName
            )

            const updateFacet = () => {
                facets.value = {}
                if (
                    selectedAsset?.value.typeName?.toLowerCase() === 'table' ||
                    selectedAsset?.value.typeName?.toLowerCase() ===
                        'tablepartition'
                ) {
                    facets.value.tableQualifiedName = assetQualifiedName.value
                }
                if (
                    selectedAsset?.value.typeName?.toLowerCase() === 'view' ||
                    selectedAsset?.value.typeName?.toLowerCase() ===
                        'materialisedview'
                ) {
                    facets.value.viewQualifiedName = assetQualifiedName.value
                }
            }

            updateFacet()

            const {
                freshList: list,
                list: combinedList,
                isLoading,
                quickChange,
                totalCount,
                error,
                isValidating,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                suppressLogs: true,
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
            const dropdownOption = computed(() =>
                list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    value: ls.attributes.qualifiedName,
                }))
            )

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

<style lang="less">
    .asset-select {
        .ant-select-selector {
            @apply border-0 rounded-lg !important;
            border-top-width: 0px !important;
            border-right-width: 0px !important;
            border-bottom-width: 1px !important;
            border-left-width: 0px !important;
            border-color: rgba(
                243,
                243,
                243,
                var(--tw-border-opacity)
            ) !important;
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important;
        }
    }
</style>
