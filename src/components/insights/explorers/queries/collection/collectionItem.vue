<template>
    <div
        :key="item.guid"
        :class="[
            'flex items-center justify-between px-4 cursor-pointer  group relative overflow-x-hidden w-full',
            selectedCollection?.guid === item?.guid
                ? 'bg-primary-light'
                : 'hover:bg-new-gray-100',
        ]"
        style="height: 34px"
        @click="handleChange(item.guid)"
    >
        <div class="flex items-center overflow-hidden">
            <div class="w-5 h-5 mr-2 -mt-1">
                <span v-if="item?.attributes?.icon" class="text-lg">{{
                    item?.attributes?.icon ? item?.attributes?.icon : '🗃'
                }}</span>
                <AtlanIcon
                    v-else
                    icon="CollectionIconSmall"
                    class="w-5 h-4 my-auto mr-2"
                ></AtlanIcon>
            </div>

            <div class="truncate" style="max-width: 210px">
                <span
                    :class="[
                        'mr-1 text-sm text-gray-700',
                        selectedCollection?.guid === item?.guid
                            ? 'font-bold'
                            : '',
                    ]"
                    >{{ item.attributes.name }}</span
                >
            </div>
            <div>
                <AtlanIcon
                    v-if="!isCollectionPrivate(item, username)"
                    icon="PublicCollection"
                    class="self-center w-4 h-4 -mt-1"
                ></AtlanIcon>
            </div>
        </div>
        <AtlanIcon
            v-if="selectedCollection?.guid === item?.guid"
            icon="Check"
            class="ml-1 text-primary group-hover:opacity-0"
        />
        <div
            class="absolute flex pl-5 opacity-0 group-hover:opacity-100 right-3 y-center"
        >
            <div
                class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-200"
                @click.stop="openInSidebar(item, false)"
            >
                <AtlanIcon
                    icon="SidebarSwitch"
                    class="w-4 h-4 my-auto outline-none"
                ></AtlanIcon>
            </div>
            <InsightsThreeDotMenu
                v-if="username === item?.createdBy"
                @click.stop="() => {}"
                :options="dropdownOptions"
                class="pl-1"
            >
                <template #menuTrigger>
                    <div class="">
                        <div
                            class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-200"
                        >
                            <AtlanIcon
                                icon="KebabMenuHorizontal"
                                class="w-4 h-4 my-auto text-new-gray-600"
                            ></AtlanIcon>
                        </div>
                    </div>
                </template>
            </InsightsThreeDotMenu>
        </div>
        <!-- <ShareCollectionModal
            v-model:showShareModal="showShareQueryModal"
            :item="item"
        /> -->
        <CreateCollectionModal
            v-if="showCollectionModal"
            v-model:showCollectionModal="showCollectionModal"
            :is-create="false"
            :item="item"
        />
        <CreateCollectionModal
            v-if="showShareQueryModal"
            v-model:showCollectionModal="showShareQueryModal"
            :is-create="false"
            :is-share="true"
            :item="item"
        />

        <!-- <a-popover :visible="showDeletePopover" placement="rightTop"> -->
        <!-- <template #content> -->
        <TreeDeletePopover
            :item="item"
            :is-saving="isDeleteLoading"
            :show-delete-popover="showDeletePopover"
            @cancel="showDeletePopover = false"
            @delete="() => delteItem()"
        />
        <!-- </template> -->
        <!-- </a-popover> -->
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        ComputedRef,
        Ref,
        inject,
        toRaw,
        watch,
        ref,
        defineAsyncComponent,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { useVModels } from '@vueuse/core'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import whoami from '~/composables/user/whoami'
    import { isCollectionPrivate } from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import TreeDeletePopover from '~/components/insights/common/treeDeletePopover.vue'
    import { Insights } from '~/services/meta/insights/index'
    import { MenuItem } from 'ant-design-vue'
    import InsightsThreeDotMenu from '~/components/insights/common/dropdown/index.vue'

    export default defineComponent({
        components: {
            InsightsThreeDotMenu,
            AtlanIcon,
            TreeDeletePopover,
            ShareCollectionModal: defineAsyncComponent(
                () =>
                    import(
                        '~/components/insights/explorers/queries/collection/shareCollectionModal.vue'
                    )
            ),
            CreateCollectionModal: defineAsyncComponent(
                () =>
                    import(
                        '~/components/insights/explorers/queries/collection/createCollectionModal.vue'
                    )
            ),
        },
        props: {
            item: {
                type: Object,
                required: true,
            },

            handleChange: {
                type: Function,
                required: true,
            },
            collectionModalVisible: {
                type: Boolean,
                required: true,
            },
            selectedCollection: {
                type: Object,
                required: false,
            },
            openInSidebar: {
                type: Function,
                required: false,
                default: () => {},
            },
        },
        setup(props, { emit }) {
            const { item, handleChange } = toRefs(props)
            const { collectionModalVisible } = useVModels(props, emit)

            const showShareQueryModal = ref(false)
            const toggleShareQueryModal = () => {
                // console.log('collection item: ', item.value)
                collectionModalVisible.value = false
                showShareQueryModal.value = !showShareQueryModal.value
            }

            const showCollectionModal = ref(false)
            const toggleShowCollectionModal = () => {
                collectionModalVisible.value = false
                showCollectionModal.value = !showCollectionModal.value
            }

            const showDeletePopover = ref(false)

            const toggleDeleteCollectionModal = () => {
                collectionModalVisible.value = false
                showDeletePopover.value = true
            }

            const { username } = whoami()

            const isCollectionCreatedByCurrentUser = inject(
                'isCollectionCreatedByCurrentUser'
            )
            const hasCollectionReadPermission = inject(
                'hasCollectionReadPermission'
            )
            const hasCollectionWritePermission = inject(
                'hasCollectionWritePermission'
            )

            const refetchQueryCollection = inject(
                'refetchQueryCollection'
            ) as Ref<Function>

            const isDeleteLoading = ref(false)

            const delteItem = () => {
                const { data, error, isLoading } = Insights.DeleteEntity(
                    item.value.guid,
                    {}
                )
                isDeleteLoading.value = true

                watch([data, error, isLoading], ([newData, newError]) => {
                    isDeleteLoading.value = isLoading.value
                    if (newData && !newError) {
                        showDeletePopover.value = false

                        setTimeout(() => {
                            refetchQueryCollection.value()
                        }, 750)

                        message.success(
                            `${item.value?.attributes?.name} deleted!`
                        )
                    } else {
                        message.error(
                            `${item.value?.attributes?.name} deletion failed!`
                        )
                    }
                })
            }

            const dropdownOptions = [
                {
                    title: 'Invite',
                    key: 'Invite',
                    class: '',
                    disabled: false,
                    component: MenuItem,
                    handleClick: toggleShareQueryModal,
                },
                {
                    title: 'Edit collection',
                    key: 'Edit collection',
                    component: MenuItem,
                    class: 'border-b border-gray-300',
                    disabled: false,
                    handleClick: toggleShowCollectionModal,
                },
                {
                    title: 'Delete collection',
                    key: 'Delete collection',
                    component: MenuItem,
                    class: 'text-red-600',
                    disabled: false,
                    handleClick: toggleDeleteCollectionModal,
                },
            ]

            return {
                dropdownOptions,
                item,
                handleChange,
                showShareQueryModal,
                toggleShareQueryModal,
                showCollectionModal,
                toggleShowCollectionModal,
                username,
                isCollectionPrivate,

                isCollectionCreatedByCurrentUser,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
                showDeletePopover,
                isDeleteLoading,
                delteItem,
                toggleDeleteCollectionModal,
            }
        },
    })
</script>
<style lang="less" scoped>
    .y-center {
        transform: translateY(-50%);
        top: 48%;
    }
</style>
<style lang="less" module></style>
