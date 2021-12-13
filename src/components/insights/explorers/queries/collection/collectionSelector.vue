<template>
    <a-popover
        v-model:visible="isVisible"
        :get-popup-container="(target) => target.parentNode"
        placement="bottomLeft"
        trigger="['click']"
        overlayClassName="collectionSelectPopover"
    >
        <template #content>
            <div class="flex flex-col w-full">
                <div class="px-2 py-2">
                    <div
                        v-for="(collectionArr, index) in [
                            sharedCollections,
                            privateCollections,
                        ]"
                        :key="index"
                        :class="{ 'mb-3': index === 0 }"
                    >
                        <span
                            v-if="collectionArr?.length"
                            class="text-xs font-bold text-gray-500"
                            >{{ index === 0 ? 'Shared' : 'Private' }}</span
                        >
                        <div
                            v-for="collection in collectionArr"
                            :key="collection.guid"
                        >
                            <CollectionItem
                                :item="collection"
                                :index="index"
                                :handle-change="handleChange"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div class="flex items-center cursor-pointer hover:text-primary">
            <AtlanIcon icon="Group" class="self-center h-4 mr-1"></AtlanIcon>
            <p class="text-sm truncate">
                {{ selectedCollection?.attributes.name }}
            </p>
            <AtlanIcon
                icon="ChevronDown"
                class="self-center h-4 ml-1 text-gray-400"
            ></AtlanIcon>
        </div>
    </a-popover>
</template>

<script lang="ts">
    import {
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
    import { QueryCollection } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { isCollectionPrivate } from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { useAuthStore } from '~/store/auth'
    import CollectionItem from './collectionItem.vue'

    export default defineComponent({
        name: 'CollectionSelector',
        emits: ['update:data'],
        components: {
            AtlanIcon,
            CollectionItem,
            ShareCollectionModal: defineAsyncComponent(
                () =>
                    import(
                        '~/components/insights/explorers/queries/collection/shareCollectionModal.vue'
                    )
            ),
        },
        setup(props, { emit }) {
            // store
            const authStore = useAuthStore()
            // variables
            const selectedValue = ref()
            const isVisible = ref(false)
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
                queryCollections.value?.filter(
                    (coll) => !isCollectionPrivate(coll, username)
                )
            )
            const privateCollections = computed(() =>
                queryCollections.value?.filter((coll) =>
                    isCollectionPrivate(coll, username)
                )
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

            onMounted(() => {
                if (!queryCollectionsLoading.value) {
                    selectDefaultValue()
                }
                // changeDisplayText()
            })

            const shareCollectionModal = ref(null)

            const showShareCollectionModal = (item) => {
                shareCollectionModal.value = item?.guid
            }
            const closeShareCollectionModal = (item) => {
                shareCollectionModal.value = null
            }

            return {
                handleChange,
                queryCollections,
                selectedValue,
                selectedCollection,
                isVisible,
                isCollectionPrivate,
                username,
                sharedCollections,
                privateCollections,
                showShareCollectionModal,
                shareCollectionModal,
                closeShareCollectionModal,
            }
        },
    })
</script>
//
<style lang="less">
    //     .collectionSelectPopover {
    //         .ant-popover-inner-content {
    //             width: 250px !important;
    //         }
    //     }
    //
</style>
