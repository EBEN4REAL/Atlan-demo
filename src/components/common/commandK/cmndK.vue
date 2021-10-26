<template>
    <div>
        <a-modal
            :visible="isVisible"
            width="620px"
            :class="$style.modalStyles"
            :closable="false"
            @cancel="$emit('closeModal')"
        >
            <template #title>
                <div class="flex items-center px-4">
                    <atlan-icon icon="Search" class="w-auto h-5 mr-1" />
                    <a-input
                        v-model:value="queryText"
                        class="pr-4 text-base text-gray-500 border-0 shadow-none outline-none "
                        :class="$style.modalStyles"
                        :placeholder="dynamicSearchPlaceholder"
                        :allowClear="true"
                        @change="handleSearchChange"
                    >
                    </a-input>
                    <atlan-icon
                        icon="Cancel"
                        class="w-auto h-5 mr-1 text-gray-500 cursor-pointer"
                        @click="$emit('closeModal')"
                    />
                </div>
            </template>
            <div class="flex flex-col overflow-y-auto max-h-96">
                <div
                    v-if="!list?.length && queryText.length"
                    class="flex flex-col items-center justify-center pt-12 pb-20 "
                >
                    <atlan-icon icon="NoResultsFound" class="w-auto h-40" />
                    <span class="flex items-center">
                        No results found for
                        <span class="font-bold"> "{{ queryText }}"</span>
                    </span>
                </div>
                <div v-for="item in list" v-else :key="item?.guid">
                    <AssetCard :item="item" />
                </div>
            </div>
            <template #footer>
                <div class="flex items-center px-4 py-2 text-xs bg-gray-100">
                    <span>
                        Protip: Add
                        <span class="text-primary">description:</span>
                        to search for just within description
                    </span>
                </div>
            </template>
        </a-modal>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
        onMounted,
        watch,
        computed,
        toRefs,
    } from 'vue'
    import { useAssetListing } from '@/discovery/useAssetListing.ts'
    import { useDebounceFn } from '@vueuse/core'
    import {
        BaseAttributes,
        BasicSearchAttributes,
        tableauAttributes,
    } from '~/constant/projection'
    import { generateAssetQueryDSL } from '@/discovery/useDiscoveryDSL.ts'
    import { AssetTypeList } from '~/constant/assetType'
    import { useFilteredTabs } from '@/discovery/useTabMapped.ts'
    import AssetCard from '@/common/commandK/assetCard.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    export default defineComponent({
        name: 'CommandK',
        components: { AssetCard, SearchAndFilter },
        props: {
            isCmndKVisible: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        emits: ['closeModal'],
        setup(props) {
            // data
            // command k behaviour
            const { isCmndKVisible } = toRefs(props)
            const isVisible = computed(() => isCmndKVisible.value)

            // asset listing
            const assetList = ref()
            const queryText = ref('')
            const limit = ref(20)
            const offset = ref(0)
            const facets = ref({})
            const selectedTab = ref('Catalog')
            const dynamicSearchPlaceholder = ref(
                'Search for tables, columns, terms and more...'
            )
            const assetTypeList = computed(() => {
                const filteredTabs = AssetTypeList.filter(
                    (item) => item.isDiscoverable == true
                )
                return [
                    {
                        id: 'Catalog',
                        label: 'All',
                    },
                    ...filteredTabs,
                ]
            })
            const assetCategoryFilter = ref([
                'datasets',
                'fields',
                'visualizations',
                'businessTerms',
            ])
            const applicableTabs: Ref<string[]> = computed(() =>
                useFilteredTabs({
                    connector: facets.value?.connector,
                    category: assetCategoryFilter.value,
                })
            )

            const { list, replaceBody, isLoading } = useAssetListing('', false)
            const updateBody = () => {
                console.log('updating')
                const initialBody = {
                    relationAttributes: [
                        'readme',
                        'displayText',
                        'name',
                        'description',
                        'shortDescription',
                    ],
                    dsl: {
                        size: limit.value,
                        from: offset.value,
                        ...generateAssetQueryDSL(
                            facets.value,
                            queryText.value,
                            selectedTab.value,
                            applicableTabs.value
                        ),
                    },
                    attributes: [
                        ...BaseAttributes,
                        ...BasicSearchAttributes,
                        ...tableauAttributes,
                    ],
                }

                replaceBody(initialBody)
            }
            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                updateBody()
            }, 150)

            console.log(list)
            // watch(isVisible, () => {
            //     if (isVisible.value) {
            //         console.log('updateBody')
            //         updateBody()
            //     }
            // })
            return {
                isVisible,
                list,
                handleSearchChange,
                queryText,
                dynamicSearchPlaceholder,
            }
        },
    })
</script>

<style lang="less" module>
    .modalStyles {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 border-green-600 !important;
        }
        :global(.ant-input):focus,
        :global(.ant-input):hover {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
        :global(.focus-visible) {
            @apply shadow-none outline-none px-0 border-0 border-green-600 !important;
        }
        :global(.ant-modal-header) {
            @apply px-0  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-0 pt-0 pb-0 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply px-0 pt-0 pb-4 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
