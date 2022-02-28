<template>
    <div class="bg-white rounded">
        <div class="flex items-center justify-between p-4 border-b">
            <div class="flex items-center">
                <AtlanIcon icon="WarningIcon" class="mr-2" />
                <div class="font-semibold text-gray-700">Summary</div>
            </div>
        </div>
        <div class="flex flex-col p-4">
            <div class="mt-1">
                <div class="mb-2.5 text-gray-500">Channels</div>
                <a-popover
                    v-model:visible="showPopover"
                    trigger="click"
                    placement="bottom"
                >
                    <template #content>
                        <div class="p-3 bg-white w-72">
                            <div class="flex">
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
                                    Add
                                </AtlanButton>
                            </div>
                        </div>
                    </template>
                    <span v-if="isLoading">
                        <AtlanIcon
                            icon="CircleLoader"
                            class="h-5 animate-spin"
                        />
                    </span>
                    <span
                        v-if="!isLoading"
                        class="text-sm cursor-pointer text-primary"
                        ><AtlanIcon icon="Add" class="mr-2" />Add link</span
                    >
                </a-popover>
            </div>
            <div class="mt-7">
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
                console.log(link.value, '<<<<<<<<<')
                emit('changeLink', link.value)
            }
            return {
                imageUrl,
                timeStamp,
                showPopover,
                link,
                handleChangeLink,
            }
        },
    })
</script>
<style lang="less"></style>
