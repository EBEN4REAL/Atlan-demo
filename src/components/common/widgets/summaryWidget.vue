<template>
    <div class="bg-white rounded">
        <div class="flex items-center justify-between p-4 border-b">
            <div class="flex items-center">
                <AtlanIcon icon="WarningIcon" class="mr-2" />
                <div class="font-semibold text-gray-700">Summary</div>
            </div>
        </div>
        <div
            class="p-4 pb-2 mt-1"
            :class="
                item?.attributes?.channelLink &&
                'hover:bg-gray-100 cursor-pointer container-channel'
            "
        >
            <div class="mb-2.5 text-gray-500">Channels</div>
            <a-popover
                v-model:visible="showPopover"
                trigger="click"
                placement="bottom"
            >
                <template #content>
                    <div class="p-3 bg-white w-72">
                        <div class="flex items-center">
                            <div
                                class="flex items-center justify-center w-8 h-8 mr-3 border rounded-full border-primary"
                            >
                                <AtlanIcon icon="Slack" />
                            </div>
                            <!-- <div
                                    class="flex items-center justify-center w-8 h-8 border rounded-full"
                                >
                                    <AtlanIcon icon="Teams" />
                                </div> -->
                            <div
                                v-if="item?.attributes?.channelLink"
                                class="ml-auto text-xs text-gray-500 cursor-pointer"
                                @click="handleRemove"
                            >
                                <AtlanIcon icon="Delete" class="mr-1" />Remove
                            </div>
                        </div>
                        <div class="mt-4 text-sm text-gray-700">
                            Slack Channel
                        </div>
                        <div class="mt-2">
                            <a-input
                                v-model:value="link"
                                placeholder="Paste link to your channel"
                            >
                                <template #prefix>
                                    <AtlanIcon icon="Link" />
                                </template>
                            </a-input>
                        </div>
                        <div class="flex justify-end mt-4">
                            <AtlanButton
                                padding="compact"
                                size="sm"
                                color="minimal"
                                class="mr-2"
                                @click="showPopover = false"
                            >
                                Cancel
                            </AtlanButton>
                            <AtlanButton
                                padding="compact"
                                size="sm"
                                @click="handleChangeLink"
                            >
                                <AtlanIcon icon="Edit" class="mr-1" />
                                {{
                                    item?.attributes?.channelLink
                                        ? 'Edit'
                                        : 'Add'
                                }}
                            </AtlanButton>
                        </div>
                    </div>
                </template>
                <div
                    v-if="item?.attributes?.channelLink && !isLoading"
                    class="flex text-sm text-gray-700"
                >
                    <a-tooltip placement="bottom">
                        <template #title>{{
                            item?.attributes?.channelLink
                        }}</template>
                        <AtlanIcon icon="Slack" />
                        Slack
                    </a-tooltip>
                    <span class="ml-auto text-primary edit-channel">
                        EDIT
                    </span>
                </div>
                <span
                    v-else-if="!isLoading"
                    class="text-sm cursor-pointer text-primary"
                    ><AtlanIcon icon="Add" class="mr-2" />Add link</span
                >
                <span v-if="isLoading">
                    <AtlanIcon icon="CircleLoader" class="h-5 animate-spin" />
                </span>
            </a-popover>
        </div>
        <div class="flex flex-col p-4 pt-0">
            <div class="mt-5">
                <div class="mb-2.5 text-gray-500">Policies</div>
                <a-dropdown trigger="click">
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <div class="flex items-center">
                                    <AtlanIcon
                                        class="w-4 h-4 text-gray-700"
                                        icon="Policies"
                                    />
                                    <span class="pl-2 text-sm"
                                        >Metadata Policy</span
                                    >
                                </div>
                            </a-menu-item>
                            <a-menu-item>
                                <div class="flex items-center">
                                    <AtlanIcon
                                        class="w-4 h-4 text-gray-700"
                                        icon="QueryGrey"
                                    />
                                    <span class="pl-2 text-sm"
                                        >Data Policy</span
                                    >
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                    <span class="text-sm cursor-pointer text-primary">
                        <AtlanIcon icon="Add" class="mr-2" />
                        Add policies
                    </span>
                </a-dropdown>
            </div>
            <div class="mt-7">
                <div class="mb-2.5 text-gray-500">Created by</div>
                <div class="flex items-center">
                    <Avatar
                        :allow-upload="false"
                        :avatar-size="16"
                        :avatar-shape="'circle'"
                        class="mr-2"
                    />
                    {{ item.createdBy }}
                    <div class="mx-1 mt-1 text-gray-300">•</div>
                    <div class="text-sm text-gray-500">
                        {{ timeStamp(item.createdAt) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import Avatar from '~/components/common/avatar/index.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { IPersona } from '~/types/accessPolicies/personas'
    import { IPurpose } from '~/types/accessPolicies/purposes'
    import { formatDateTime } from '~/utils/date'
    import AtlanBtn from '@/UI/button.vue'

    interface IItem {
        createdAt?: string
        createdBy?: string
        description?: string
        name?: string
    }

    export default defineComponent({
        name: 'SummaryWidget',
        components: { Avatar, PopOverUser, AtlanBtn },
        props: {
            isLoading: {
                type: Boolean,
                default: false,
                required: false,
            },
            item: {
                type:
                    (Object as PropType<IPersona>) ||
                    (Object as PropType<IPurpose>) ||
                    (Object as IItem),
                required: true,
            },
        },
        emits: ['changeLink'],
        setup(props, { emit }) {
            const link = ref('')
            const showPopover = ref(false)
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            const timeStamp = (time, raw: boolean = false) => {
                if (time) {
                    return raw
                        ? formatDateTime(time) || 'N/A'
                        : useTimeAgo(time).value
                }
                return ''
            }
            const handleChangeLink = () => {
                showPopover.value = false
                emit('changeLink', link.value)
            }
            const handleRemove = () => {
                showPopover.value = false
                emit('changeLink', '')
                link.value = ''
            }
            return {
                imageUrl,
                timeStamp,
                showPopover,
                link,
                handleChangeLink,
                handleRemove,
            }
        },
    })
</script>
<style lang="less">
    .container-channel {
        .edit-channel {
            display: none;
        }
        :hover {
            .edit-channel {
                display: flex;
            }
        }
    }
</style>
