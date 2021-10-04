<template>
    <div class="w-full">
        <div
            class="flex items-center justify-between w-full py-1 text-base bg-white "
        >
            <div class="">
                <a-dropdown
                    placement="bottomLeft"
                    :trigger="['click']"
                    @click.stop="() => {}"
                >
                    <template #overlay>
                        <a-menu>
                            <a-menu-item
                                v-for="item in AnnouncementList"
                                :key="item"
                            >
                                <div class="flex items-center space-x-2">
                                    <component
                                        :is="item.icon"
                                        class="w-auto h-4 ml-1 mr-2 pushtop"
                                    />

                                    {{ item.label }}
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>

                    <AtlanIcon
                        class="pt-1 ml-4 transform -rotate-90"
                        icon="ChevronDown"
                    />
                    <div class="flex items-center align-middle">
                        <!-- <span class="svg-icon">
                <component class="w-auto h-4" :is="AnnouncementList" />
            </span> -->

                        <p class="mb-0 ml-2">Information</p>
                    </div>
                </a-dropdown>
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
    import AnnouncementList from '~/constant/announcement'

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
                AnnouncementList,
                onUpdate,
                onCancel,
                startEdit,
            }
        },
    })
</script>
