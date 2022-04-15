<template>
    <a-select
        :placeholder="placeholder"
        v-model:value="localValue"
        :allowClear="true"
        :showSearch="true"
        class="w-full"
        :dropdownMatchSelectWidth="true"
        @change="handleChange"
        :disabled="disabled"
        :loading="isValidating"
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
        <template v-if="isValidating" #notFoundContent>
            <a-spin size="small" class="mr-1" />searching {{ typeName }}
        </template>
        <template v-if="error" #notFoundContent>
            <AtlanIcon icon="Error"></AtlanIcon>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, toRefs, computed, ref, PropType } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import Tooltip from '@common/ellipsis/index.vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useVModels } from '@vueuse/core'

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
            const { disabled, typeName, selectedAsset } = toRefs(props)

            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const queryText = ref('')
            const limit = ref(100)
            const offset = ref(0)
            const facets = ref({
                typeName: typeName.value,
            })
            const aggregations = ref([])
            const postFacets = ref({})
            const dependentKey = ref('CHILD_ASSET_LIST')

            const attributes = ref([
                'name',
                'displayName',
                'certificateStatus',
                'certificateUpdatedBy',
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

            const defaultAttributes = ref([...attributes.value])
            const preference = ref({
                sort: 'order-asc',
            })
            const relationAttributes = ref([])

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
                list,

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
                offset.value = 0
                queryText.value = searchText
                quickChange()
            }, 200)

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const dropdownOption = computed(() =>
                list.value.map((ls) => ({
                    label: ls.attributes?.displayName || ls.attributes?.name,
                    value: ls.attributes.qualifiedName,
                }))
            )

            return {
                typeName,
                handleChange,
                totalCount,
                isValidating,

                dropdownOption,
                handleSearch,
                error,
                localValue,
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
