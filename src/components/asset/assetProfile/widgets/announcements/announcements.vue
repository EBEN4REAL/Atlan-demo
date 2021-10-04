<template>
    <div class="w-full">
        <div
            class="flex items-center justify-between w-full py-1 text-base bg-white "
        >
            <div class="mb-3 text-base font-bold text-gray-700">
                Announcements
            </div>
            <div v-if="editable" class="flex align-items-center">
                <a-button class="mr-2" @click="editable = false"
                    >Update</a-button
                >

                <a-button
                    type="link"
                    :variant="'btn btn-sm btn-link mb-0 btn-no-focus font-w700 text-gray-300'"
                    :loading="false"
                    :loading-text="'Cancelling...'"
                    @click="onCancel"
                    >Cancel</a-button
                >
            </div>
            <a-button v-else type="link" class="text-sm" @click="startEdit">
                <fa icon="fa pencil" class="mx-2 text-xs" />
                Edit
            </a-button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const editable = ref(false)
            const editor = ref()
            const editorContent = ref('')

            const onUpdate = (content: string) => {
                // console.log(content, json)
                editorContent.value = content
            }

            const onCancel = () => {
                if (editor.value) {
                    editor.value.resetEditor()
                }
                editorContent.value = editor.value.getEditorContent().content

                editable.value = false
            }

            const startEdit = () => {
                editable.value = true
                // if (!editorContent.value || editorContent.value === '<p></p>') {
                //     showTemplatesModal.value = true
                // }
            }

            return {
                editable,
                editor,
                editorContent,

                onUpdate,
                onCancel,
                startEdit,
            }
        },
    })
</script>
