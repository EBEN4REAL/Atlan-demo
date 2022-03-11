<template>
    <div
        v-if="editor && editable"
        class="box-border flex items-center bg-white border border-gray-300 rounded shadow-xl  editor-menu"
    >
        <a-dropdown
            v-if="getActiveMenu(editor)?.key !== 'uploadimage'"
            :trigger="['click']"
        >
            <div class="flex items-center p-2">
                {{ getActiveMenu(editor)?.title || 'Text' }}
                <AtlanIcon icon="ChevronDown" class="ml-1"></AtlanIcon>
            </div>

            <template #overlay>
                <a-menu>
                    <a-menu-item
                        v-for="menuItem in blockMenu"
                        :key="menuItem.key"
                        :class="{
                            'is-active bg-gray-200': isMenuActive(
                                editor,
                                menuItem
                            ),
                        }"
                        @click="() => menuItem.command({ editor })"
                    >
                        <AtlanIcon
                            :icon="menuItem.icon"
                            class="w-auto h-4 mb-1 mr-1"
                        />
                        {{ menuItem.title }}
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>

        <a-popover v-if="getActiveMenu(editor)?.key !== 'uploadimage'">
            <template #content>
                <div class="d-flex align-items-center justify-content-start">
                    <a-input
                        v-model:value="link"
                        type="url"
                        class="add-on"
                        focused
                        placeholder="https://"
                        @keydown.esc="showLinkModal = false"
                        @keydown.enter="() => setLink(editor)"
                    >
                        <template #addonAfter>
                            <div
                                v-if="!editor.isActive('link')"
                                class="text-white cursor-pointer"
                                @click="() => setLink(editor)"
                            >
                                Apply
                            </div>
                            <div
                                v-if="editor.isActive('link')"
                                class="text-white cursor-pointer"
                                @click="() => unLink(editor)"
                            >
                                Remove Link
                            </div>
                        </template>
                    </a-input>
                </div>
            </template>

            <div
                class="flex items-center p-2 text-gray-500 border-l border-r  hover:text-primary"
                @click="handleLinkClick(editor)"
            >
                <AtlanIcon icon="Globe" class="mr-1"></AtlanIcon>
                Link
            </div>
        </a-popover>

        <div
            v-if="getActiveMenu(editor)?.key !== 'uploadimage'"
            class="flex items-center m-1"
        >
            <a-tooltip
                v-for="menuItem in menuData"
                :key="menuItem.key"
                placement="bottom"
            >
                <div
                    class="
                        flex
                        p-2
                        text-gray-500
                        transition
                        duration-100
                        ease-in
                        border-0
                        rounded
                        shadow-none
                        hover:bg-gray-100
                        mx-0.5
                    "
                    :class="{
                        'is-active':
                            editor.isActive(`${menuItem.key}`) ||
                            editor.isActive(`heading`, {
                                level: menuItem.level,
                            }) ||
                            (menuItem.key.split('-')[0] === 'align' &&
                                editor.isActive({
                                    textAlign: menuItem.key.split('-')[1],
                                })),
                    }"
                    @click="() => menuItem.command({ editor })"
                >
                    <AtlanIcon :icon="menuItem.icon" class="w-auto h-4" />
                </div>

                <template #title>{{
                    menuItem.helpText || menuItem.title
                }}</template>
            </a-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
    import { Editor } from '@tiptap/core'
    import { defineComponent, ref, watch } from 'vue'

    import useUploadImage from '~/composables/image/uploadImage'
    import { getAPIPath } from '~/services/api/common'
    import { blockMenu, menuData } from '~/constant/readmeMenuItems'

    interface Props {
        editor: Editor
        editable: boolean
    }

    export default defineComponent({
        props: {
            editor: {
                required: true,
                type: Editor
            },
            editable: {
                type: Boolean,
                default: false,
                required: false,
            },
        },
        setup(props) {
            const showLinkModal = ref(false)
            const showImageDropdown = ref(false)
            const imageLink = ref('')
            const link = ref('')

            const {
                data: imageUploadData,
                error: imageUploadError,
                isLoading: imageUploadLoading,
                upload,
            } = useUploadImage()

            const handleLinkClick = (editor: Editor) => {
                link.value = editor.getAttributes('link').href ?? ''
                showLinkModal.value = !showLinkModal.value
            }

            const setLink = (editor: Editor) => {
                if (link.value) {
                    let url = link.value
                    if (
                        !(
                            url.split(':')[0] === 'http' ||
                            url.split(':')[0] === 'https'
                        )
                    )
                        url = `https://${url}`

                    editor.chain().setLink({ href: url }).run()
                }
            }

            const unLink = (editor: Editor) => {
                editor.chain().focus().unsetLink().run()
                link.value = ''
            }

            const uploadImage = (payload: { file: File }) => {
                const { file } = payload
                upload(file)
            }

            const getActiveMenu = (editor) =>
                blockMenu.find((menu) => {
                    const options = {}
                    let { key } = menu
                    if (menu.level) {
                        options.level = menu.level
                        key = 'heading'
                    }
                    return editor.isActive(key, options)
                })

            const isMenuActive = (editor, menu) =>
                getActiveMenu(editor)?.key === menu.key

            watch(imageUploadData, (newImageUploadData) => {
                if (newImageUploadData) {
                    if (props.editor) {
                        const { editor } = props as Props
                        const { id } = newImageUploadData

                        const imageUrl = getAPIPath(
                            '/service',
                            `/images/${id}?ContentDisposition=inline&name=image`
                        )
                        editor
                            .chain()
                            .focus()
                            .setImage({
                                src: `/api${imageUrl}`,
                            })
                            .run()
                        showImageDropdown.value = false
                    }
                }
            })

            return {
                menuData,
                showLinkModal,
                showImageDropdown,
                imageLink,
                link,
                setLink,
                unLink,
                uploadImage,
                blockMenu,
                handleLinkClick,
                isMenuActive,
                getActiveMenu,
            }
        },
    })
</script>
<style lang="less" scoped>
    .is-active {
        @apply bg-gray-200 text-gray-700 !important;
    }
</style>

<style lang="less">
    .tableWrapper {
        overflow-x: auto;
    }

    .add-on {
        .ant-input-group-addon {
            @apply bg-primary border-primary !important;
        }
    }
</style>
