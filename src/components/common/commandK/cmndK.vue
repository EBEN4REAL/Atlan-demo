<template>
    <div>
        <a-modal
            :visible="isVisible"
            :footer="null"
            width="620px"
            :class="$style.modalStyles"
            @cancel="$emit('closeModal')"
        >
            <template #title> searchBar goes here </template>
            <div class="flex flex-col overflow-y-auto h-96">
                <div v-for="item in list" :key="item?.guid">
                    <AssetCard :item="item" />
                </div>
            </div>
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
    import {
        BaseAttributes,
        BasicSearchAttributes,
        tableauAttributes,
    } from '~/constant/projection'
    import { generateAssetQueryDSL } from '@/discovery/useDiscoveryDSL.ts'
    import { AssetTypeList } from '~/constant/assetType'
    import { useFilteredTabs } from '@/discovery/useTabMapped.ts'
    import AssetCard from '@/common/commandK/assetCard.vue'

    export default defineComponent({
        name: 'CommandK',
        components: { AssetCard },
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

            console.log(list)
            watch(isVisible, () => {
                if (isVisible.value) {
                    console.log('updateBody')
                    updateBody()
                }
            })
            return {
                isVisible,
                list,
            }
        },
    })
</script>

<style lang="less" module>
    .modalStyles {
        :global(.ant-modal-header) {
            @apply px-4  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-4 border-b-0  !important;
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
