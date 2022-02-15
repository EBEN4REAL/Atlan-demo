<template>
    <a-modal
        :visible="modalVisible"
        :closable="false"
        width="576px"
        :destroyOnClose="true"
        :class="[$style.input, $style.titleInput]"
    >
        <template #title>
            <div class="flex items-center justify-between w-full">
                <div
                    class="flex items-center mr-1 text-lg font-bold cursor-pointer"
                >
                    Rename Query
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-between pb-1">
                <div class="flex items-center justify-end w-full space-x-3">
                    <AtlanBtn
                        size="sm"
                        color="secondary"
                        padding="compact"
                        class="flex items-center justify-between h-6 py-1 ml-3 border-none cursor-pointer hover:text-primary"
                        @click="closeModal"
                    >
                        <span>Cancel</span>
                    </AtlanBtn>

                    <AtlanBtn
                        size="sm"
                        color="primary"
                        padding="compact"
                        class="flex items-center justify-between h-6 py-1 ml-2 border-none cursor-pointer"
                        @click="renameQuery"
                    >
                        <div class="flex items-center text-white rounded">
                            <AtlanIcon
                                v-if="renameLoading"
                                icon="CircleLoader"
                                style="margin-right: 4px"
                                class="w-4 h-4 text-white animate-spin"
                            ></AtlanIcon>

                            <span>Save</span>
                        </div>
                    </AtlanBtn>
                </div>
            </div>
        </template>

        <div class="px-4 pt-0 pb-3 -mt-2">
            <a-input
                ref="nameRef"
                v-model:value="name"
                placeholder="Name"
                class="mt-1 text-lg font-bold border-0 shadow-none outline-none"
            />
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        ref,
        inject,
        onMounted,
        nextTick,
        toRefs,
        watch,
        ComputedRef,
        toRaw,
    } from 'vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import { message } from 'ant-design-vue'
    import { Insights } from '~/services/meta/insights/index'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'

    export default defineComponent({
        name: 'EditQuery',
        components: {
            AtlanBtn,
        },
        props: {
            queryData: {
                type: Object,
                required: true,
            },
            modalVisible: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        emits: ['closeRenameModal'],
        setup(props, { emit }) {
            const { queryData, modalVisible } = toRefs(props)

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const name: Ref<string> = ref(
                queryData?.value?.attributes?.name ??
                    activeInlineTab.value?.label
            )

            const refreshQueryTree = inject<
                (guid: string, type: 'query' | 'Folder') => void
            >('refreshQueryTree', () => {})

            const closeModal = () => {
                emit('closeRenameModal')
            }

            const clearData = () => {
                name.value = ''
            }

            const nameRef = ref()

            onMounted(async () => {
                await nextTick()
                nameRef.value?.focus()
            })

            const renameLoading = ref(false)

            const { modifyActiveInlineTab } = useInlineTab()

            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>

            const renameQuery = () => {
                renameLoading.value = true
                queryData.value.attributes.name = name.value
                const { data, error, isLoading } = Insights.CreateQueryFolder(
                    {
                        entity: {
                            attributes: queryData.value.attributes,
                            typeName: 'Query',
                        },
                    },
                    {}
                )

                watch(isLoading, () => {
                    renameLoading.value = isLoading.value
                })
                watch(
                    error,
                    () => {
                        if (isLoading.value === false) {
                            if (error.value === undefined) {
                            } else {
                                message.error('Query rename failed')
                                closeModal()
                            }
                        }
                    },
                    { immediate: true }
                )

                watch(data, () => {
                    message.success('Query renamed successfully')
                    if (data.value !== undefined) {
                        let parentGuid = queryData.value.attributes.parent.guid

                        refreshQueryTree(parentGuid, 'query')

                        if (activeInlineTab.value.attributes) {
                            let activeInlineTabCopy: activeInlineTabInterface =
                                JSON.parse(
                                    JSON.stringify(toRaw(activeInlineTab.value))
                                )
                            activeInlineTabCopy.attributes.name = name.value
                            activeInlineTabCopy.label = name.value

                            if (
                                activeInlineTabCopy?.assetSidebar?.assetInfo
                                    ?.attributes?.__guid ===
                                queryData?.value?.attributes?.__guid
                            ) {
                                activeInlineTabCopy.assetSidebar.assetInfo.attributes.name =
                                    name.value
                                activeInlineTabCopy.assetSidebar.assetInfo.displayText =
                                    name.value
                            }
                            if (
                                data.value?.mutatedEntities?.UPDATE?.length > 0
                            ) {
                                activeInlineTabCopy.updateTime =
                                    data.value?.mutatedEntities?.UPDATE[0].updateTime
                                activeInlineTabCopy.updatedBy =
                                    data.value?.mutatedEntities?.UPDATE[0].updatedBy
                            }
                            modifyActiveInlineTab(
                                activeInlineTabCopy,
                                tabs,
                                activeInlineTabCopy.isSaved,
                                true
                            )
                        }

                        closeModal()
                        useAddEvent('insights', 'query', 'renamed', undefined)
                    }
                })
            }

            return {
                nameRef,
                clearData,
                closeModal,
                modalVisible,
                name,
                renameQuery,
                renameLoading,
                queryData,
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
</style>
<style lang="less" module>
    .input {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input):focus,
        :global(.ant-input):hover {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
    }

    .titleInput {
        :global(.ant-input) {
            @apply text-gray-700 !important;
            &::placeholder {
                @apply text-gray-500 !important;
            }
        }
    }
</style>
