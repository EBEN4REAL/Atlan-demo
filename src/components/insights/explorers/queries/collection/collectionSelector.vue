<template>
    <a-popover
        v-model:visible="isVisible"
        :get-popup-container="(target) => target.parentNode"
        placement="bottomLeft"
        trigger="['click']"
        overlayClassName="collectionSelectPopover"
        :overlay-class-name="$style.classificationPopover"
    >
        <template #content>
            <div
                class="flex flex-col pt-4 mt-0"
                style="width: 315px !important; height: 338px"
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
                    @click="emit('toggleCollectionModal')"
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
            <div class="flex items-center overflow-x-hidden">
                <span class="w-5 h-5 mr-2 -mt-1.5 text-xl">{{
                    selectedCollection?.attributes?.icon
                        ? selectedCollection?.attributes?.icon
                        : '🗃'
                }}</span>

                <div
                    class="truncate group-hover:text-primary"
                    style="width: 90%"
                >
                    <span
                        class="text-base font-bold text-gray-700 truncate mr-2.5"
                        >{{ selectedCollection?.attributes?.name }}</span
                    >
                    <AtlanIcon
                        v-if="isCollectionPrivate(selectedCollection, username)"
                        icon="PrivateCollection"
                        class="self-center w-4 h-4 -mt-1"
                    ></AtlanIcon>
                    <AtlanIcon
                        v-else
                        icon="PublicCollection"
                        class="self-center w-4 h-4 -mt-1"
                    ></AtlanIcon>

                    <AtlanIcon
                        icon="ChevronDown"
                        class="self-center h-4 ml-1 -mt-1 text-gray-400"
                    ></AtlanIcon>
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

    export default defineComponent({
        name: 'CollectionSelector',
        emits: ['update:data', 'toggleCollectionModal'],
        components: { AtlanIcon, SearchAndFilter, CollectionItem },
        setup(props, { emit }) {
            // store
            const authStore = useAuthStore()
            const inputRef = ref()
            // variables

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
                const collection = queryCollections.value?.find(
                    (coll) => coll.guid === selectedValue.value
                )
                return collection
            })

            const sharedCollections = computed(() =>
                queryCollections.value?.filter((coll) => {
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
            )
            const privateCollections = computed(() =>
                queryCollections.value?.filter((coll) => {
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
            )

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
                console.log(
                    'useQueryTree collection selected',
                    selectedValue.value
                )
                emit('update:data', data)
            }

            function selectDefaultValue() {
                selectedValue.value = activeInlineTab.value.explorer.queries
                    .collection
                    ? activeInlineTab.value.explorer.queries.collection.guid
                    : ''
                handleChange(selectedValue.value)
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
