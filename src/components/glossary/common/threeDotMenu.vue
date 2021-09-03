<template>
    <div
        class="group-hover:opacity-100"
        :class="isVisible ? 'opacity-100' : ''"
    >
        <a-dropdown
            v-model:visible="isVisible"
            :trigger="['click']"
            @click.stop="() => {}"
        >
            <a-button class="px-2" @click.prevent>
                <fa icon="fal ellipsis-v" class="h-4" />
            </a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item
                        v-if="showLinks"
                        key="profileLink"
                        @click="redirectToProfile"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" class="m-0 mr-2" />
                            <p class="p-0 m-0">
                                Go to
                                {{ assetTypeLabel[entity?.typeName] }}
                                profile
                            </p>
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        v-if="showLinks"
                        key="copyLink"
                        class="flex items-center"
                        @click="handleCopyProfileLink"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="CopyOutlined" class="m-0 mr-2" />
                            <p class="p-0 m-0">
                                Copy
                                {{ assetTypeLabel[entity?.typeName] }}
                                profile link
                            </p>
                        </div>
                    </a-menu-item>

                    <a-menu-divider v-if="showLinks" />
                    <a-menu-item
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                        key="add"
                        @click="createNewTerm"
                        class="flex items-center"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" class="m-0 mr-2" />
                            <p class="p-0 m-0">Add term</p>
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                        key="addCat"
                        class="flex items-center"
                        @click="createNewCategory"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" class="m-0 mr-2" />
                            <p class="p-0 m-0">Add category</p>
                        </div>
                    </a-menu-item>

                    <a-menu-divider
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                    />
                    <a-sub-menu key="status">
                        <template #title>
                            <div class="flex items-center justify-between">
                                <StatusBadge
                                    :key="entity?.guid"
                                    :status-id="entity?.attributes?.assetStatus"
                                    :status-message="
                                        entity?.attributes?.assetStatusMessage
                                    "
                                    :show-chip-style-status="false"
                                    :show-no-status="true"
                                    :show-label="true"
                                    class="p-0"
                                ></StatusBadge>
                                <AtlanIcon
                                    class="pt-1 ml-4 transform -rotate-90"
                                    icon="ChevronDown"
                                />
                            </div>
                        </template>
                        <template #expandIcon><div></div> </template>

                        <a-menu-item class="m-0 bg-white">
                            <Status
                                v-if="entity?.guid"
                                :selectedAsset="entity"
                            />
                        </a-menu-item>
                    </a-sub-menu>

                    <a-sub-menu key="expert">
                        <template #title>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center justify-between">
                                    <AtlanIcon
                                        icon="AddUser"
                                        class="m-0 mr-2"
                                    />
                                    <p class="p-0 m-0">Add Owner</p>
                                </div>
                                <AtlanIcon
                                    class="pt-1 ml-4 transform -rotate-90"
                                    icon="ChevronDown"
                                />
                            </div>
                        </template>
                        <template #expandIcon><div></div> </template>
                        <a-menu-item class="m-0 bg-white">
                            <Owners :selectedAsset="entity"
                        /></a-menu-item>
                    </a-sub-menu>
                    <a-menu-divider />
                    <a-menu-item key="archive" class="text-red-700">
                        <a-button
                            class="w-full p-0 m-0 bg-transparent border-0 shadow-none outline-none "
                            @click="showModal"
                        >
                            <div class="flex items-center text-red-700">
                                <fa icon="fal trash-alt" class="mr-2"></fa>
                                <p class="p-0 m-0">Archive</p>
                            </div>
                        </a-button>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-modal
            v-model:visible="isModalVisible"
            :closable="false"
            @ok="handleOk"
        >
            <template #footer>
                <a-button key="back" @click="handleCancel">Cancel</a-button>
                <a-button key="submit" danger @click="handleOk"
                    >Delete</a-button
                >
            </template>
            <template #title>
                Delete {{ assetTypeLabel[entity?.typeName] }}</template
            >
            <p>Are you sure you want to delete {{ entity?.displayText }}?</p>
            <p>Once deleted, cannot be undone!</p>
        </a-modal>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, PropType, inject, onMounted } from 'vue'
    // components
    // import Status from '@common/sidebar/status.vue'
    import Owners from '@/glossary/common/owners.vue'
    import Status from '@/glossary/common/status.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import useDeleteGlossary from '~/composables/glossary/useDeleteGlossary'
    import useCreateGlossary from '~/composables/glossary/useCreateGlossary'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: { Status, Owners, StatusBadge },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
            redirectToProfile: {
                type: Function,
                required: false,
                default: undefined,
            },
            showLinks: {
                type: Boolean,
                required: false,
                default: () => true,
            },
        },
        setup(props, context) {
            // data
            const isVisible = ref(false)
            const isModalVisible = ref<boolean>(false)
            const handleFetchListInj: Function | undefined =
                inject('handleFetchList')
            const assetTypeLabel = {
                AtlasGlossaryTerm: 'term',
                AtlasGlossaryCategory: 'category',
                AtlasGlossary: 'glossary',
            }
            const {
                deleteGlossary,
                deleteCategory,
                deleteTerm,
                error,
                isLoading,
            } = useDeleteGlossary()

            const { createTerm, createCategory } = useCreateGlossary()
            const serviceMap = {
                AtlasGlossaryTerm: deleteTerm,
                AtlasGlossaryCategory: deleteCategory,
                AtlasGlossary: deleteGlossary,
            }

            const showModal = () => {
                isModalVisible.value = true
                isVisible.value = false
            }
            const handleOk = () => {
                serviceMap[props.entity?.typeName](
                    props.entity?.guid,
                    !props.showLinks,
                    props.entity?.attributes?.anchor?.guid
                )
                if (handleFetchListInj) handleFetchListInj(props.entity)

                isModalVisible.value = false
            }

            const handleCancel = () => {
                isModalVisible.value = false
            }
            const handleCopyProfileLink = () => {
                const baseUrl = window.location.origin
                const text = `${baseUrl}/glossary/${
                    assetTypeLabel[props.entity?.typeName]
                }/${props?.entity?.guid}`
                copyToClipboard(text)
            }
            const createNewTerm = () => {
                if (props.entity?.typeName === 'AtlasGlossary')
                    createTerm(props.entity?.guid ?? '')
                else
                    createTerm(
                        props.entity?.attributes?.anchor?.guid ?? '',
                        props.entity.guid
                    )
            }
            const createNewCategory = () => {
                if (props.entity?.typeName === 'AtlasGlossary')
                    createCategory(props.entity?.guid ?? '')
                else
                    createCategory(
                        props.entity?.attributes?.anchor?.guid ?? '',
                        props.entity.guid
                    )
            }

            return {
                handleCopyProfileLink,
                assetTypeLabel,
                isVisible,
                isModalVisible,
                handleOk,
                handleCancel,
                showModal,
                createNewTerm,
                createNewCategory,
            }
        },
    })
</script>
