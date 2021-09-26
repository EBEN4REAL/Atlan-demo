<template>
    <div class="glossaryTree" :class="$style.glossaryTree">
        <div
            class="
                flex
                py-3
                px-4
                text-sm
                leading-5
                text-gray-500
                bg-gray-100
                cursor-pointer
            "
        >
            <a-select
                v-model:value="currentGlossaryGuid"
                :options="glossaryContextDropdown"
            >
                <template #dropdownRender="{ menuNode: menu }">
                    <v-nodes :vnodes="menu" />

                    <hr class="mx-4 my-3" />

                    <AddGtcModal entityType="glossary" @onAddGlossary="refetchGlossaryList">
                        <template #header>
                            <div class="flex items-center mr-5">
                                <AtlanIcon
                                    icon="Glossary"
                                    class="h-4 m-0 mr-2"
                                />
                                <span class="text-xs font-bold text-gray-700">
                                    New glossary
                                </span>
                            </div>
                        </template>
                        <template #trigger>
                            <div
                                class="
                                    flex
                                    cursor-pointer
                                    text-bold
                                    leading-5
                                    text-gray-700 text-sm
                                    pb-3
                                    px-4
                                "
                                @mousedown="(e) => e.preventDefault()"
                                @click="addItem"
                            >
                                <AtlanIcon icon="Add" class="mr-2" /> Add New
                                Glossary
                            </div>
                        </template>
                    </AddGtcModal>
                </template>
            </a-select>
        </div>

        <hr />

        <div v-if="isHome" class="px-2 py-4 h-screen">
            <div class="flex flex-col px-2 pb-2">
                <a-input-search
                    v-model:value="searchQuery"
                    placeholder="Search accross Glossaries"
                    @change="onSearch"
                ></a-input-search>
            </div>
            <div
                v-if="searchResults?.length && searchQuery?.length"
                class="px-4 h-full overflow-y-auto"
            >
                <div v-if="searchTerms?.length">
                    <div class="mb-2 text-gray-500">Terms</div>
                    <div
                        v-for="term in searchTerms"
                        :key="term.guid"
                        class="
                            flex flex-row
                            p-2
                            hover:bg-primary-light
                            cursor-pointer
                            rounded
                        "
                        @click="redirectToProfile('term', term.guid)"
                    >
                        <div class="mb-1 flex space-x-2 content-center w-full">
                            <span class="my-auto"
                                ><AtlanIcon
                                    :icon="
                                        getEntityStatusIcon(
                                            'term',
                                            term.attributes.assetStatus
                                        )
                                    "
                                    class="w-auto h-5"
                            /></span>
                            <div class="flex flex-col w-full">
                                <span class="text-md">{{
                                    term.displayText
                                }}</span>
                                <Tooltip
                                    v-if="term.attributes.shortDescription"
                                    :tooltip-text="
                                        term.attributes.shortDescription
                                    "
                                    :rows="1"
                                    classes="w-auto text-gray-500 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="searchCategories?.length" class="mt-4">
                    <div class="mb-2 text-gray-500">Categories</div>
                    <div
                        v-for="category in searchCategories"
                        :key="category.guid"
                        class="
                            flex flex-row
                            p-2
                            hover:bg-primary-light
                            cursor-pointer
                            rounded
                        "
                        @click="redirectToProfile('category', category.guid)"
                    >
                        <div class="mb-1 flex space-x-2 content-center w-full">
                            <span class="my-auto"
                                ><AtlanIcon
                                    :icon="
                                        getEntityStatusIcon(
                                            'category',
                                            category.attributes.assetStatus
                                        )
                                    "
                                    class="w-auto h-5"
                            /></span>
                            <div class="flex flex-col w-full">
                                <span class="text-md">{{
                                    category.displayText
                                }}</span>
                                <Tooltip
                                    v-if="category.attributes.shortDescription"
                                    :tooltip-text="
                                        category.attributes.shortDescription
                                    "
                                    :rows="1"
                                    classes="w-auto text-gray-500 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="searchGlossaries?.length" class="mt-4">
                    <div class="mb-2 text-gray-500">Glossaries</div>
                    <div
                        v-for="glossary in searchGlossaries"
                        :key="glossary.guid"
                        class="
                            flex flex-row
                            p-2
                            hover:bg-primary-light
                            cursor-pointer
                            rounded
                        "
                        @click="redirectToProfile('glossary', glossary.guid)"
                    >
                        <div class="mb-1 flex space-x-2 content-center w-full">
                            <span class="my-auto"
                                ><AtlanIcon icon="Glossary" class="w-auto h-5"
                            /></span>
                            <div class="flex flex-col w-full">
                                <span class="text-md">{{
                                    glossary.displayText
                                }}</span>
                                <Tooltip
                                    v-if="glossary.attributes.shortDescription"
                                    :tooltip-text="
                                        glossary.attributes.shortDescription
                                    "
                                    :rows="1"
                                    classes="w-auto text-gray-500 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-else-if="glossaryList.length"
                class="h-full pb-32 overflow-y-auto"
            >
                <div
                    v-for="glossary in glossaryList"
                    :key="glossary.guid"
                    @click="() => redirectToProfile('glossary', glossary.guid)"
                >
                    <div
                        class="
                            flex flex-col
                            justify-center
                            px-3
                            mr-2
                            text-sm
                            leading-5
                            text-gray-700
                            cursor-pointer
                            h-9
                            group
                            hover:bg-primary-light
                            hover:text-primary
                        "
                    >
                        <div class="flex flex-row justify-between">
                            {{ glossary.displayText }}
                            <!-- <Fa
                            class="w-auto h-3 text-white group-hover:text-primary"
                            icon="fal external-link-alt"
                        /> -->
                            <atlan-icon
                                class="
                                    w-auto
                                    h-5
                                    text-white
                                    group-hover:text-primary
                                "
                                icon="ArrowRight"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="h-screen flex flex-col">
            <div class="p-4 pr-3 pb-0 flex searchArea">
                <a-input-search
                    v-model:value="searchQuery"
                    class="mr-2"
                    :placeholder="
                        currentGuid &&
                        currentGuid === parentGlossary?.guid &&
                        parentGlossary?.displayText
                            ? `Search in ${parentGlossary?.displayText}`
                            : 'Search'
                    "
                    @change="onSearch"
                ></a-input-search>
                <a-button class="w-8 h-8 flex items-center p-2 rounded">
                    <AtlanIcon icon="Filter" />
                </a-button>
            </div>

            <div v-if="isLoading" class="mt-4">
                <LoadingView />
            </div>
            <div
                v-else-if="!isLoading && !searchQuery?.length"
                class="h-full mt-2"
            >
                <div class="flex justify-between px-4">
                    <div class="flex items-center ml-3">
                        <AtlanIcon icon="Glossary" class="h-5 m-0 mr-2" />
                        <div
                            class="flex justify-start w-full cursor-pointer"
                            @click="
                                redirectToProfile(
                                    'glossary',
                                    parentGlossary.guid
                                )
                            "
                        >
                            <span
                                class="flex my-auto text-xs leading-4 font-bold"
                                :class="{
                                    'text-primary':
                                        currentGuid === parentGlossary?.guid,
                                }"
                            >
                                GLOSSARY
                            </span>
                        </div>
                    </div>

                    <div class="space-x-2 flex tree-glossary-actions">
                        <!-- <a-dropdown :trigger="['click']">
                        <a class="ant-dropdown-link" @click.prevent>
                            <a-button
                                class="flex flex-col justify-center w-7 h-7 p-2 border-gray-300 bg-white"
                            >
                                <fa icon="fal plus" />
                            </a-button>
                        </a>
                        <template #overlay>
                            <a-menu>
                                <div
                                    class="px-2 py-1"
                                    :class="$style.createDropdownStyles"
                                >
                                    <a-menu-item key="0" @click="createNewTerm">
                                        New Term
                                    </a-menu-item>
                                    <a-menu-item key="1" @click="createNewCategory">
                                        New Category
                                    </a-menu-item>
                                    <hr class="my-1" />
                                    <a-menu-item key="2">
                                        Bulk Upload Terms
                                    </a-menu-item>
                                    <a-menu-item key="3">
                                        Bulk Upload Categories
                                    </a-menu-item>
                                </div>
                            </a-menu>
                        </template>
                    </a-dropdown> -->
                        <div
                            v-if="expandedKeys.length"
                            class="
                                w-7
                                h-7
                                py-auto
                                bg-opacity-0
                                cursor-pointer
                                flex
                            "
                            @click="collapseAll"
                        >
                            <AtlanIcon class="m-auto" icon="TreeCollapseAll" />
                        </div>
                        <ThreeDotMenu
                            class="w-7 h-7"
                            :entity="parentGlossary"
                            :showLinks="false"
                            :treeMode="true"
                        />
                    </div>
                </div>
                <div
                    v-if="treeData.length"
                    class="py-2 pl-4 pr-2 h-full pb-48 overflow-y-auto"
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
                        class="h-full"
                    >
                        <template #title="entity">
                            <a-dropdown :trigger="['contextmenu']">
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
                                        class="flex justify-between mr-2 group"
                                    >
                                        <div class="flex m-0">
                                            <span
                                                v-if="entity.type === 'glossary'"
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
                                                <AtlanIcon
                                                    :icon="
                                                        getEntityStatusIcon(
                                                            entity.type,
                                                            entity.assetStatus
                                                        )
                                                    "
                                                />
                                            </span>
                                            <span
                                                class="
                                                    my-auto
                                                    text-sm
                                                    leading-5
                                                    text-gray-700
                                                "
                                                >{{ entity.title }}</span
                                            >
                                        </div>

                                        <ThreeDotMenu
                                            :treeMode="true"
                                            :visible="false"
                                            :entity="{
                                                guid: entity.guid,
                                                displayText: entity.name,
                                                typeName:
                                                    entity.type === 'term'
                                                        ? 'AtlasGlossaryTerm'
                                                        : 'AtlasGlossaryCategory',
                                                attributes: {
                                                    ...entity,
                                                    anchor: {
                                                        guid: entity.anchor
                                                            .glossaryGuid,
                                                        uniqueAttributes: {
                                                            qualifiedName:
                                                                parentGlossary?.qualifiedName,
                                                        },
                                                    },
                                                    name: entity.name,
                                                    assetStatus:
                                                        entity.assetStatus,
                                                    qualifiedName:
                                                        entity.qualifiedName,
                                                    parentCategory: {
                                                        guid: entity
                                                            .parentCategory
                                                            ?.categoryGuid,
                                                    },
                                                    categories:
                                                        entity.categories?.map(
                                                            (category) => ({
                                                                guid: category?.categoryGuid,
                                                            })
                                                        ),
                                                },
                                            }"
                                        />
                                    </div>
                                </div>
                            </a-dropdown>
                        </template>
                    </a-tree>
                </div>
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
            <div
                v-else-if="searchResults?.length && searchQuery?.length"
                class="px-4 h-full overflow-y-auto"
            >
                <div v-if="searchTerms?.length">
                    <div class="mb-2 text-gray-500">Terms</div>
                    <div
                        v-for="term in searchTerms"
                        :key="term.guid"
                        class="
                            flex flex-row
                            p-2
                            hover:bg-primary-light
                            cursor-pointer
                            rounded
                        "
                        @click="redirectToProfile('term', term.guid)"
                    >
                        <div class="mb-1 flex space-x-2 content-center w-full">
                            <span class="my-auto"
                                ><AtlanIcon
                                    :icon="
                                        getEntityStatusIcon(
                                            'term',
                                            term.attributes.assetStatus
                                        )
                                    "
                                    class="w-auto h-5"
                            /></span>
                            <div class="flex flex-col w-full">
                                <span class="text-md">{{
                                    term.displayText
                                }}</span>
                                <Tooltip
                                    v-if="term.attributes.shortDescription"
                                    :tooltip-text="
                                        term.attributes.shortDescription
                                    "
                                    :rows="1"
                                    classes="w-auto text-gray-500 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="searchCategories?.length" class="mt-4">
                    <div class="mb-2 text-gray-500">Categories</div>
                    <div
                        v-for="category in searchCategories"
                        :key="category.guid"
                        class="
                            flex flex-row
                            p-2
                            hover:bg-primary-light
                            cursor-pointer
                            rounded
                        "
                        @click="redirectToProfile('category', category.guid)"
                    >
                        <div class="mb-1 flex space-x-2 content-center w-full">
                            <span class="my-auto"
                                ><AtlanIcon
                                    :icon="
                                        getEntityStatusIcon(
                                            'category',
                                            category.attributes.assetStatus
                                        )
                                    "
                                    class="w-auto h-5"
                            /></span>
                            <div class="flex flex-col w-full">
                                <span class="text-md">{{
                                    category.displayText
                                }}</span>
                                <Tooltip
                                    v-if="category.attributes.shortDescription"
                                    :tooltip-text="
                                        category.attributes.shortDescription
                                    "
                                    :rows="1"
                                    classes="w-auto text-gray-500 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-else-if="
                    searchQuery?.length &&
                    !searchResults?.length &&
                    !searchLoading
                "
                class="px-4"
            >
                No results
            </div>
            <div v-else class="mt-4">
                <LoadingView />
            </div>
        </div>
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
import LoadingView from '@common/loaders/section.vue'
import ThreeDotMenu from '@/glossary/common/threeDotMenu.vue'
import Tooltip from '@/common/ellipsis/index.vue'
import AddGtcModal from '@/glossary/common/addGtcModal.vue'

// import { Glossary } from '~/api/atlas/glossary'
import { Glossary } from '~/types/glossary/glossary.interface'

// composables
import useCreateGlossary from '~/components/glossary/composables/useCreateGlossary'
import useDeleteGlossary from '~/components/glossary/composables/useDeleteGlossary'
import useGtcSearch from '~/components/glossary/composables/useGtcSearch'

// constant
import { List as StatusList } from '~/constant/status'
import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
import AtlanBtn from '~/components/UI/button.vue'

// import { Glossary } from '~/api/atlas/glossary'

export default defineComponent({
    components: {
        LoadingView,
        ThreeDotMenu,
        AtlanIcon,
        AtlanBtn,
        Tooltip,
        AddGtcModal,
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
        currentGuid: {
            type: String,
            required: true,
            default: '',
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
        const currentGlossaryGuid = ref<string>(
            parentGlossary.value?.guid ?? ''
        )
        const glossaryContextDropdown = computed(() => {
            const list = props.glossaryList.map((glossary) => ({
                value: glossary.guid,
                label: glossary.attributes.name,
            }))
            list.unshift({ label: 'All Glosaries', value: 'all' })
            return list
        })

        const refetchGlossaryList = inject('refetchGlossaryList')

        const { createTerm, createCategory, createGlossary } =
            useCreateGlossary()

        const router = useRouter()

        const parentGlossaryQualifiedName = computed(() =>
            home.value
                ? ''
                : props?.parentGlossary?.attributes?.qualifiedName ?? ''
        )

        const {
            entities: searchResults,
            terms: searchTerms,
            categories: searchCategories,
            glossaries: searchGlossaries,
            isLoading: searchLoading,
            fetchAssetsPaginated: searchAssetsPaginated,
        } = useGtcSearch(parentGlossaryQualifiedName, searchQuery)

        // methods
        const redirectToProfile = (type: string, guid: string) => {
            if (type === 'glossary') router.push(`/glossary/${guid}`)
            else router.push(`/glossary/${type}/${guid}`)
        }
        const backToHome = () => router.push('/glossary')

        const createNewTerm = () => {
            createTerm(props.parentGlossary?.guid ?? '')
        }
        const createNewCategory = () => {
            createCategory(props.parentGlossary?.guid ?? '')
        }

        const onSearch = useDebounceFn(() => {
            if (searchQuery.value?.length) {
                searchAssetsPaginated({
                    query: `${searchQuery.value ? `${searchQuery.value}` : ''}`,
                    offset: 0,
                })
            }
        }, 300)

        // to get correct icon from type and status
        const getEntityStatusIcon = (
            type: String,
            assetStatus: String
        ): String => {
            if (
                assetStatus === undefined ||
                assetStatus === '' ||
                assetStatus === 'is_null'
            )
                return `${type?.charAt(0).toUpperCase()}${type?.slice(1)}`

            return `${type?.charAt(0).toUpperCase()}${type?.slice(
                1
            )}${assetStatus?.charAt(0).toUpperCase()}${assetStatus?.slice(1)}`
        }

        watch(home, () => {
            searchQuery.value = ''
        })
        watch(currentGlossaryGuid, (newGuid) => {
            if (newGuid === 'all') router.push(`/glossary`)
            else redirectToProfile('glossary', newGuid)
        })

        watch(parentGlossary, (newParentGlossary) => {
            currentGlossaryGuid.value = newParentGlossary.guid
        })

        return {
            redirectToProfile,
            backToHome,
            createNewCategory,
            createNewTerm,
            createTerm,
            createGlossary,
            createCategory,
            StatusList,
            getEntityStatusIcon,
            glossaryContextDropdown,
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
            currentGlossaryGuid,
            refetchGlossaryList
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
        :global(.ant-tree-switcher) {
            @apply pt-1;
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
        :global(.ant-tree-switcher) {
            @apply p-0 h-2 w-2 !important;
            margin-right: 6px;
            // margin-top: -2px;
        }
    }
}
</style>
