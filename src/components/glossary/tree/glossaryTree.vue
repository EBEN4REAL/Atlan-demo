<template>
    <div class="border-r glossaryTree" :class="$style.glossaryTree">
   <a-tree
                            :expandedKeys="expandedKeys"
                            :selectedKeys="selectedKeys"
                            :loadedKeys="loadedKeys"
                            :tree-data="treeData"
                            :load-data="onLoadData"
                            :draggable="true"
                            :block-node="true"
                            :auto-expand-parent="false"
                            @select="selectNode"
                            @expand="expandNode"
                            @drop="dragAndDrop"
                            class="h-full"
                        >
                            <template #switcherIcon>
                                <AtlanIcon icon="CaretRight" />
                                !
                            </template>

                            <template #title="entity">
                                <div
                                    v-if="entity.title === 'Load more'"
                                    class="flex flex-row w-full text-sm font-bold leading-5  text-primary"
                                    @click="entity.click()"
                                >
                                    <span v-if="entity.isLoading">
                                        <!-- <LoadingView
                                            size="small"
                                            class="w-1 h-1 mr-4"
                                        /> -->
                                    </span>
                                    <span v-else>{{ entity.title }}</span>
                                </div>
                                <a-dropdown v-else :trigger="['contextmenu']">
                                    <div
                                        class="min-w-full"
                                        @click="
                                            () =>
                                                redirectToProfile(
                                                    entity.type,
                                                    entity.key
                                                )
                                        "
                                    >
                                        <div
                                            class="flex justify-between mr-2  group"
                                        >
                                            <div class="flex m-0">
                                                <span
                                                    v-if="
                                                        entity.type ===
                                                        'glossary'
                                                    "
                                                    class="p-0 my-auto mr-2"
                                                >
                                                    <AtlanIcon
                                                        icon="Glossary"
                                                        class="h-5"
                                                    />
                                                </span>
                                                <span
                                                    v-else
                                                    class="p-0 my-auto mr-1.5"
                                                >
                                                    <!-- <AtlanIcon
                                                        :icon="
                                                            getEntityStatusIcon(
                                                                entity.type,
                                                                entity.certificateStatus
                                                            )
                                                        "
                                                    /> -->
                                                </span>
                                                <span
                                                    class="my-auto text-sm leading-5 text-gray-700 "
                                                    >{{ entity.title }}</span
                                                >
                                            </div>

                                           
                                        </div>
                                    </div>
                                </a-dropdown>
                            </template>
                        </a-tree>
    </div>
</template>
<script lang="ts">
    // library
    import {
        defineComponent,
        computed,
        PropType,
        ref,
        toRef,
        watch,
        inject,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
    import { useDebounceFn } from '@vueuse/core'

    // components
    // import LoadingView from '@common/loaders/section.vue'
    // import ThreeDotMenu from '~/components/glossary/threeDotMenu/threeDotMenu.vue'
    // import AddCta from '~/components/glossary/tree/addCta.vue'
    // import Tooltip from '@/common/ellipsis/index.vue'
    // import AddGtcModal from '@/glossary/gtcCrud/addGtcModal.vue'
    // import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    import { Glossary } from '~/types/glossary/glossary.interface'

    // composables
    // import useGtcSearch from '~/components/glossary/composables/useGtcSearch'

    // constant
    // import { List as StatusList } from '~/constant/status'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AtlanBtn from '~/components/UI/button.vue'

    // import getEntityStatusIcon from '@/glossary/utils/getEntityStatusIcon'

    export default defineComponent({
        components: {
            // AddCta,
            // LoadingView,
            // ThreeDotMenu,
            AtlanIcon,
            AtlanBtn,
            // Tooltip,
            // AddGtcModal,
            // SearchAndFilter,
            VNodes: (_, { attrs }) => {
                return attrs.vnodes
            },
        },
        props: {
            glossaryList: {
                type: Object as PropType<Glossary[]>,
                required: true,
                default: () => [],
            },
            isHome: {
                type: Boolean,
                required: true,
                default: true,
            },
            treeData: {
                type: Object as PropType<TreeDataItem[]>,
                required: true,
                default: () => {},
            },
            onLoadData: {
                type: Function,
                required: false,
                default: () => {},
            },
            dragAndDrop: {
                type: Function,
                required: false,
                default: () => {},
            },
            expandNode: {
                type: Function,
                required: false,
                default: () => {},
            },
            collapseAll: {
                type: Function,
                required: false,
                default: () => {},
            },
            selectNode: {
                type: Function,
                required: false,
                default: () => {},
            },
            parentGlossary: {
                type: Object as PropType<Glossary>,
                required: false,
                default: () => {},
            },
            isLoading: {
                type: Boolean,
                required: false,
                default: false,
            },
            loadedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            selectedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            expandedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
        },
        setup(props, { emit }) {
            // data
            const searchQuery = ref<string>()
            const home = toRef(props, 'isHome')
            const parentGlossary = toRef(props, 'parentGlossary')
            const glossaryList = toRef(props, 'glossaryList')
            const currentGlossaryGuid = ref<string>(
                parentGlossary.value?.guid ?? 'all'
            )
            const glossaryContextDropdown = computed(() => {
                const list = glossaryList.value.map((glossary) => ({
                    value: glossary.guid,
                    label: glossary.attributes.name,
                    status: glossary.attributes.certificateStatus,
                }))
                list.unshift({ label: 'Home', value: 'all', status: undefined })
                list.push({
                    label: 'Create New Glossary',
                    value: 'createNewGlossary',
                    status: undefined
                })
                return list
            })

            const refetchGlossaryList = inject('refetchGlossaryList', () => {})

            const router = useRouter()

            const glossaryContextOpen = ref(
                router.currentRoute.value.query.cta === 'glossaryContext'
            )

            const parentGlossaryQualifiedName = computed(() =>
                home.value
                    ? ''
                    : props?.parentGlossary?.attributes?.qualifiedName ?? ''
            )

            // const {
            //     entities: searchResults,
            //     terms: searchTerms,
            //     categories: searchCategories,
            //     glossaries: searchGlossaries,
            //     isLoading: searchLoading,
            //     fetchAssetsPaginated: searchAssetsPaginated,
            // } = useGtcSearch(parentGlossaryQualifiedName, searchQuery)

            // methods
            const redirectToProfile = (type: string, guid: string) => {
                if (type === 'glossary') router.push(`/glossary/${guid}`)
                else router.push(`/glossary/${type}/${guid}`)
            }
            const backToHome = () => router.push('/glossary')

            // const onSearch = useDebounceFn(() => {
            //     if (searchQuery.value?.length) {
            //         searchAssetsPaginated({
            //             query: `${
            //                 searchQuery.value ? `${searchQuery.value}` : ''
            //             }`,
            //             offset: 0,
            //         })
            //     }
            // }, 300)

            watch(home, () => {
                searchQuery.value = ''
            })
            watch(currentGlossaryGuid, (newGuid) => {
                if (newGuid && newGuid !== parentGlossary.value?.guid) {
                    if (newGuid === 'all') router.push(`/glossary`)
                    else redirectToProfile('glossary', newGuid)
                }
            })

            watch(parentGlossary, (newParentGlossary) => {
                if(newParentGlossary?.guid)
                    currentGlossaryGuid.value = newParentGlossary.guid
            })

            return {
                redirectToProfile,
                backToHome,
                // StatusList,
                // getEntityStatusIcon,
                glossaryContextDropdown,
                // selectedKeys,
                // expandedKeys,
                // expandNode,
                // selectNode,
                searchQuery,
                // searchResults,
                // searchTerms,
                // searchCategories,
                // searchGlossaries,
                // searchLoading,
                // searchAssetsPaginated,
                // onSearch,
                currentGlossaryGuid,
                refetchGlossaryList,
                glossaryContextOpen,
            }
        },
    })
</script>
<style lang="less" module>
    .createDropdownStyles {
        :global(.ant-dropdown-menu-item) {
            @apply m-0 p-1 text-sm leading-5 rounded;
        }
    }

    .glossaryTree {
        background-color: #fafafa;

        :global(.ant-select) {
            min-width: 236px;
            width: 100%;
            @apply m-0 p-0;
        }

        :global(.ant-input-search) {
            min-width: 196px;
            height: 32px;
        }

        .tree-glossary-actions {
            .treeMode {
                @apply bg-opacity-100 !important;
            }
        }

        .treeStyles {
            max-height: calc(100vh - 11rem) !important;

            :global(.ant-tree-switcher_open) {
                transform: rotate(90deg);
            }
            :global(.ant-tree-node-selected) {
                @apply bg-black bg-opacity-5 text-primary font-bold !important;
                color: blue !important;
            }

            :global(.ant-tree-title) {
                @apply pl-1 !important;
                padding-top: 4px !important;
                padding-bottom: 4px !important;
                // max-height: 28px !important;

                &:hover {
                    @apply bg-black bg-opacity-5 !important;
                }
            }
            // :global(.ant-tree-treenode-switcher-close) {
            //     max-height: 28px !important;
            // }
            // :global(.ant-tree-treenode-switcher-open) {
            //     li {
            //         max-height: 28px !important;
            //     }
            // }
            :global(.ant-tree-node-content-wrapper) {
                @apply mb-2 border-0;
            }
        }
    }
    .parentGroup {
        :global(.parent-group-hover) {
            @apply opacity-0 !important;
        }
        &:hover {
            :global(.parent-group-hover) {
                @apply opacity-100 !important;
            }
        }
    }
</style>
