<template>
    <div class="flex justify-between w-full">
        <div class="flex-grow">
            <div v-if="editable">
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
                                @click="handleMenuClick(item)"
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

                    <div
                        class="flex items-center flex-none px-2 py-1 align-middle rounded cursor-pointer  bg-primary-light"
                    >
                        <span class="svg-icon">
                            <component
                                :is="announcementObject?.icon"
                                class="w-auto h-4"
                            />
                        </span>

                        <p class="mb-0 ml-2">{{ announcementObject?.label }}</p>
                    </div>
                </a-dropdown>
                <a-input
                    ref="titleBar"
                    v-model:value="announcementHeader"
                    placeholder="Add Announcement Header..."
                    class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
                    :class="$style.titleInput"
                />
                <a-textarea
                    v-model:value="announcementDescription"
                    placeholder="Add description..."
                    class="text-gray-500 border-0 shadow-none outline-none"
                    :maxlength="280"
                    @change="handleTextAreaUpdate"
                />
            </div>
            <div v-else>
                <div v-if="!bannerMessage || bannerMessage === ''">
                    <div
                        class="flex items-center flex-none px-2 py-1 align-middle rounded cursor-pointer  bg-primary-light"
                    >
                        <span class="svg-icon">
                            <component
                                :is="announcementObject?.icon"
                                class="w-auto h-4"
                            />
                        </span>

                        <p class="mb-0 ml-2">{{ announcementObject?.label }}</p>
                    </div>

                    <div
                        class="text-lg font-bold text-gray-500 border-0 shadow-none outline-none "
                    >
                        Add Announcement Header...
                    </div>
                    <div
                        class="text-gray-500 border-0 shadow-none outline-none"
                    >
                        Add description...
                    </div>
                </div>
                <div v-else class="flex items-center">
                    <div>
                        <component
                            :is="announcementObject?.icon"
                            class="w-auto h-4"
                        />
                    </div>
                    <div>
                        <span class="text-lg font-bold text-gray-700"
                            >Announcement Header</span
                        >
                        <span class="text-gray-500">{{ bannerMessage }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="editable" class="flex ml-2">
            <a-button class="mr-2" :loading="isLoading" @click="handleUpdate"
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
        <a-button v-else type="link" class="ml-2 text-sm" @click="startEdit">
            <fa icon="fa pencil" class="mx-2 text-xs" />
            Edit
        </a-button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, Ref, computed, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AnnouncementList from '~/constant/announcement'
    import addAnnouncement from '~/composables/asset/addAnnouncement'

    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const editable = ref(false)
            const announcementHeader = ref('')

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const { asset } = toRefs(props)
            const {
                handleCancel,
                update,
                bannerType,
                bannerMessage,
                isCompleted,
                isLoading,
            } = addAnnouncement(asset)

            const announcementDescription = ref(bannerMessage.value)
            const announcementType = ref(bannerType.value)

            const handleUpdate = () => {
                bannerMessage.value = announcementDescription.value
                bannerType.value = announcementType.value
                editable.value = false
                update()
            }
            const onCancel = () => {
                editable.value = false
                handleCancel()
            }
            const handleTextAreaUpdate = (e: any) => {
                announcementDescription.value = e.target.value
            }

            const announcementObject = computed(() => {
                const found = AnnouncementList.find(
                    (item) => item.id === announcementType.value
                )

                return found
            })

            const startEdit = () => {
                editable.value = true
                titleBar.value?.focus()
            }
            const handleMenuClick = (announcement) => {
                announcementType.value = announcement.id
            }

            return {
                editable,
                AnnouncementList,
                handleUpdate,
                onCancel,
                startEdit,
                announcementHeader,
                announcementDescription,
                handleMenuClick,
                announcementType,
                announcementObject,
                isLoading,
                handleTextAreaUpdate,
                bannerMessage,
                bannerType,
            }
        },
    })
</script>

<style lang="less" module>
    .input {
        :global(.ant-input:focus
                .ant-input:hover
                .ant-input::selection
                .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
    }
    :global(.ant-input::-webkit-input-placeholder) {
        @apply font-bold text-gray-500 !important;
    }
</style>
