<template>
    <node-view-wrapper
        class="flex w-full mt-2 upload-image group"
        :class="selected ? 'outline-primary' : ''"
    >
        <a-upload
            v-if="!imageSrc || isEditMode"
            accept="image/*"
            class="flex w-full"
            :show-upload-list="false"
            name="avatar"
        >
            <div
                class="flex flex-col w-full border border-gray-400 border-dashed cursor-pointer "
            >
                <div
                    class="flex flex-col items-center w-full p-6"
                    @click.prevent.stop="handleInput"
                >
                    <div>
                        <a-input
                            v-model:value="imageLinkInput"
                            placeholder="https://"
                            @change="handleInputChange"
                        >
                        </a-input>
                    </div>
                    <a-divider>OR</a-divider>
                    <a-button>Upload Image</a-button>
                </div>
            </div>
        </a-upload>
        <img
            v-else
            :src="imageSrc"
            class="w-full h-auto bg-gray-100"
            style="min-height: 100px"
        />
        <div class="absolute right-0 hidden m-2 group-hover:block">
            <div class="flex gap-x-1">
                <a-button
                    size="small"
                    @click.prevent.stop="toggleEditMode"
                    v-if="imageSrc && !isEditMode"
                >
                    Edit
                </a-button>
                <a-button
                    size="small"
                    @click.prevent.stop="toggleEditMode"
                    v-if="imageSrc && isEditMode"
                >
                    Cancel
                </a-button>
                <a-button size="small" @click.prevent.stop="handleDelete"
                    >Delete</a-button
                >
            </div>
        </div>
    </node-view-wrapper>
</template>

<script lang="ts">
    import { ref, watch, PropType } from 'vue'
    import { getNameInitials, getNameInTitleCase } from '~/utils/string'
    import uploadAvatar from '~/composables/avatar/uploadAvatar'

    import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
    import { toRefs } from 'vue'

    export default {
        components: {
            NodeViewWrapper,
        },
        props: {
            ...nodeViewProps,
        },
        setup(props, context) {
            const { selected, deleteNode } = toRefs(props)
            const uploadStarted = ref(false)
            const updatedImageUrl = ref(props.imageUrl)

            const imageSrc = ref('')
            const imageLinkInput = ref('')
            const isEditMode = ref(false)

            watch(
                () => props.imageUrl,
                () => {
                    updatedImageUrl.value = props.imageUrl
                }
            )
            const { upload, isReady, uploadKey, refreshImage } = uploadAvatar()
            const handleUploadAvatar = async (uploaded) => {
                console.log('handle Upload', uploaded)
                upload(uploaded.file)
                uploadStarted.value = true
                updatedImageUrl.value = `${updatedImageUrl.value}?${uploadKey.value}`

                return true
            }
            watch(uploadKey, () => {
                context.emit('imageUpdated', updatedImageUrl)
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

            const handleInputChange = (value) => {
                console.log('prevent', value)
                if (imageLinkInput.value) {
                    imageSrc.value = imageLinkInput.value
                    isEditMode.value = false
                }
            }

            return {
                handleUploadAvatar,
                isReady,
                uploadStarted,
                uploadKey,
                updatedImageUrl,
                getNameInitials,
                getNameInTitleCase,
                refreshImage,
                handleInput,
                handleInputChange,
                imageSrc,
                imageLinkInput,
                selected,
                handleDelete,
                deleteNode,
                isEditMode,
                toggleEditMode,
            }
        },
    }
</script>

<style lang="less"></style>
