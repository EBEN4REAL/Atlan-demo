<template>
    <node-view-wrapper
        class="flex w-full mt-2 group"
        :class="selected ? 'outline-primary' : ''"
    >
        <div v-if="isLoading" class="w-full h-24" style="min-height: 200px">
            <SectionLoader></SectionLoader>
        </div>
        <div
            v-else-if="!isLoading && error"
            style="min-height: 200px"
            class="flex items-center w-full bg-gray-200"
        >
            Something went wrong.
        </div>
        <div v-else class="flex w-full upload-image group">
            <div v-if="!imageSrc || isEditMode" class="flex w-full">
                <div
                    class="flex flex-col w-full border border-gray-400 border-dashed cursor-pointer"
                >
                    <div class="flex flex-col items-center w-full p-6">
                        <div class="flex flex-wrap justify-center">
                            <div class="w-3/4">
                                <a-input
                                    v-model:value="imageLinkInput"
                                    placeholder="https://"
                                />
                            </div>
                            <div class="w-1/4">
                                <a-button
                                    class="ml-1"
                                    @click="handleInputChange"
                                >
                                    Embed Image
                                </a-button>
                            </div>
                        </div>
                        <a-divider>OR</a-divider>
                        <a-upload
                            v-if="!imageSrc || isEditMode"
                            accept="image/png, image/gif, image/jpeg"
                            :custom-request="handleUploadImage"
                            class="flex w-full text-center"
                            :show-upload-list="true"
                            name="avatar"
                        >
                            <a-button>Upload Image</a-button>
                        </a-upload>
                    </div>
                </div>
            </div>
            <div
                v-if="editor.isEditable"
                class="absolute right-0 hidden m-2 group-hover:block"
            >
                <div class="flex gap-x-1">
                    <a-button
                        v-if="imageSrc && !isEditMode"
                        size="small"
                        @click.prevent.stop="toggleEditMode"
                    >
                        Replace
                    </a-button>
                    <a-button
                        v-if="imageSrc && isEditMode"
                        size="small"
                        @click.prevent.stop="handleCancel"
                    >
                        Cancel
                    </a-button>
                    <a-button size="small" @click.prevent.stop="handleDelete"
                        >Delete</a-button
                    >
                </div>
            </div>
        </div>
    </node-view-wrapper>
</template>

<script lang="ts">
    import { ref, watch, toRefs, defineComponent } from 'vue'
    import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'
    import SectionLoader from '@/common/loaders/section.vue'
    import useUploadImage from '~/composables/image/uploadImage'

    export default defineComponent({
        components: {
            NodeViewWrapper,
            SectionLoader,
        },
        props: nodeViewProps,
        setup(props) {
            const { selected, deleteNode, node, editor } = toRefs(props)

            const imageSrc = ref(node.value?.attrs.src)
            const imageLinkInput = ref('')
            const isEditMode = ref(false)

            const { upload, isLoading, error, isReady, data } = useUploadImage()
            const handleUploadImage = async (uploaded) => {
                await upload(uploaded.file)
            }

            watch(isReady, () => {
                if (isReady?.value) {
                    const url = `/api/service/images/${data.value?.id}?ContentDisposition=inline&name=image`
                    imageSrc.value = url
                    isEditMode.value = false
                    if (props?.editor) {
                        props.editor
                            .chain()
                            .focus()
                            .setImage({ src: url })
                            .run()
                    }
                }
            })

            const handleDelete = () => {
                deleteNode.value?.()
            }

            const toggleEditMode = () => {
                isEditMode.value = !isEditMode.value
            }

            const handleCancel = (value) => {
                isEditMode.value = !isEditMode.value
            }

            const handleInputChange = () => {
                if (imageLinkInput.value) {
                    if (
                        editor &&
                        editor.value &&
                        deleteNode &&
                        deleteNode.value
                    ) {
                        deleteNode.value()
                        editor.value.commands.focus()
                        editor.value.commands.setImage({
                            src: imageLinkInput.value,
                        })
                    }
                }
            }

            return {
                handleUploadImage,

                getNameInitials,
                getNameInTitleCase,
                error,
                handleInputChange,
                imageSrc,
                imageLinkInput,
                selected,
                handleDelete,
                deleteNode,
                isEditMode,
                toggleEditMode,
                handleCancel,
                isLoading,
                editor,
                isReady,
            }
        },
    })
</script>

<style lang="less"></style>
