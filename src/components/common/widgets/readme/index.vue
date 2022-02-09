<template>
    <div
        ref="editorDiv"
        class="flex flex-col bg-white border border-gray-200 rounded-lg"
        :class="isEditMode ? 'editor-open' : 'editor-close'"
        @transitionend="
            () => {
                editorDiv?.scrollIntoView({ behavior: 'smooth' })
            }
        "
    >
        <div class="flex p-4 border-b border-gray-200">
            <div class="flex items-center">
                <AtlanIcon icon="Readme" class="w-auto h-8 mr-2" /><span
                    class="text-base font-bold text-gray"
                    >Readme</span
                >
            </div>
            <div class="ml-auto">
                <a-tooltip
                    placement="top"
                    :title="
                        !isEdit
                            ? `You don't have permission to add readme for this asset`
                            : ''
                    "
                    :mouse-enter-delay="0.5"
                >
                    <a-button
                        v-if="!localReadmeContent && !isEditMode"
                        :disabled="!isEdit"
                        class="flex items-center text-primary border-0 shadow-none"
                        type="minimal"
                        @click="handleEditMode"
                        @transitionend.stop="() => {}"
                    >
                        <AtlanIcon
                            icon="Add"
                            class="w-auto h-4 mr-1"
                        />Add</a-button
                    ></a-tooltip
                >

                <div v-if="isEdit && isEditMode" class="flex gap-x-2">
                    <a-button
                        v-if="!isLoading"
                        class="flex items-center border-0 shadow-none"
                        type="minimal"
                        @click="handleCancel"
                        @transitionend.stop="() => {}"
                    >
                        Cancel</a-button
                    >

                    <a-button
                        class="flex w-28 justify-center items-center"
                        type="primary"
                        :loading="isLoading"
                        @click="handleUpdate"
                        @transitionend.stop="() => {}"
                    >
                        Save</a-button
                    >
                </div>
                <a-tooltip
                    placement="top"
                    :title="
                        !isEdit
                            ? `You don't have permission to edit readme for this asset`
                            : ''
                    "
                    :mouse-enter-delay="0.5"
                >
                    <a-button
                        v-if="localReadmeContent && !isEditMode"
                        :disabled="!isEdit"
                        class="flex items-center text-primary border-0 shadow-none"
                        type="minimal"
                        @click="handleEditMode"
                        @transitionend.stop="() => {}"
                    >
                        <AtlanIcon
                            icon="Edit"
                            class="w-auto h-4 mr-1"
                        />Edit</a-button
                    ></a-tooltip
                >
            </div>
        </div>
        <div class="border-0 h-full p-6">
            <Editor
                ref="editor"
                v-model="localReadmeContent"
                placeholder="Type '/' for commands"
                :is-edit-mode="isEditMode"
                :empty-text="
                    isEditAllowed
                        ? 'Add a Readme with an overview of your asset.'
                        : 'Readme hasn\'t been added for this asset.'
                "
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, toRefs } from 'vue'

    import Editor from '@/common/editor/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

    export default defineComponent({
        components: {
            Editor,
        },
        props: {
            isEdit: {
                type: Boolean,
                required: false,
                default: true,
            },
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { asset, isEdit: isEditAllowed } = toRefs(props)
            const editorDiv = ref<HTMLElement | null>(null)

            const { readmeContent, readmeGuid } = useAssetInfo()

            const { handleUpdateReadme, localReadmeContent, isLoading } =
                updateAssetAttributes(asset)

            const isEditMode = ref(false)

            const editor = ref()

            const handleEditMode = () => {
                isEditMode.value = !isEditMode.value
                editor.value?.editor?.commands.focus('end')
            }

            const handleUpdate = () => {
                handleUpdateReadme()
                isEditMode.value = false
            }

            const handleCancel = () => {
                if (editor.value) {
                    editor.value.resetEditor(
                        decodeURIComponent(readmeContent(asset.value) || '')
                    )
                }
                localReadmeContent.value = readmeContent(asset.value)
                isEditMode.value = false
            }

            return {
                isLoading,
                handleUpdate,
                isEditMode,
                handleEditMode,
                handleCancel,
                editor,
                localReadmeContent,
                readmeGuid,
                isEditAllowed,
                editorDiv,
            }
        },
    })
</script>

<style lang="less" scoped>
    .editor-open {
        min-height: 75vh;
        transition: min-height 0.3s ease-in-out;
    }
    .editor-close {
        min-height: 0;
        transition: min-height 0.3s ease-in-out;
    }
</style>

<route lang="yaml">
meta:
    layout: project
    requiresAuth: true
</route>
