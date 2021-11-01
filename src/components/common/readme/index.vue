<template>
    <div class="w-2/3 h-min-1/2">
        <div
            class="flex items-center justify-between w-full py-1 text-base bg-white "
        >
            <div class="mb-3 text-base font-bold text-gray-700">Readme</div>
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
    import { message } from 'ant-design-vue'

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
                entity?.attributes?.readme?.attributes?.description ?? ''
            )
            const readmeDescription = computed(
                () => entity?.attributes?.readme?.attributes?.description
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
                    /* const { isCompleted, isLoading, update } = useUpdateReadme(
                        entity?.attributes?.readme,
                        editorContent.value
                    )
                    update()
                    watch(isCompleted, (completed) => {
                        if (completed) {
                            entity.attributes.readme.attributes.description =
                                editorContent.value
                            message.success('Readme saved!')
                        }
                    }) */
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
