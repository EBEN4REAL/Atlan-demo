<template>
    <div v-if="isHome" class="px-2 py-4">
        <div class="px-2 pb-2">
            <a-button
                class="flex items-center justify-center w-full mb-2 group"
            >
                <AtlanIcon
                    class="text-gray-600  group-hover:text-primary group-focus:text-primary"
                    icon="Add"
                />
                <div class="ml-2">Create New Glossary</div></a-button
            >
            <a-input-search
                placeholder="Search accross Glossaries"
            ></a-input-search>
        </div>
        <div
            v-for="glossary in glossaryList"
            :key="glossary.guid"
            @click="() => redirectToProfile('glossary', glossary.guid)"
        >
            <div
                class="flex flex-col justify-center px-3 mr-2 text-sm leading-5 text-gray-700 cursor-pointer  h-9 group hover:bg-primary-light hover:text-primary"
            >
                <div class="flex flex-row justify-between">
                    {{ glossary.displayText }}
                    <!-- <Fa
                        class="w-auto h-3 text-white group-hover:text-primary"
                        icon="fal external-link-alt"
                    /> -->
                    <atlan-icon
                        class="w-auto h-5 text-white group-hover:text-primary"
                        icon="ArrowRight"
                    />
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div
            class="flex py-2 pl-4 mb-4 text-sm leading-5 text-gray-500 bg-gray-100 cursor-pointer "
            type="link"
            @click="backToHome"
        >
            <fa icon="fas chevron-left" class="mr-2" />
            <span>Back to Glossary Home</span>
        </div>
        <div class="px-4 pb-4">
            <a-input-search
                :placeholder="
                    currentGuid &&
                    currentGuid === parentGlossary?.guid &&
                    parentGlossary?.displayText
                        ? `Search in ${parentGlossary?.displayText}`
                        : 'Search'
                "
            ></a-input-search>
        </div>
        <div v-if="!isLoading" class="h-screen overflow-auto">
            <div class="flex justify-between px-4">
                <div class="flex items-center ml-3">
                    <AtlanIcon icon="Glossary" class="h-5 m-0 mr-2" />
                    <div
                        class="flex justify-start w-full text-base leading-5 cursor-pointer "
                        @click="
                            redirectToProfile('glossary', parentGlossary.guid)
                        "
                    >
                        <span
                            class="flex my-auto"
                            :class="{
                                'text-primary':
                                    currentGuid === parentGlossary?.guid,
                            }"
                        >
                            {{
                                parentGlossary?.displayText ??
                                parentGlossary?.uniqueAttributes?.qualifiedName
                            }}
                        </span>
                    </div>
                </div>

                <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click.prevent>
                        <a-button
                            class="flex flex-col justify-center p-2 border-none  bg-primary-light text-primary"
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
                </a-dropdown>
            </div>
            <div
                v-if="treeData.length"
                class="py-2 pl-6 pr-2"
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
                >
                    <template
                        #title="{ title, type, key, assetStatus, glossaryID }"
                    >
                        <a-dropdown :trigger="['contextmenu']">
                            <div
                                class="min-w-full"
                                @click="() => redirectToProfile(type, key)"
                            >
                                <div class="flex justify-between mr-2 group">
                                    <div class="flex m-0">
                                        <span
                                            v-if="type === 'glossary'"
                                            class="p-0 my-auto mr-2"
                                        >
                                            <img
                                                :src="GlossarySvg"
                                                :width="15"
                                            />
                                        </span>
                                        <span
                                            v-else-if="type === 'term'"
                                            class="p-0 my-auto mr-2"
                                        >
                                            <AtlanIcon
                                                v-if="
                                                    assetStatus === 'deprecated'
                                                "
                                                icon="TermDeprecated"
                                            />
                                            <AtlanIcon
                                                v-else-if="
                                                    assetStatus === 'issue'
                                                "
                                                icon="TermIssue"
                                            />
                                            <AtlanIcon
                                                v-else-if="
                                                    assetStatus === 'draft'
                                                "
                                                icon="TermWip"
                                            />
                                            <AtlanIcon
                                                v-else-if="
                                                    assetStatus === 'verified'
                                                "
                                                icon="TermVerified"
                                            />
                                            <AtlanIcon v-else icon="Term" />
                                        </span>
                                        <span
                                            v-else-if="type === 'category'"
                                            class="p-0 my-auto mr-2"
                                        >
                                            <AtlanIcon
                                                v-if="
                                                    assetStatus === 'deprecated'
                                                "
                                                icon="CategoryDeprecated"
                                            />
                                            <AtlanIcon
                                                v-else-if="
                                                    assetStatus === 'issue'
                                                "
                                                icon="CategoryIssue"
                                            />
                                            <AtlanIcon
                                                v-else-if="
                                                    assetStatus === 'draft'
                                                "
                                                icon="CategoryWip"
                                            />
                                            <AtlanIcon
                                                v-else-if="
                                                    assetStatus === 'verified'
                                                "
                                                icon="CategoryVerified"
                                            />
                                            <AtlanIcon v-else icon="Category" />
                                        </span>
                                        <span
                                            class="my-auto text-sm leading-5 text-gray-700 "
                                            >{{ title }}</span
                                        >
                                    </div>

                                    <a-dropdown
                                        v-if="type === 'category'"
                                        :trigger="['hover']"
                                    >
                                        <span
                                            class="flex content-center justify-center w-5 h-5 p-0 m-0 rounded opacity-0  group-hover:opacity-100"
                                            @click.prevent
                                        >
                                            <AtlanIcon
                                                icon="KebabMenu"
                                                class="h-3 mt-1"
                                            />
                                            <!-- <fa
                                                icon="fal ellipsis-v"
                                                class="w-3 h-3"
                                            /> -->
                                        </span>
                                        <template #overlay>
                                            <a-menu>
                                                <div
                                                    class="px-2 py-1"
                                                    :class="
                                                        $style.createDropdownStyles
                                                    "
                                                >
                                                    <a-menu-item
                                                        key="0"
                                                        @click="
                                                            () =>
                                                                createTerm(
                                                                    glossaryID,
                                                                    key
                                                                )
                                                        "
                                                    >
                                                        New Term
                                                    </a-menu-item>
                                                    <a-menu-item
                                                        key="1"
                                                        @click="
                                                            () =>
                                                                createCategory(
                                                                    glossaryID,
                                                                    key
                                                                )
                                                        "
                                                    >
                                                        New Category
                                                    </a-menu-item>
                                                </div>
                                            </a-menu>
                                        </template>
                                    </a-dropdown>
                                </div>
                            </div>
                        </a-dropdown>
                    </template>
                </a-tree>
            </div>
            <div
                v-else
                class="flex flex-col justify-center text-base leading-6 text-center text-gray-500  mt-14"
            >
                <AtlanIcon icon="EmptyGlossary" class="h-40" />
                <p class="m-0 mt-20">The Glossary is empty,</p>
                <p class="m-0">Create a few terms!</p>
            </div>
        </div>
        <div v-else class="mt-4">
            <LoadingView />
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import { defineComponent, computed, PropType, watch, inject } from 'vue'
    import { useRouter } from 'vue-router'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

    // components
    import LoadingView from '@common/loaders/section.vue'
    import ThreeDotMenu from '@/glossary/common/threeDotMenu.vue'

    // import { Glossary } from '~/api/atlas/glossary'
    import { Glossary } from '~/types/glossary/glossary.interface'

    // composables
    import handleTreeExpand from '~/composables/tree/handleTreeExpand'
    import useCreateGlossary from '~/composables/glossary/useCreateGlossary'
    import useDeleteGlossary from '~/composables/glossary/useDeleteGlossary'

    // constant
    import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'
    import CategorySvg from '~/assets/images/gtc/category/category.png'
    import TermSvg from '~/assets/images/gtc/term/term.png'
    import { List as StatusList } from '~/constant/status'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    // import { Glossary } from '~/api/atlas/glossary'

    export default defineComponent({
        components: { LoadingView, ThreeDotMenu, AtlanIcon },
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
            // const { selectedKeys, expandedKeys, expandNode, selectNode } =
            //     handleTreeExpand(emit)
            const { createTerm, createCategory } = useCreateGlossary()

            const router = useRouter()

            // computed

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

            return {
                redirectToProfile,
                backToHome,
                createNewCategory,
                createNewTerm,
                createTerm,
                createCategory,
                GlossarySvg,
                CategorySvg,
                TermSvg,
                StatusList,
                // selectedKeys,
                // expandedKeys,
                // expandNode,
                // selectNode,
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
    .treeStyles {
        :global(.ant-tree-switcher) {
            @apply pt-1;
        }
    }
</style>
