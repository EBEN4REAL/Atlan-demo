<template>
    <div
        v-if="editor && editable"
        class="flex items-center max-w-full min-w-full bg-white border border-gray-200 rounded shadow-sm  editor-menu"
    >
        <a-dropdown
            :trigger="['click']"
            v-if="getActiveMenu(editor)?.key !== 'uploadimage'"
        >
            <div class="flex items-center p-2">
                {{ getActiveMenu(editor)?.title || 'Text' }}
                <AtlanIcon icon="ChevronDown" class="ml-1"></AtlanIcon>
            </div>

            <template #overlay>
                <a-menu>
                    <a-menu-item
                        :class="{
                            'is-active bg-gray-200': isMenuActive(
                                editor,
                                menuItem
                            ),
                        }"
                        v-for="menuItem in blockMenu"
                        :key="menuItem.key"
                        @click="() => menuItem.onClick(editor)"
                    >
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
            class="flex items-center"
        >
            <a-tooltip
                v-for="menuItem in menuData"
                :key="menuItem.key"
                placement="bottom"
            >
                <a-dropdown
                    v-if="menuItem.key === 'image'"
                    v-model:visible="showImageDropdown"
                    :trigger="['click']"
                    placement="bottomCenter"
                >
                    <a-button
                        class="p-2 border-0"
                        :class="{
                            'is-active': editor.isActive(`${menuItem.key}`),
                            'border-r-2': menuItem.border,
                        }"
                        @click="showImageDropdown = true"
                    >
                        <fa
                            v-if="menuItem.icon"
                            :icon="menuItem.icon"
                            class="m-1"
                        />
                        <span v-else>{{ menuItem.title }}</span>
                    </a-button>

                    <template #overlay @blur="showImageDropdown = false">
                        <a-menu>
                            <div class="p-3 rounded w-96">
                                <div
                                    class=" d-flex align-items-center justify-content-start"
                                >
                                    <label>By Url</label>
                                    <div class="flex">
                                        <a-input
                                            v-model:value="imageLink"
                                            type="url"
                                            focused
                                            @keydown.enter="
                                                () => menuItem.onClick(editor)
                                            "
                                        />
                                        <a-button
                                            type="primary"
                                            class="ml-3 mr-2"
                                            @click="
                                                () => menuItem.onClick(editor)
                                            "
                                        >
                                            Add
                                        </a-button>
                                    </div>
                                </div>
                                <div
                                    class="justify-center mt-3 text-center  d-flex align-items-center"
                                >
                                    <label>OR</label>
                                    <div
                                        class="flex flex-col content-center mt-4  align-items-center"
                                    >
                                        <a-upload-dragger
                                            class="content-center justify-center mx-5 "
                                            name="file"
                                            list-type="picture"
                                            :multiple="false"
                                            :custom-request="uploadImage"
                                        >
                                            <fa icon="fal plus" />
                                            <div class="text-sm">
                                                Click or drag and drop to upload
                                            </div>
                                        </a-upload-dragger>
                                    </div>
                                </div>
                            </div>
                        </a-menu>
                    </template>
                </a-dropdown>

                <div
                    v-else
                    class="flex p-2 text-gray-500 transition duration-100 ease-in border-0 shadow-none  hover:text-primary inline-center"
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
                    @click="() => menuItem.onClick(editor)"
                >
                    <fa
                        v-if="menuItem.icon"
                        :icon="menuItem.icon"
                        class="mr-1"
                    />
                    <span v-else>{{ menuItem.title }}</span>
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

    interface MenuItem {
        title: string
        key: string
        helpText: string
        icon?: string
        level?: number
        border?: boolean
        onClick: (editor: Editor) => void
    }

    interface Props {
        editor: Editor
        editable: boolean
    }

    export default defineComponent({
        props: {
            editor: {
                required: true,
            },
            editable: {
                type: Boolean,
                default: false,
                required: true,
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

            const blockMenu: MenuItem[] = [
                {
                    title: 'H1',
                    key: 'heading-1',
                    level: 1,
                    helpText: '',
                    onClick: (editor) =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run(),
                },
                {
                    title: 'H2',
                    key: 'heading-2',
                    level: 2,
                    helpText: '',
                    onClick: (editor) =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run(),
                },
                {
                    title: 'H3',
                    key: 'heading-3',
                    level: 3,
                    border: true,
                    helpText: '',
                    onClick: (editor) =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run(),
                },

                {
                    title: 'Unordered List',
                    key: 'bulletList',
                    helpText: '',
                    icon: 'fa list-ul',
                    onClick: (editor) =>
                        editor.chain().focus().toggleBulletList().run(),
                },
                {
                    title: 'Ordered List',
                    key: 'orderedList',
                    helpText: '',
                    icon: 'fa list-ol',
                    border: true,
                    onClick: (editor) =>
                        editor.chain().focus().toggleOrderedList().run(),
                },

                {
                    title: 'TaskList',
                    key: 'taskList',
                    helpText: '',
                    icon: 'fa square',
                    onClick: (editor) =>
                        editor.chain().focus().toggleTaskList().run(),
                },
                {
                    title: 'Blockquote',
                    key: 'blockquote',
                    helpText: '',
                    icon: 'fa quote-left',
                    onClick: (editor) =>
                        editor.chain().focus().toggleBlockquote().run(),
                },
                {
                    title: 'Code Block',
                    key: 'codeBlock',
                    helpText: '',
                    icon: 'fa code',
                    border: true,
                    onClick: (editor) =>
                        editor
                            .chain()
                            .focus()
                            .toggleCodeBlock({ language: 'json' })
                            .run(),
                },
                {
                    title: 'Image Block',
                    key: 'uploadimage',
                    helpText: '',
                    icon: 'fa image',
                    border: true,
                    onClick: (editor) =>
                        editor.chain().focus().toggleImageBlock().run(),
                },
            ]

            const linkMenu: MenuItem[] = [
                {
                    title: 'Link',
                    key: 'link',
                    helpText: '',
                    icon: 'fa link',
                    onClick: (editor) => {
                        link.value = editor.getAttributes('link').href ?? ''
                        showLinkModal.value = !showLinkModal.value
                    },
                },
            ]

            const menuData: MenuItem[] = [
                {
                    title: 'Bold',
                    key: 'bold',
                    helpText: '',
                    icon: 'fa bold',
                    onClick: (editor) => {
                        editor.chain().focus().toggleBold().run()
                    },
                },
                {
                    title: 'Italic',
                    key: 'italic',
                    helpText: '',
                    icon: 'fa italic',
                    onClick: (editor) =>
                        editor.chain().focus().toggleItalic().run(),
                },
                {
                    title: 'Underline',
                    key: 'underline',
                    helpText: '',
                    icon: 'fa underline',
                    onClick: (editor) =>
                        editor.chain().focus().toggleUnderline().run(),
                },
                {
                    title: 'Strikethrough',
                    key: 'strike',
                    helpText: '',
                    icon: 'fa strikethrough',
                    onClick: (editor) =>
                        editor.chain().focus().toggleStrike().run(),
                },

                {
                    title: 'Undo',
                    key: 'undo',
                    helpText: '',
                    icon: 'fa undo',
                    onClick: (editor) => editor.chain().focus().undo().run(),
                },
                {
                    title: 'Redo',
                    key: 'redo',
                    helpText: '',
                    icon: 'fa redo',
                    onClick: (editor) => editor.chain().focus().redo().run(),
                },
                // table
            ]

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
                linkMenu,
                handleLinkClick,
                isMenuActive,
                getActiveMenu,
            }
        },
    })
</script>
<style lang="less" scoped>
    .is-active {
        @apply text-primary !important;
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
