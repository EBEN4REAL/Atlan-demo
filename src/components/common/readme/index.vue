<template>
    <div
        ref="editorDiv"
        :class="{
            'editor-open': isEditing,
            'editor-close': !isEditing,
            'max-modal-height': usedInModal,
        }"
        @transitionend="
            () => {
                editorDiv?.scrollIntoView({ behavior: 'smooth' })
            }
        "
    >
        <div
            class="flex border-b border-gray-200"
            :class="usedInModal ? 'p-5' : 'p-6'"
        >
            <div v-if="usedInModal">
                <slot name="assetInfo"></slot>
            </div>
            <div v-else class="flex items-center">
                <div class="p-2 mr-2 rounded-md bg-primary-light">
                    <AtlanIcon icon="Readme" class="w-5 h-5 text-primary" />
                </div>
                <span class="text-base font-bold text-gray">Readme</span>
            </div>
            <div class="ml-auto">
                <a-tooltip
                    placement="top"
                    :title="
                        !isEditingAllowed
                            ? `You don't have permission to add readme for this asset`
                            : ''
                    "
                    :mouse-enter-delay="0.5"
                >
                    <a-button
                        v-if="!localReadmeContent && !isEditing"
                        :disabled="!isEditingAllowed"
                        class="flex items-center border-0 shadow-none text-primary"
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

                <div v-if="isEditing && isEditingAllowed" class="flex gap-x-2">
                    <a-button
                        class="flex items-center border-0 shadow-none"
                        type="minimal"
                        :disabled="isSaving"
                        @click="handleCancel"
                        @transitionend.stop="() => {}"
                    >
                        Cancel</a-button
                    >

                    <a-button
                        class="flex items-center justify-center w-28"
                        type="primary"
                        :loading="isSaving"
                        @click="handleUpdate"
                        @transitionend.stop="() => {}"
                    >
                        {{ isSaving ? 'Saving' : 'Save' }}</a-button
                    >
                </div>
                <a-tooltip
                    placement="top"
                    :title="
                        !isEditingAllowed
                            ? `You don't have permission to edit readme for this asset`
                            : ''
                    "
                    :mouse-enter-delay="0.5"
                >
                    <a-button
                        v-if="localReadmeContent && !isEditing"
                        :disabled="!isEditingAllowed"
                        class="flex items-center border-0 shadow-none text-primary"
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
        <div
            class="p-6 border-0"
            :class="usedInModal ? 'overflow-y-auto' : 'h-full'"
        >
            <AtlanEditor
                ref="editor"
                v-model="sanitizedReadmeContent"
                placeholder="Type '/' for commands"
                :asset-type="assetType"
                :is-edit-mode="isEditing"
                :empty-text="
                    isEditingAllowed
                        ? emptyTextIfEditingAllowed
                        : emptyTextIfEditingDisallowed
                "
                @change="$emit('editing')"
                @transitionend.stop="() => {}"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, toRefs, computed } from 'vue'

    import { useVModel } from '@vueuse/core'
    import DOMPurify from 'dompurify'
    import AtlanEditor from '~/components/common/editor/index.vue'

    export default defineComponent({
        components: {
            AtlanEditor,
        },
        props: {
            isEditingAllowed: {
                type: Boolean,
                required: false,
                default: false,
            },
            modelValue: {
                type: String,
                required: false,
                default: '',
            },
            encodeContent: {
                type: Boolean,
                required: false,
                default: true,
            },
            emptyTextIfEditingAllowed: {
                type: String,
                required: false,
                default: 'Add a Readme with an overview of your asset.',
            },
            emptyTextIfEditingDisallowed: {
                type: String,
                required: false,
                default: "Readme hasn't been added for this asset.",
            },
            handleSave: {
                type: Function,
                required: true,
            },
            handleSuccess: {
                type: Function,
                required: false,
                default: () => {},
            },
            handleFailure: {
                type: Function,
                required: false,
                default: () => {},
            },
            assetType: {
                type: String,
                default: 'DISCOVERY',
                required: false,
            },
            usedInModal: {
                type: Boolean,
                required: false,
                default: false,
            },
            loadEditMode: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['savedChanges', 'editing', 'update:modelValue'],
        setup(props, { emit }) {
            const {
                isEditingAllowed,
                encodeContent,
                handleSave,
                handleSuccess,
                handleFailure,
                loadEditMode,
            } = toRefs(props)
            const content = useVModel(props, 'modelValue', emit)
            const allowedTags = [
                'iframe',
                'img',
                'table',
                'th',
                'tr',
                'td',
                'code',
                'pre',
            ]
            const localReadmeContent = ref(
                encodeContent.value
                    ? decodeURIComponent(content.value)
                    : content.value
            )
            const sanitizedReadmeContent = ref(
                DOMPurify.sanitize(localReadmeContent.value, {
                    ADD_TAGS: [...allowedTags],
                })
            )

            const isEditing = ref(false)
            const isSaving = ref(false)

            const editorDiv = ref<HTMLElement | null>(null)
            const editor = ref()

            const handleEditMode = () => {
                isEditing.value = !isEditing.value
                editor.value?.editor?.commands.focus('end')
            }

            if (loadEditMode.value) {
                handleEditMode()
            }

            const handleUpdate = async () => {
                isSaving.value = true
                content.value = encodeContent.value
                    ? encodeURIComponent(sanitizedReadmeContent.value)
                    : sanitizedReadmeContent.value
                try {
                    await handleSave.value(content.value)
                    handleSuccess?.value()
                } catch (error) {
                    handleFailure?.value(error)
                }
                isSaving.value = false
                isEditing.value = false
                emit('savedChanges')
            }

            const handleCancel = () => {
                sanitizedReadmeContent.value = encodeContent.value
                    ? DOMPurify.sanitize(decodeURIComponent(content.value), {
                          ADD_TAGS: [...allowedTags],
                      })
                    : DOMPurify.sanitize(content.value)
                editor.value?.editor?.commands.setContent(
                    sanitizedReadmeContent.value
                )
                isEditing.value = false
                emit('savedChanges')
            }

            watch(localReadmeContent, () => {
                sanitizedReadmeContent.value = DOMPurify.sanitize(
                    localReadmeContent.value,
                    { ADD_TAGS: [...allowedTags] }
                )
            })
            return {
                localReadmeContent,
                handleUpdate,
                isEditingAllowed,
                handleEditMode,
                handleCancel,
                editor,
                editorDiv,
                isEditing,
                isSaving,
                sanitizedReadmeContent,
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

    .max-modal-height {
        max-height: 75vh;
    }
</style>
