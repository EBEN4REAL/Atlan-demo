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
                    height: 338px;
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
                        :allowClear="true"
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
                        style="height: 242px"
                    >
                        <div
                            v-if="
                                [...sharedCollections, ...privateCollections]
                                    ?.length !== 0
                            "
                            v-for="collection in [
                                ...sharedCollections,
                                ...privateCollections,
                            ]"
                            :key="collection.guid"
                        >
                            <CollectionItem
                                :item="collection"
                                :handle-change="handleChange"
                                v-model:collectionModalVisible="isVisible"
                                :selectedCollection="selectedCollection"
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
                    class="flex flex-row-reverse items-center pr-4 mt-auto border-t border-gray-300 cursor-pointer h-9"
                    @click="createCollectionToggle"
                    v-auth="[map.CREATE_COLLECTION]"
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
                <span class="mr-2 -mt-2 w-7 h-7" style="font-size: 28px">{{
                    selectedCollection?.attributes?.icon
                        ? selectedCollection?.attributes?.icon
                        : '🗃'
                }}</span>

                <div class="flex w-full bg">
                    <div class="flex flex-col w-full">
                        <div class="flex items-center w-11/12">
                            <div class="flex w-full">
                                <!-- <a-typography-text
                                    class="w-11/12 text-base font-bold text-gray-700"
                                    :style="ellipsis ? { width: '98%' } : {}"
                                    tooltip-color="#363636"
                                    :ellipsis="
                                        ellipsis
                                            ? {
                                                  tooltip: `${selectedCollection?.attributes?.name}`,
                                              }
                                            : false
                                    "
                                    :content="
                                        selectedCollection?.attributes?.name
                                    "
                                /> -->

                                <Tooltip
                                    :tooltip-text="`${selectedCollection?.attributes?.name}`"
                                    classes="cursor-pointer text-base font-bold mr-1
                                text-gray-700"
                                />
                                <div style="width: 8%">
                                    <AtlanIcon
                                        icon="ChevronDown"
                                        class="w-4 h-4 text-gray-500"
                                    ></AtlanIcon>
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
        nextTick,
        computed,
        defineComponent,
        defineAsyncComponent,
        ref,
        Ref,
        toRefs,
        PropType,
        ComputedRef,
        inject,
        onMounted,
        watch,
    } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import {
        SavedQuery,
        QueryCollection,
    } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { isCollectionPrivate } from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { useAuthStore } from '~/store/auth'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import CollectionItem from './collectionItem.vue'
    import map from '~/constant/accessControl/map'
    import Tooltip from '@/common/ellipsis/index.vue'

    export default defineComponent({
        name: 'CollectionSelector',
        emits: ['update:data', 'toggleCollectionModal'],
        components: { AtlanIcon, SearchAndFilter, CollectionItem, Tooltip },
        setup(props, { emit }) {
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
            const username = authStore.username

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const selectedValue = ref(
                activeInlineTab.value.explorer.queries.collection.guid
            )
            console.log(
                activeInlineTab.value.explorer.queries.collection.guid,
                queryCollections,
                'selectCollections'
            )
            watch(
                () => activeInlineTab.value.explorer.queries.collection.guid,
                () => {
                    selectedValue.value =
                        activeInlineTab.value.explorer.queries.collection.guid
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
                // console.log(
                //     'useQueryTree collection selected',
                //     selectedValue.value
                // )
                emit('update:data', data)
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

            watch(queryCollectionsLoading, (newLoading) => {
                if (!newLoading) {
                    selectDefaultValue()
                }
            })
            watch(isVisible, () => {
                setTimeout(() => {
                    if (!isVisible.value) queryText.value = ''
                }, 0)
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
                ellipsis: ref(true),
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
