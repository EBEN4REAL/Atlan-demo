<template>
    <div class="border-r glossaryTree" :class="$style.glossaryTree">
        <div :class="$style.parentGroup">
            <GlossaryContextSwitcher
                v-model:currentGlossaryGuid="parentGlossaryGuid"
            />

            <hr />

            <div class="flex flex-col h-screen">
                <!-- Search bar -->
                <div class="flex px-4 pt-2 pb-0 pr-3 searchArea w-64">
                    <SearchAdvanced
                        v-model:modelValue="searchQuery"
                        :placeholder="
                            parentGlossaryTitle
                                ? `Search in ${parentGlossaryTitle}`
                                : 'Search'
                        "
                        size="minimal"
                        @change="onSearch"
                        class="w-full"
                    />
                </div>

                <div v-if="isLoading" class="mt-4">
                    <!-- <LoadingView /> -->
                    Loading
                </div>

                <!-- If no search and tree is not loading -->
                <div
                    v-else-if="!isLoading && !searchQuery?.length"
                    class="h-full mt-2"
                >
                    <!-- Glossary level CTAs -->
                    <div
                        class="
                            flex
                            justify-between
                            px-4
                            hover:bg-black hover:bg-opacity-5
                        "
                    >
                        <div class="flex items-center ml-5 pl-0.5">
                            <AtlanIcon icon="Glossary" class="h-5 m-0 mr-2" />
                            <div
                                class="flex justify-start w-full cursor-pointer"
                                @click="
                                    redirectToProfile(
                                        'glossary',
                                        parentGlossaryGuid
                                    )
                                "
                            >
                                <span
                                    class="
                                        flex
                                        py-2
                                        my-auto
                                        text-sm
                                        font-bold
                                        leading-3
                                        truncate
                                    "
                                    :class="{
                                        'text-primary':
                                            currentGuid === parentGlossaryGuid,
                                    }"
                                >
                                    {{ parentGlossaryTitle }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="
                                flex
                                content-center
                                my-auto
                                tree-glossary-actioans
                                parent-group-hover
                            "
                        >
                            <div
                                v-if="expandedKeys.length"
                                class="flex bg-opacity-0 cursor-pointer py-auto"
                                @click="collapseAll"
                            >
                                <AtlanIcon
                                    class="m-auto"
                                    icon="TreeCollapseAll"
                                />
                            </div>
                            <div
                                class="
                                    flex flex-col
                                    justify-center
                                    bg-opacity-0
                                    mr-2
                                "
                            >
                                <GlossaryAddCta
                                    :parentGlossaryGuid="parentGlossaryGuid"
                                    :parentGlossaryTitle="parentGlossaryTitle"
                                />
                            </div>
                            <div
                                class="
                                    flex flex-col
                                    justify-center
                                    bg-opacity-0
                                "
                            >
                                <ThreeDotMenu
                                    :entity="{
                                        typeName: 'AtlasGlossary',
                                        guid: parentGlossaryGuid,
                                        displayText: parentGlossaryTitle,
                                        attributes: {
                                            name: parentGlossaryTitle,
                                            qualifiedName:
                                                parentGlossaryQualifiedName,
                                        },
                                    }"
                                    :showLinks="false"
                                    treeMode
                                />
                                <!-- <AtlanIcon
                                    class="m-auto ml-1"
                                    icon="KebabMenu"
                                /> -->
                            </div>
                        </div>
                    </div>

                    <!-- Tree Start -->
                    <div
                        v-if="treeData.length"
                        class="
                            py-2
                            pl-4
                            pr-2
                            overflow-x-hidden overflow-y-auto
                            scrollable-container
                        "
                        :class="$style.treeStyles"
                    >
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
                            class="h-full bg-gray-100"
                        >
                            <template #switcherIcon>
                                <AtlanIcon icon="CaretRight" class="my-auto" />
                            </template>

                            <template #title="entity">
                                <GlossaryTreeItem :entity="entity" />
                            </template>
                        </a-tree>
                    </div>
                    <!-- Tree End -->

                    <!-- Empty Tree -->
                    <div
                        v-else
                        class="
                            flex flex-col
                            justify-center
                            text-base
                            leading-6
                            text-center text-gray-500
                            mt-14
                        "
                    >
                        <AtlanIcon icon="EmptyGlossary" class="h-40" />
                        <p class="m-0 mt-20">The Glossary is empty,</p>
                        <p class="m-0">Create a few terms!</p>
                    </div>
                </div>

                <!-- If search query exists and there are results -->
                <div
                    v-else-if="searchResults?.length && searchQuery?.length"
                    class="h-full p-4 overflow-y-auto"
                >
                    <div v-if="searchTerms?.length">
                        <div class="mb-0 text-gray-500">Terms</div>
                        <div
                            v-for="term in searchTerms"
                            :key="term.guid"
                            class="
                                flex flex-row
                                p-2
                                rounded
                                cursor-pointer
                                hover:bg-primary-light
                            "
                            @click="redirectToProfile('term', term.guid)"
                        >
                            <div
                                class="
                                    flex
                                    content-center
                                    w-full
                                    mb-1
                                    space-x-2
                                "
                            >
                                <span class="my-auto"
                                    ><AtlanIcon
                                        :icon="
                                            getEntityStatusIcon(
                                                'term',
                                                term.attributes
                                                    .certificateStatus
                                            )
                                        "
                                        class="w-auto h-5"
                                /></span>
                                <div class="flex flex-col w-full">
                                    <span class="text-md">{{
                                        term?.displayText
                                    }}</span>
                                    <!-- <Tooltip
                                        v-if="term.attributes.shortDescription"
                                        :tooltip-text="
                                            term.attributes.shortDescription
                                        "
                                        :rows="1"
                                        classes="w-auto text-gray-500 text-xs"
                                    /> -->
                                    <span
                                        v-if="term.attributes.shortDescription"
                                    >
                                        {{ term.attributes.shortDescription }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="searchCategories?.length" class="mt-4">
                        <div class="mb-0 text-gray-500">Categories</div>
                        <div
                            v-for="category in searchCategories"
                            :key="category.guid"
                            class="
                                flex flex-row
                                p-2
                                rounded
                                cursor-pointer
                                hover:bg-primary-light
                            "
                            @click="
                                redirectToProfile('category', category.guid)
                            "
                        >
                            <div
                                class="
                                    flex
                                    content-center
                                    w-full
                                    mb-1
                                    space-x-2
                                "
                            >
                                <span class="my-auto"
                                    ><AtlanIcon
                                        :icon="
                                            getEntityStatusIcon(
                                                'category',
                                                category.attributes
                                                    .certificateStatus
                                            )
                                        "
                                        class="w-auto h-5"
                                /></span>
                                <div class="flex flex-col w-full">
                                    <span class="text-md">{{
                                        category?.displayText
                                    }}</span>
                                    <!-- <Tooltip
                                        v-if="
                                            category.attributes.shortDescription
                                        "
                                        :tooltip-text="
                                            category.attributes.shortDescription
                                        "
                                        :rows="1"
                                        classes="w-auto text-gray-500 text-xs"
                                    /> -->
                                    <span
                                        v-if="
                                            category.attributes.shortDescription
                                        "
                                    >
                                        {{
                                            category.attributes.shortDescription
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No results -->
                <div
                    v-else-if="
                        searchQuery?.length &&
                        !searchResults?.length &&
                        !searchLoading
                    "
                    class="p-4 font-bold text-gray-500"
                >
                    No results
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import { defineComponent, PropType, ref, toRef, toRefs, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
    import { useDebounceFn } from '@vueuse/core'
    import { useVModels } from '@vueuse/core'

    // components
    // import LoadingView from '@common/loaders/section.vue'
    import ThreeDotMenu from '@/glossary/threeDotMenu.vue'
    // import AddCta from '~/components/glossary/tree/addCta.vue'
    // import Tooltip from '@/common/ellipsis/index.vue'
    import AddGtcModal from '@/glossary/modal/addGtcModal.vue'
    import ModalHeader from '@/glossary/modal/modalHeader.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import GlossaryAddCta from '@/glossary/tree/glossaryAddCta.vue'
    import GlossaryTreeItem from '@/glossary/tree/glossaryTreeItem.vue'
    import GlossaryContextSwitcher from '@/glossary/tree/glossaryContextSwitcher.vue'

    // composables
    import useGtcSearch from '~/composables/glossary/useGtcSearch'

    // constant
    // import { List as StatusList } from '~/constant/status'
    import AtlanBtn from '~/components/UI/button.vue'

    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'

    import { Glossary } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        name: 'GlossaryTree',
        components: {
            // AddCta,
            // LoadingView,
            ThreeDotMenu,
            AtlanBtn,
            // Tooltip,
            AddGtcModal,
            ModalHeader,
            SearchAdvanced,
            GlossaryAddCta,
            GlossaryTreeItem,
            GlossaryContextSwitcher,
        },
        props: {
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
            // parentGlossary: {
            //     type: Object as PropType<Glossary>,
            //     required: false,
            //     default: () => {},
            // },
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
            parentGlossaryGuid: {
                type: String,
                required: true,
                default: '',
            },
            parentGlossaryQualifiedName: {
                type: String,
                required: true,
                default: '',
            },
            parentGlossaryTitle: {
                type: String,
                required: true,
                default: '',
            },
            currentGuid: {
                type: String,
                required: false,
                default: '',
            },
        },
        setup(props, { emit }) {
            // data
            const searchQuery = ref<string>('')
            const home = toRef(props, 'isHome')
            const { parentGlossaryGuid } = useVModels(props, emit)
            const router = useRouter()

            const { parentGlossaryQualifiedName, parentGlossaryTitle } =
                toRefs(props)

            const {
                entities: searchResults,
                terms: searchTerms,
                categories: searchCategories,
                glossaries: searchGlossaries,
                isLoading: searchLoading,
                fetchAssetsPaginated: searchAssetsPaginated,
            } = useGtcSearch({
                qualifiedName: parentGlossaryQualifiedName,
                dependantFetchingKey: searchQuery,
            })

            // methods
            const redirectToProfile = (type: string, guid: string) => {
                if (type === 'glossary') router.push(`/glossary/${guid}`)
                else router.push(`/glossary/${type}/${guid}`)
            }
            const backToHome = () => router.push('/glossary')

            const onSearch = useDebounceFn(() => {
                if (searchQuery.value?.length) {
                    searchAssetsPaginated({
                        query: `${
                            searchQuery.value ? `${searchQuery.value}` : ''
                        }`,
                        offset: 0,
                    })
                }
            }, 300)

            watch(home, () => {
                searchQuery.value = ''
            })

            return {
                redirectToProfile,
                backToHome,
                // StatusList,
                getEntityStatusIcon,
                // selectedKeys,
                // expandedKeys,
                // expandNode,
                // selectNode,
                searchQuery,
                searchResults,
                searchTerms,
                searchCategories,
                searchGlossaries,
                searchLoading,
                searchAssetsPaginated,
                onSearch,
                parentGlossaryGuid,
                parentGlossaryTitle,
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
            :global(.ant-tree-switcher_close) {
                @apply flex;
            }
            :global(.ant-tree-switcher_open) {
                transform: rotate(90deg);
                @apply pt-2;
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
