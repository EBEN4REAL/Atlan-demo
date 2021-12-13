<template>
    <a-modal
        :visible="showShareModal"
        :closable="false"
        :footer="null"
        width="584px"
        bodyStyle="{
            height: 450px
        }"
        :destroyOnClose="true"
    >
        <template #title>
            <div
                class="flex items-center justify-between text-gray-500 flex-nowrap"
            >
                <span class="flex-none font-bold text text-gray"
                    >Invite to
                    <span
                        class="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg"
                        >{{ item?.attributes?.name }}</span
                    ></span
                >
            </div>
        </template>
        <div class="w-full px-4 pb-5 text-gray-500 bg-white rounded">
            <div class="px-4 py-2 bg-gray-100 rounded-lg">
                <div class="flex flex-col">
                    <div>
                        <span class="font-bold">Viewers</span>
                        <UserSelectWidget
                            :read-only="false"
                            :model-value="viewers"
                            placementPos="bottomLeft"
                        />
                    </div>
                    <div class="mt-3">
                        <span class="font-bold">Editors</span>
                        <UserSelectWidget
                            class="mt-1"
                            :read-only="false"
                            :model-value="editors"
                            placementPos="bottomLeft"
                        />
                    </div>
                </div>
            </div>
            <div class="flex items-center w-full mt-5">
                <div
                    class="flex items-center justify-end flex-1 mb-1 text-gray-700 cursor-pointer"
                >
                    <AtlanBtn
                        size="sm"
                        color="secondary"
                        padding="compact"
                        class="flex items-center justify-between h-6 py-1 ml-3 border-none hover:text-primary"
                        @click="closeModal"
                    >
                        <span>Cancel</span>
                    </AtlanBtn>

                    <AtlanBtn
                        size="sm"
                        color="primary"
                        padding="compact"
                        class="flex items-center justify-between h-6 py-1 ml-2 border-none"
                        @click="shareCollection"
                    >
                        <div class="flex items-center text-white rounded">
                            <AtlanIcon
                                v-if="isCollectionUpdating"
                                icon="CircleLoader"
                                style="margin-right: 4px"
                                class="w-4 h-4 text-white animate-spin"
                            ></AtlanIcon>

                            <span>Share</span>
                        </div>
                    </AtlanBtn>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        ref,
        PropType,
        watch,
        toRefs,
        inject,
    } from 'vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import UserSelectWidget from '~/components/common/input/owner/index.vue'
    import 'emoji-mart-vue-fast/css/emoji-mart.css'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import useQueryCollection from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'CreateCollectionModal',
        components: { AtlanBtn, UserSelectWidget, AtlanIcon },
        props: {
            showShareModal: {
                type: Boolean as PropType<boolean>,
                required: true,
            },
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['update:showShareModal'],
        setup(props, { emit }) {
            const { item } = toRefs(props)

            const refetchQueryCollection = inject(
                'refetchQueryCollection'
            ) as Ref<Function>

            const editors = ref({
                ownerGroups: item.value.attributes.ownerGroups,
                ownerUsers: item.value.attributes.ownerUsers,
            })
            const viewers = ref({
                ownerGroups: item.value.attributes.viewerGroups,
                ownerUsers: item.value.attributes.viewerUsers,
            })
            const closeModal = () => {
                emit('update:showShareModal', false)
            }

            const { updateCollection } = useQueryCollection()

            let isCollectionUpdating = ref(false)

            const shareCollection = () => {
                console.log('item: ', item.value)
                const entity = {
                    typeName: 'QueryCollection',
                    attributes: {
                        ...item?.value?.attributes,
                        ownerUsers: editors.value.ownerUsers,
                        ownerGroups: editors.value.ownerGroups,
                        viewerUsers: viewers.value.ownerUsers,
                        viewerGroups: viewers.value.ownerGroups,
                    },
                }
                const { data, error, isLoading } = updateCollection(entity)
                watch(
                    [isLoading, error],
                    () => {
                        console.log('collection error: ', error.value)
                        isCollectionUpdating.value = isLoading?.value
                        if (
                            isLoading?.value === false &&
                            error.value === undefined
                        ) {
                            closeModal()
                            refetchQueryCollection.value()
                        }
                    },
                    {
                        immediate: true,
                    }
                )
            }

            return {
                closeModal,
                editors,
                viewers,
                shareCollection,
                isCollectionUpdating,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .absolute-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .button {
        --tw-bg-opacity: 1;
        background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
        border-width: 1 px;
        --tw-border-opacity: 1;
        border-color: rgba(230, 230, 235, var(--tw-border-opacity));
        padding: 4 px 8 px !important;
        min-width: 71 px !important;
        height: 22 px !important;
        box-sizing: border-box !important;
        border-radius: 4 px !important;
    }

    .input {
    }
</style>

<style lang="less">
    .emoji-mart {
        border: unset;

        .emoji-mart-anchor-selected {
            color: rgb(82, 119, 215) !important;
        }
        .emoji-mart-anchor:hover {
            color: rgb(51, 81, 155) !important;
        }
        .emoji-mart-anchor-bar {
            background-color: rgb(82, 119, 215) !important;
        }
    }
    .emoji-mart-category .emoji-mart-emoji span {
        cursor: pointer;
    }
    .emoji-wrapper {
        bottom: -331%;
    }
</style>

<style lang="less" module>
    // .input {
    //     :global(.ant-input:focus
    //             .ant-input:hover
    //             .ant-input::selection
    //             .focus-visible) {
    //         @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
    //     }
    //     :global(.ant-input) {
    //         @apply shadow-none outline-none border-0 px-0 !important;
    //     }
    // }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
