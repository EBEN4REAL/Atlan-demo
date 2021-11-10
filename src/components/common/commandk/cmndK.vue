<template>
    <div>
        <a-modal
            :visible="isVisible"
            width="800px"
            class="rounded-md"
            :destroyOnClose="true"
            wrapClassName="rounded-md"
            :class="$style.modalStyles"
            :closable="false"
            :mask="false"
            @cancel="$emit('closeModal')"
        >
            <template #title>
                <div class="flex items-center px-4">
                    <atlan-icon icon="Search" class="w-auto h-5 mr-1.5" />
                    <!-- TODO: Uncomment when bringing category filter in  -->
                    <!-- <AssetCategoryFilter
                        v-if="assetCategoryFilter.length"
                        v-model:checked="assetCategoryFilter"
                        @change="handleCategoryChange"
                    >
                        <template #trigger>
                            <a-button
                                class="flex items-center justify-between w-32 h-full px-2 py-1 ml-1 mr-2 border-none group bg-primary-light hover:bg-primary hover:text-white"
                                ><span class="capitalize truncate">{{
                                    assetCategoryFilter?.length > 0
                                        ? getFiltersAppliedString
                                        : 'All'
                                }}</span>
                                <div class="flex items-center space-x-2">
                                    <AtlanIcon
                                        icon="ChevronDown"
                                        class="w-8 h-4 ml-3"
                                    />
                                    <AtlanIcon
                                        @click="assetCategoryFilter = []"
                                        icon="Cancel"
                                        class="hidden h-3 group-hover:block"
                                    />
                                </div>
                            </a-button>
                        </template>
                    </AssetCategoryFilter> -->

                    <a-input
                        ref="inputBox"
                        v-model:value="queryText"
                        class="pl-1 pr-4 text-base text-gray-500 border-0 shadow-none outline-none "
                        :class="$style.modalStyles"
                        :placeholder="dynamicSearchPlaceholder"
                        @change="handleSearchChange"
                    >
                        <template v-if="queryText.length" #addonAfter>
                            <div
                                class="flex items-center space-x-4 text-gray-500 "
                            >
                                <span
                                    @click="queryText = ''"
                                    class="text-xs text-gray-500 cursor-pointer"
                                    >CLEAR</span
                                >
                                <span class="mb-1">|</span>
                            </div>
                        </template>
                    </a-input>
                    <atlan-icon
                        icon="Cancel"
                        class="w-auto h-5 mr-1 text-gray-500 cursor-pointer"
                        @click="$emit('closeModal')"
                    />
                </div>
            </template>
            <!-- body starts here -->
            <div v-if="!assetCategoryFilter.length" class="flex flex-col">
                <span class="px-4 pt-4 pb-2 text-xs text-gray-500"
                    >I’m trying to find...</span
                >
                <!-- TODO: Uncomment when bringing category filter in  -->
                <!-- <div class="flex items-center px-4 pb-4 space-x-2">
                    <template v-for="cat in assetCategoryList" :key="cat.id">
                        <div
                            @click="handleCategoryChipClicked(cat)"
                            class="flex items-center px-3 py-1 capitalize border rounded cursor-pointer hover:bg-primary hover:text-white group"
                        >
                            <atlan-icon
                                :icon="cat?.icon"
                                class="h-4 mr-2 group-hover:text-white"
                            />
                            {{ cat.label }}
                        </div>
                    </template>
                </div> -->
            </div>
            <div class="flex flex-col pt-2 overflow-y-auto max-h-80">
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
                <div
                    v-else-if="!list.length && !queryText.length"
                    class="flex flex-col px-4 mb-6"
                >
                    <span class="mb-2 text-xs text-gray-500"
                        >Recently Viewed</span
                    >
                    <span class="mb-2 text-xs text-gray-500"
                        >You haven’t searched for anything just yet ...</span
                    >
                </div>
                <div v-for="item in list" v-else :key="item?.guid">
                    <div
                        v-if="
                            [
                                'AtlasGlossary',
                                'AtlasGlossaryTerm',
                                'AtlasGlossaryCategory',
                            ].includes(item?.typeName)
                        "
                        @click="$emit('closeModal')"
                    >
                        <GtcCard :item="item" class="px-5" />
                    </div>
                    <AssetCard :item="item" @closeModal="$emit('closeModal')" />
                </div>
            </div>
            <!-- body ends here  -->
            <!-- footer starts here -->
            <template #footer>
                <div class="flex items-center px-4 py-2 text-xs bg-gray-100">
                    <span>
                        💡 Protip: Add
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
        watch,
        computed,
        toRefs,
        Ref,
        nextTick,
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import AssetCard from '@/common/commandK/assetCard.vue'
    // import AssetCategoryFilter from '@/common/facets/assetCategory.vue'
    import GtcCard from '@/common/commandk/gtcCard.vue'
    import { assetCategoryList } from '~/constant/assetCategory'

    export default defineComponent({
        name: 'CommandK',
        components: { AssetCard, GtcCard },
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
            const queryText = ref('')
            const limit = ref(20)
            const offset = ref(0)
            const facets = ref({})
            const inputBox: Ref<null | HTMLInputElement> = ref(null)
            const dependentKey: Ref<undefined | String> = ref(undefined) // 'DEFAULT_CMD_KEY'
            const aggregations = ref(['typeName'])
            const postFacets = ref({})

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])

            const dynamicSearchPlaceholder = ref(
                'Search for tables, columns, terms and more...'
            )

            const assetCategoryFilter = ref([])
            const { list, quickChange } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
                handleFocusOnInput()
            }, 150)

            // TODO: Uncomment when bringing category filters
            // function handleCategoryChange() {
            //     offset.value = 0
            //     quickChange()
            // }
            // const getFiltersAppliedString = computed(() =>
            //     assetCategoryFilter.value.join(', ')
            // )
            // const handleCategoryChipClicked = (cat) => {
            //     assetCategoryFilter.value.push(cat.id)
            //     handleCategoryChange()
            // }
            const handleFocusOnInput = async () => {
                await nextTick()
                inputBox.value?.focus()
            }
            watch(isVisible, () => {
                if (isVisible.value) {
                    handleFocusOnInput()
                    dependentKey.value = 'DEFAULT_CMD_KEY'
                }
            })
            return {
                isVisible,
                list,
                handleSearchChange,
                queryText,
                dynamicSearchPlaceholder,
                assetCategoryFilter,
                inputBox,
                assetCategoryList,
                facets,
            }
        },
    })
</script>

<style lang="less" module>
    .modalStyles {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0  !important;
        }
        :global(.ant-input):hover {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
        :global(.ant-input-group-addon) {
            @apply shadow-none outline-none px-0 border-0 bg-transparent !important;
        }
        :global(.focus-visible) {
            @apply shadow-none outline-none px-0 border-0 border-transparent !important;
        }
        :global(.ant-modal-header) {
            @apply px-0  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-0 pt-0 pb-0 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply px-0 pt-0 pb-0 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>