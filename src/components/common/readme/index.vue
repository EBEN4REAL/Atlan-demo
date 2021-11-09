<template>
    <div class="p-4 bg-white rounded">
        <div class="flex items-center justify-between mb-3 text-base">
            <div class="flex items-center">
                <AtlanIcon icon="Readme" class="w-auto h-8 mr-3" /><span
                    class="text-base font-bold text-gray"
                    >Readme</span
                >
            </div>
            <div v-if="editable" class="flex align-items-center">
                <a-button class="mr-2" @click="handleSave">Save</a-button>

                <a-button
                    type="link"
                    :variant="'btn btn-sm btn-link mb-0 btn-no-focus font-w700 text-gray-300'"
                    :loading="false"
                    :loading-text="'Cancelling...'"
                    @click="onCancel"
                    >Cancel</a-button
                >
            </div>
            <a-button
                v-if="editPermission && !editable"
                type="link"
                class="text-sm"
                @click="startEdit"
            >
                <fa icon="fa pencil" class="mx-2 text-xs" />
                Edit
            </a-button>
        </div>
        <Editor
            ref="editor"
            :placeholder="placeholder"
            class="border-0"
            :editable="editable"
            :content="entity?.attributes?.readme?.attributes?.description"
            @onEditorContentUpdate="onUpdate"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        PropType,
        watch,
        computed,
        toRefs,
    } from 'vue'

    import Editor from '@/common/editor/index.vue'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useUpdateReadme from '~/composables/readme/useUpdateReadme'
    import useCreateReadme from '~/composables/readme/useCreateReadme'

    export default defineComponent({
        components: {
            Editor,
        },
        props: {
            placeholder: {
                type: String,
                default: 'Add some details here...',
            },
            entity: {
                type: Object as PropType<
                    Glossary | Category | Term | assetInterface
                >,
                required: true,
                default: () => {},
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props) {
            const editable = ref(false)
            const editor = ref()
            const { entity } = toRefs(props)
            const editorContent = ref(
                entity.value?.attributes?.readme?.attributes?.description ?? ''
            )
            const readmeDescription = computed(
                () => entity.value?.attributes?.readme?.attributes?.description
            )

            const onUpdate = (content: string, json: Record<string, any>) => {
                editorContent.value = content
            }

            const onCancel = () => {
                if (editor.value) {
                    editor.value.resetEditor()
                }
                editorContent.value = readmeDescription.value

                editable.value = false
            }

            const startEdit = () => {
                editable.value = true
            }

            const handleSave = () => {
                editable.value = false
                if (
                    readmeDescription.value?.length ||
                    readmeDescription.value === ''
                ) {
                    const { update } = useUpdateReadme(
                        entity.value?.attributes?.readme,
                        editorContent.value
                    )
                    update()
                } else {
                    const { createReadme } = useCreateReadme(
                        entity,
                        editorContent.value
                    )
                    createReadme()
                }
            }

            return {
                editable,
                editor,
                editorContent,
                onUpdate,
                onCancel,
                startEdit,
                handleSave,
                readmeDescription,
            }
        },
    })
</script>

<style lang="less">
    .container {
        display: flex;
        width: 100vw !important;
        align-items: center;
    }
</style>

<route lang="yaml">
meta:
    layout: project
    requiresAuth: true
</route>
