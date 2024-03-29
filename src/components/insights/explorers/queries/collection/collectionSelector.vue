<template>
    <!-- :get-popup-container="(target) => target.parentNode" -->

    <a-popover
        v-model:visible="isVisible"
        placement="bottomLeft"
        trigger="['click']"
        :overlay-class-name="$style.classificationPopover"
    >
        <template #content>
            <div
                class="flex flex-col pt-4 mt-0"
                style="
                    width: 315px !important;
                    height: 350px;
                    /* z-index: 100 !important; */
                "
            >
                <div class="px-3">
                    <a-input
                        v-model:value="queryText"
                        class="h-8 rounded"
                        :class="$style.inputSearch"
                        :placeholder="`Search in ${
                            sharedCollections?.length +
                            privateCollections?.length
                        } Collections`"
                        :allow-clear="true"
                    >
                        <template #prefix>
                            <AtlanIcon icon="Search" color="#6F7590" />
                        </template>
                    </a-input>
                </div>
                <!-- FIXME: These should be using a same component -->
                <div class="pt-3">
                    <div
                        class="overflow-x-hidden overflow-y-auto"
                        style="height: 254px"
                    >
                        <div
                            v-for="collection in [
                                ...sharedCollections,
                                ...privateCollections,
                            ]"
                            v-if="
                                [...sharedCollections, ...privateCollections]
                                    ?.length !== 0
                            "
                            :key="collection.guid"
                        >
                            <CollectionItem
                                v-model:collectionModalVisible="isVisible"
                                :item="collection"
                                :handle-change="handleChange"
                                :selected-collection="selectedCollection"
                                :openInSidebar="openInSidebar"
                            />
                        </div>
                        <div
                            v-else
                            class="flex flex-col items-center justify-center w-full h-full"
                        >
                            <AtlanIcon
                                icon="EmptySearchQuery"
                                class="h-24 mr-8 -mt-4 no-svaved-query-icon text-primary"
                            />
                            <span class="mt-3 text-gray-500"
                                >No collection found</span
                            >
                        </div>
                    </div>
                </div>

                <div
                    v-auth="[map.CREATE_COLLECTION]"
                    class="flex flex-row-reverse items-center pr-4 mt-auto border-t border-gray-300 cursor-pointer h-9"
                    @click="createCollectionToggle"
                >
                    <AtlanIcon
                        icon="ArrowRight"
                        class="w-4 h-4 no-svaved-query-icon text-primary"
                    />
                    <span class="text-xs text-primary"
                        >Create new collection</span
                    >
                </div>
            </div>
        </template>
        <div class="flex items-center w-full cursor-pointer hover:text-primary">
            <div class="flex items-center w-full">
                <span
                    v-if="selectedCollection?.attributes?.icon"
                    class="mr-2 -mt-2 w-7 h-7"
                >
                    <span style="font-size: 28px">
                        {{
                            selectedCollection?.attributes?.icon
                                ? selectedCollection?.attributes?.icon
                                : '🗃'
                        }}</span
                    >
                </span>
                <AtlanIcon
                    v-else
                    icon="CollectionIconSmall"
                    class="w-4 h-6 my-auto mr-2 parent-ellipsis-container-extension"
                ></AtlanIcon>

                <div class="flex w-full bg">
                    <div class="flex flex-col w-full">
                        <div class="flex items-center w-11/12">
                            <div class="flex w-full">
                                <Tooltip
                                    :tooltip-text="`${selectedCollection?.attributes?.name}`"
                                    classes="cursor-pointer text-base font-bold mr-1
                                text-gray-700 hover:underline"
                                    @click.stop="
                                        () =>
                                            openInSidebar(
                                                selectedCollection,
                                                true
                                            )
                                    "
                                >
                                </Tooltip>
                                <div class="flex-shrink-0 w-5">
                                    <div
                                        class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                    >
                                        <AtlanIcon
                                            icon="ChevronDown"
                                            class="w-4 h-4 text-gray-500"
                                        ></AtlanIcon>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <span class="mr-1 text-xs text-gray-500 truncate">{{
                            isCollectionPrivate(selectedCollection, username)
                                ? 'Private'
                                : hasCollectionWritePermission ||
                                  isCollectionCreatedByCurrentUser
                                ? 'Shared'
                                : 'Shared, Read only'
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </a-popover>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        ComputedRef,
        inject,
        onMounted,
        watch,
        Ref,
        toRefs,
    } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import { QueryCollection } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { isCollectionPrivate } from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { useAuthStore } from '~/store/auth'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import CollectionItem from './collectionItem.vue'
    import map from '~/constant/accessControl/map'
    import Tooltip from '@/common/ellipsis/index.vue'

    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'CollectionSelector',
        components: { AtlanIcon, SearchAndFilter, CollectionItem, Tooltip },
        props: {
            isCollectionPopoverVisible: {
                type: Boolean,
                default: () => false,
            },
        },
        emits: [
            'update:data',
            'update:isCollectionPopoverVisible',
            'toggleCollectionModal',
        ],
        setup(props, { emit }) {
            const { isCollectionPopoverVisible } = toRefs(props)
            // store
            const authStore = useAuthStore()
            const inputRef = ref()

            const isVisible = ref(false)
            const queryText = ref('')
            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >
            const queryCollectionsLoading: ComputedRef<boolean> = inject(
                'queryCollectionsLoading'
            )
            const { username } = authStore

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const selectedValue = ref(
                activeInlineTab.value.explorer.queries.collection.guid
            )

            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >

            const { isSameNodeOpenedInSidebar } = useSchema()
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

            watch(
                () =>
                    activeInlineTab.value?.explorer?.queries?.collection?.guid,
                () => {
                    selectedValue.value =
                        activeInlineTab.value?.explorer?.queries?.collection?.guid
                }
            )

            // computed
            const selectedCollection = computed(() => {
                let collection = queryCollections.value?.find(
                    (coll) => coll.guid === selectedValue.value
                )
                if (!collection) {
                    collection = queryCollections.value?.length
                        ? queryCollections.value[0]
                        : undefined
                }
                return collection
            })

            const sharedCollections = computed(() =>
                queryCollections.value
                    ?.filter((coll) => {
                        if (queryText) {
                            return (
                                !isCollectionPrivate(coll, username) &&
                                coll?.displayText
                                    ?.toLowerCase()
                                    .includes(queryText.value?.toLowerCase())
                            )
                        }
                        return !isCollectionPrivate(coll, username)
                    })
                    .sort((a, b) => {
                        if (
                            a.displayText?.toLocaleLowerCase() <
                            b.displayText?.toLocaleLowerCase()
                        ) {
                            return -1
                        }
                        if (
                            a.displayText?.toLocaleLowerCase() >
                            b.displayText?.toLocaleLowerCase()
                        ) {
                            return 1
                        }
                        return 0
                    })
            )
            const privateCollections = computed(() =>
                queryCollections.value
                    ?.filter((coll) => {
                        if (queryText) {
                            return (
                                isCollectionPrivate(coll, username) &&
                                coll?.displayText
                                    ?.toLowerCase()
                                    .includes(queryText.value?.toLowerCase())
                            )
                        }

                        return isCollectionPrivate(coll, username)
                    })
                    .sort((a, b) => {
                        if (
                            a.displayText?.toLocaleLowerCase() <
                            b.displayText?.toLocaleLowerCase()
                        ) {
                            return -1
                        }
                        if (
                            a.displayText?.toLocaleLowerCase() >
                            b.displayText?.toLocaleLowerCase()
                        ) {
                            return 1
                        }
                        return 0
                    })
            )

            const hasCollectionReadPermission = inject(
                'hasCollectionReadPermission'
            )
            const hasCollectionWritePermission = inject(
                'hasCollectionWritePermission'
            )
            const isCollectionCreatedByCurrentUser = inject(
                'isCollectionCreatedByCurrentUser'
            ) as ComputedRef
            const collectionSelectorChange = inject(
                'collectionSelectorChange'
            ) as Ref<boolean>

            function handleChange(collectionId: string) {
                isVisible.value = false
                selectedValue.value = collectionId
                const collection = queryCollections.value?.find(
                    (coll) => coll.guid === collectionId
                )
                const data = {
                    qname: collection?.attributes.qualifiedName,
                    guid: collectionId,
                }
                emit('update:data', data)
                collectionSelectorChange.value = !collectionSelectorChange.value
            }

            function selectDefaultValue() {
                selectedValue.value = activeInlineTab.value.explorer.queries
                    .collection
                    ? activeInlineTab.value.explorer.queries.collection.guid
                    : ''
                handleChange(selectedValue.value)
            }

            const createCollectionToggle = () => {
                isVisible.value = false
                emit('toggleCollectionModal')
            }

            const openInSidebar = (
                t: assetInterface,
                closeCollectionSelector: Boolean
            ) => {
                // Close dropdown when collection sidebar is opened by clicking on the collection name
                if (closeCollectionSelector) isVisible.value = false

                // i button clicked on the same node -> close the sidebar
                if (isSameNodeOpenedInSidebar(t, activeInlineTab)) {
                    /* Close it if it is already opened */
                    closeAssetSidebar(activeInlineTab.value)
                } else {
                    const activeInlineTabCopy: activeInlineTabInterface = {
                        ...activeInlineTab.value,
                    }

                    // console.log('query entity1: ', t)
                    activeInlineTabCopy.assetSidebar.assetInfo = t
                    activeInlineTabCopy.assetSidebar.isVisible = true
                    openAssetSidebar(activeInlineTabCopy, 'not_editor')
                }
            }

            watch(queryCollectionsLoading, (newLoading) => {
                if (!newLoading) {
                    selectDefaultValue()
                }
            })
            watch(isVisible, () => {
                setTimeout(() => {
                    if (!isVisible.value) queryText.value = ''
                }, 0)
                emit('update:isCollectionPopoverVisible', isVisible.value)
            })

            onMounted(async () => {
                if (!queryCollectionsLoading.value) {
                    selectDefaultValue()
                }
            })

            return {
                queryText,
                handleChange,
                queryCollections,
                selectedValue,
                selectedCollection,
                isVisible,
                isCollectionPrivate,
                username,
                sharedCollections,
                privateCollections,
                emit,
                map,
                createCollectionToggle,
                hasCollectionWritePermission,
                hasCollectionReadPermission,
                isCollectionCreatedByCurrentUser,
                isCollectionPopoverVisible,
                ellipsis: ref(true),
                openInSidebar,
            }
        },
    })
</script>

<style lang="less">
    .collectionSelectPopover {
        width: 250px;
        padding-top: 0 !important;
    }
</style>
<style lang="css" module>
    .inputSearch {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
        background-color: #fff !important;
        border: 1px solid #e9ebf1 !important;
        color: #6f7590 !important;
        border-radius: 8px !important;
    }

    .classificationPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-0 !important;
            width: 315px !important;
        }
    }
    :global(.ant-input) {
        color: #6f7590 !important;
    }
    input::placeholder {
        color: #6f7590 !important;
    }
</style>
