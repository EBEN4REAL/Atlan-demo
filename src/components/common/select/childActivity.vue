<template>
    <a-select
        :placeholder="placeholder"
        v-model:value="localValue"
        :allowClear="true"
        :showSearch="true"
        class="w-full"
        :dropdownMatchSelectWidth="true"
        @change="handleChange"
        :loading="isValidating"
        @search="handleSearch"
    >
        <template v-for="item in list" :key="item?.attributes?.qualifiedName">
            <a-select-option :value="item?.attributes?.qualifiedName">
                <div class="inline-flex items-center justify-between w-full">
                    <div class="flex items-center">
                        <component
                            :is="dataTypeCategoryImage(item)"
                            class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                        ></component>
                        <span class="mt-px ml-1 text-gray-700 truncate">
                            {{ title(item) }}
                        </span>
                        <CertificateBadge
                            v-if="certificateStatus(item)"
                            :status="certificateStatus(item)"
                            :username="certificateUpdatedBy(item)"
                            class="-mt-0.5 ml-1"
                        ></CertificateBadge>
                    </div>
                    <div
                        v-if="
                            item.attributes?.isPrimary ||
                            item.attributes?.isForeign ||
                            item.attributes?.isPartition
                        "
                        class="relative flex items-center h-full"
                    >
                        <ColumnKeys
                            :isPrimary="item.attributes?.isPrimary"
                            :isForeign="item.attributes?.isForeign"
                            :isPartition="item.attributes?.isPartition"
                        />
                    </div>
                </div>
            </a-select-option>
        </template>
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="mb-0" />
        </template>
        <template v-if="isValidating" #notFoundContent>
            <a-spin size="small" class="mr-1" />searching {{ typeName }}s
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
    import ColumnKeys from '~/components/common/column/columnKeys.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'

    export default defineComponent({
        name: 'AssetSelector',
        components: {
            Tooltip,
            ColumnKeys,
            CertificateBadge,
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
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { typeName, selectedAsset } = toRefs(props)

            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const {
                certificateStatus,
                certificateUpdatedBy,
                dataTypeCategoryImage,
                title,
            } = useAssetInfo()

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
                list,
                dropdownOption,
                handleSearch,
                error,
                localValue,
                dataTypeCategoryImage,
                title,
                certificateStatus,
                certificateUpdatedBy,
            }
        },
    })
</script>
