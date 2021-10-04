<template>
    <div class="flex justify-between w-full">
        <div class="flex-grow">
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

                <AtlanIcon
                    class="pt-1 ml-4 transform -rotate-90"
                    icon="ChevronDown"
                />
                <div class="flex items-center align-middle">
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
            />
        </div>
        <div>
            <div v-if="editable" class="flex align-items-center">
                <a-button class="mr-2" @click="handleUpdate">Update</a-button>

                <a-button
                    type="link"
                    :variant="'btn btn-sm btn-link mb-0 btn-no-focus font-w700 text-gray-300'"
                    :loading="false"
                    :loading-text="'Cancelling...'"
                    @click="handleCancel"
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
    import { defineComponent, ref, PropType, Ref, computed } from 'vue'
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
            const announcementHeader = ref('')
            const announcementDescription = ref('')
            const currentAnnouncement = ref<string | undefined>('information')

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const announcementObject = computed(() => {
                const found = AnnouncementList.find(
                    (item) => item.id === currentAnnouncement.value
                )

                return found
            })

            const handleUpdate = () => {
                editable.value = false
            }

            const handleCancel = () => {
                editable.value = false
            }

            const startEdit = () => {
                editable.value = true
                titleBar.value?.focus()
            }
            const handleMenuClick = (announcement) => {
                currentAnnouncement.value = announcement.id
            }

            return {
                editable,
                AnnouncementList,
                handleUpdate,
                handleCancel,
                startEdit,
                announcementHeader,
                announcementDescription,
                handleMenuClick,
                currentAnnouncement,
                announcementObject,
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
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold  !important;
        }
    }
</style>
