<template>
    <div class="w-2/3 readme-wrapper h-min-1/2">
        <div
            class="flex items-center justify-between w-full py-1 text-base bg-white "
            :class="[
                showBorders ? ' border rounded-t ' : '',
                showPaddingX ? 'px-7' : '',
            ]"
        >
            <div class="mb-3 text-base font-bold text-gray-700">Readme</div>
            {{ readmeDescription }}
            <div v-if="editable" class="flex align-items-center">
                <a-button class="mr-2" @click="handleSave">Save</a-button>

                <!-- <a-dropdown
                    v-model:visible="templateNameDropdown"
                    :trigger="['click']"
                >
                    <a-button
                        v-if="editorContent && editorContent !== '<p></p>'"
                        @click="templateNameDropdown = true"
                        >{{
                            templateName === ''
                                ? 'Save as template'
                                : 'Save as a new template'
                        }}</a-button
                    >
                    <template #overlay>
                        <a-menu>
                            <div class="p-3 rounded w-96">
                                <div
                                    class=" d-flex align-items-center justify-content-start"
                                >
                                    <label>Template Name</label>
                                    <div class="flex">
                                        <a-input
                                            v-model:value="newTemplateName"
                                            type="url"
                                            focused
                                            @keydown.enter="saveAsTemplate"
                                        />
                                        <a-button
                                            type="primary"
                                            class="ml-3 mr-2"
                                            @click="saveAsTemplate"
                                        >
                                            Add
                                        </a-button>
                                    </div>
                                </div>
                            </div>
                        </a-menu>
                    </template>
                </a-dropdown> -->
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
        <Editor
            ref="editor"
            :placeholder="placeholder"
            :class="[
                showBorders ? 'border border-t-0 rounded-b' : 'border-0',
                showPaddingX ? 'px-7' : '',
            ]"
            :editable="editable"
            @onEditorContentUpdate="onUpdate"
        />
        <a-modal
            class="mt-16 border-gray-700"
            :visible="showTemplatesModal"
            :title="null"
            :closable="true"
            :mask="true"
            :mask-closable="true"
            width="50vw"
            :footer="null"
            @cancel="() => (showTemplatesModal = false)"
        >
            <div
                v-if="templateList.length && editable"
                class="flex flex-col p-1 pl-0 bg-white"
            >
                <div class="flex justify-between p-2">
                    <span class="text-2xl">Readme Templates</span>
                    <div>
                        <a-button type="default" class="rounded-2"
                            >New Template</a-button
                        >
                        <!-- <a-button type="link" @click="editTemplates">Edit</a-button> -->
                    </div>
                </div>
                <hr />
                <div class="flex flex-col mt-4">
                    <div
                        v-for="template in templateList"
                        :key="template.name"
                        class="flex justify-between mx-2 mt-4"
                    >
                        <span class="text-lg">{{ template.name }}</span>
                        <div class="flex">
                            <a-button
                                class="rounded-2"
                                @click="() => applyTemplate(template)"
                            >
                                Get Started
                            </a-button>
                        </div>
                    </div>
                    <div class="mt-16 ml-2 text-xs">
                        Don't want to use a template?
                        <a-button type="link" @click="startBlank"
                            >Start blank -></a-button
                        >
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted, watch, computed } from 'vue'

    import Editor from '@/common/editor/index.vue'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import useUpdateReadme from '@/common/readme/useUpdateReadme'

    export default defineComponent({
        components: {
            Editor,
        },
        props: {
            placeholder: {
                type: String,
                default: 'Add some details here...',
            },
            parentAssetId: {
                type: String,
                required: true,
                default: '',
            },
            showBorders: {
                type: Boolean,
                required: false,
                default: true,
            },
            showPaddingX: {
                type: Boolean,
                required: false,
                default: true,
            },
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
        },
        setup(props) {
            const editable = ref(false)
            const editor = ref()
            const editorContent = ref('')
            const showTemplatesModal = ref(false)
            const templateName = ref('')
            const newTemplateName = ref('')
            const templateNameDropdown = ref(false)
            const readmeDescription = computed(
                () => props.entity?.attributes?.readme?.attributes?.description
            )

            const templateList = ref([
                {
                    name: 'Feature Request',
                    content:
                        '<h1>What is the request?</h1><p><strong>Tell us more</strong></p><ul><li><p>Mention the pain point, not just the suggestion and solution</p><p><strong>Customers who have requested similar features</strong></p></li><li><p>Add any wingman calls if possible</p></li></ul><p></p><p></p><p><strong>Any other product which has a similar feature?</strong></p><p><mark data-color="#bfdbfe" style="background-color: #bfdbfe">Lorem ipsum dolar</mark></p>',
                },
                {
                    name: 'Bug Report',
                    content:
                        '<h1>What is the Bug?</h1><p><strong>Tell us more</strong></p><ul><li><p>Mention how to reproduce the bug</p><p><strong>Screenshots</strong></p></li></ul><p></p>',
                },
            ])

            const onUpdate = (content: string, json: Record<string, any>) => {
                editorContent.value = content
            }

            const onCancel = () => {
                if (editor.value) {
                    editor.value.resetEditor()
                }
                editorContent.value = editor.value.getEditorContent()?.content

                editable.value = false
            }

            const applyTemplate = (template) => {
                if (editor.value) {
                    editor.value.applyTemplate(template.content)
                    showTemplatesModal.value = false
                    templateName.value = template.name
                }
            }

            const saveAsTemplate = () => {
                templateList.value.push({
                    name: newTemplateName.value,
                    content: editorContent.value,
                })
                newTemplateName.value = ''
                templateNameDropdown.value = false
                editorContent.value = ''
            }

            const startEdit = () => {
                editable.value = true
                // if (!editorContent.value || editorContent.value === '<p></p>') {
                //     showTemplatesModal.value = true
                // }
                editorContent.value = readmeDescription.value
            }

            // const newTemplate = () => {

            // }
            const startBlank = () => {
                showTemplatesModal.value = false
                templateName.value = ''
            }
            const handleSave = () => {
                console.log(editorContent.value)
                editable.value = false
                const { isCompleted, isLoading, update } = useUpdateReadme(
                    props?.entity?.attributes?.readme,
                    editorContent.value
                )
                console.log(isCompleted, isLoading, update)
                update()
            }

            watch(
                readmeDescription,
                () => {
                    console.log(readmeDescription.value)
                    editorContent.value = readmeDescription.value
                },
                { immediate: true }
            )
            // onMounted(() => {
            //     console.log(
            //         props.entity?.attributes?.readme?.attributes?.description
            //     )
            //     if (
            //         props.entity?.attributes?.readme?.attributes?.description
            //             ?.length
            //     ) {
            //         editor.value = console.log(editorContent.value)
            //     }
            // })

            return {
                editable,
                editor,
                editorContent,
                templateList,
                templateName,
                newTemplateName,
                templateNameDropdown,
                onUpdate,
                onCancel,
                applyTemplate,
                saveAsTemplate,
                startEdit,
                startBlank,
                handleSave,
                showTemplatesModal,
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
