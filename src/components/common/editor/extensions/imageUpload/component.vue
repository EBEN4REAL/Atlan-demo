<template>
    <node-view-wrapper
        class="flex w-full mt-2 group"
        :class="selected ? 'outline-primary' : ''"
    >
        <div class="w-full h-24" v-if="isLoading" style="min-height: 200px">
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
                    class="flex flex-col w-full border border-gray-400 border-dashed cursor-pointer "
                >
                    <div class="flex flex-col items-center w-full p-6">
                        <div>
                            <a-input
                                v-model:value="imageLinkInput"
                                placeholder="https://"
                                @change="handleInputChange"
                            >
                            </a-input>
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
            <img
                v-else
                :src="imageSrc"
                class="w-full h-auto bg-gray-100"
                style="min-height: 100px"
            />
            <div
                class="absolute right-0 hidden m-2 group-hover:block"
                v-if="editor.isEditable"
            >
                <div class="flex gap-x-1">
                    <a-button
                        size="small"
                        @click.prevent.stop="toggleEditMode"
                        v-if="imageSrc && !isEditMode"
                    >
                        Replace
                    </a-button>
                    <a-button
                        size="small"
                        @click.prevent.stop="handleCancel"
                        v-if="imageSrc && isEditMode"
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
    import { ref, watch, PropType } from 'vue'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'
    import uploadAvatar from '~/composables/avatar/uploadAvatar'
    import SectionLoader from '@/common/loaders/section.vue'

    import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
    import { toRefs } from 'vue'
    import useUploadImage from '~/composables/image/uploadImage'

    export default {
        components: {
            NodeViewWrapper,
            SectionLoader,
        },
        props: {
            ...nodeViewProps,
        },
        setup(props, context) {
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
                    if (props?.updateAttributes) {
                        props?.updateAttributes({
                            src: url,
                        })
                    }
                }
            })

            const handleInput = () => {
                console.log('prevent')
            }

            const handleDelete = () => {
                deleteNode?.value()
            }

            const toggleEditMode = () => {
                isEditMode.value = !isEditMode.value
            }

            const handleCancel = (value) => {
                isEditMode.value = !isEditMode.value
            }

            const handleInputChange = (value) => {
                console.log('change')
                if (imageLinkInput.value) {
                    imageSrc.value = imageLinkInput.value
                    isEditMode.value = false
                    if (props?.updateAttributes) {
                        props?.updateAttributes({
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
                handleInput,
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
    }
</script>

<style lang="less"></style>
