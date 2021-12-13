<template>
    <a-popover
        v-model:visible="isVisible"
        :get-popup-container="(target) => target.parentNode"
        placement="bottomLeft"
        trigger="['click']"
        overlayClassName="collectionSelectPopover"
    >
        <template #content>
            <div class="flex flex-col w-full pt-1 pb-3">
                <div class="px-3">
                    <a-input
                        v-model:value="queryText"
                        class="h-8 mt-2 rounded"
                        :class="$style.inputSearch"
                        :placeholder="`Search in ${
                            sharedCollections?.length +
                            privateCollections?.length
                        } Collections`"
                        :allowClear="true"
                    >
                        <!-- <template #suffix>
                            <AtlanIcon icon="Search" color="#6F7590" />
                        </template> -->
                    </a-input>
                </div>
                <!-- FIXME: These should be using a same component -->
                <div class="px-3 pt-3">
                    <span class="text-xs font-bold text-gray-500">{{
                        `Shared (${sharedCollections?.length ?? 0})`
                    }}</span>

                    <div class="mb-3 overflow-x-hidden overflow-y-auto h-44">
                        <div
                            v-if="sharedCollections?.length !== 0"
                            v-for="collection in sharedCollections"
                            :key="collection.guid"
                            class="flex items-center p-1 cursor-pointer hover:bg-primary-light"
                            @click="handleChange(collection.guid)"
                        >
                            <AtlanIcon
                                icon="Group"
                                class="self-center w-4 h-4 pr-1"
                            ></AtlanIcon>

                            <div
                                class="overflow-ellipsis group-hover:text-primary"
                            >
                                {{ collection.attributes.name }}
                            </div>
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
                                >No shared collection found</span
                            >
                        </div>
                    </div>

                    <span class="text-xs font-bold text-gray-500">{{
                        `Private (${privateCollections?.length ?? 0})`
                    }}</span>

                    <div class="overflow-x-hidden overflow-y-auto h-44">
                        <div
                            v-if="privateCollections?.length !== 0"
                            v-for="collection in privateCollections"
                            :key="collection.guid"
                            class="flex items-center p-1 cursor-pointer hover:bg-primary-light"
                            @click="handleChange(collection.guid)"
                        >
                            <AtlanIcon
                                icon="User"
                                class="self-center w-4 h-4 pr-1"
                            ></AtlanIcon>
                            <div
                                class="overflow-ellipsis group-hover:text-primary"
                            >
                                {{ collection.attributes.name }}
                            </div>
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
                                >No prive collection found</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="flex items-center w-full cursor-pointer hover:text-primary">
            <AtlanIcon icon="Group" class="self-center h-4 mr-1"></AtlanIcon>
            <p class="text-sm truncate">
                {{ selectedCollection?.attributes?.name }}
            </p>
            <AtlanIcon
                icon="ChevronDown"
                class="self-center h-4 ml-1 text-gray-400"
            ></AtlanIcon>
        </div>
    </a-popover>
    <!-- <a-select
        style="width: 200px"
        @change="handleChange"
        v-model:value="selectedValue"
    >
        <a-select-option
            v-for="collection in queryCollections"
            :key="collection?.guid"
            :value="collection?.guid"
        >
            {{ collection.attributes.name }}
        </a-select-option>
    </a-select> -->
</template>

<script lang="ts">
    import {
        nextTick,
        computed,
        defineComponent,
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
    import { useTimeoutFn } from '@vueuse/core'
    import {
        SavedQuery,
        QueryCollection,
    } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { isCollectionPrivate } from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { useAuthStore } from '~/store/auth'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    export default defineComponent({
        name: 'CollectionSelector',
        emits: ['update:data'],
        components: { AtlanIcon, SearchAndFilter },
        setup(props, { emit }) {
            // store
            const authStore = useAuthStore()
            const inputRef = ref()
            // variables
            const selectedValue = ref()
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
    :global(.ant-input) {
        color: #6f7590 !important;
    }
    input::placeholder {
        color: #6f7590 !important;
    }
</style>
