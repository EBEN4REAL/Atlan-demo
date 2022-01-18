<template>
    <div class="flex items-center justify-end gap-x-2">
        <a-popover
            v-if="request.message"
            trigger="hover"
            placement="bottomRight"
            :align="{ offset: [90, -5] }"
        >
            <template #content>
                <div class="comment-delete">
                    <div class="flex">
                        <component :is="iconQuotes" class="mr-4" />
                        <p>{{ request.message }}</p>
                    </div>
                    <div class="flex items-center mt-4">
                        <Avatar
                            :allow-upload="false"
                            :avatar-name="request.created_by_user?.username"
                            :avatar-size="16"
                            :avatar-shape="'circle'"
                            class="mr-2"
                            :image-url="atlanLogo"
                        />
                        <UserPiece
                            :user="request.created_by_user"
                            :is-pill="false"
                            :default-name="'Atlan Bot'"
                        />
                    </div>
                </div>
            </template>
            <AtlanIcon class="mr-3 message-icon" icon="Message" />
        </a-popover>
        <AtlanButton
            color="secondary"
            padding="compact"
            size="sm"
            class="btn-actions"
            @click.stop="handleClickReject"
        >
            <span class="text-red-500"> Reject </span>
            <div class="sparator" />
            <a-dropdown
                v-model:visible="isVisibleReject"
                trigger="click"
                placement="bottomRight"
            >
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1" @click="handleClickReject">
                            Reject
                        </a-menu-item>

                        <a-menu-item
                            key="2"
                            @click="handleClickRejectWithComment"
                        >
                            <a-popover
                                v-model:visible="isVisibleRejectWithComment"
                                trigger="click"
                                placement="bottomRight"
                                :align="{ offset: [15, -70] }"
                            >
                                <template #content>
                                    <div class="comment-delete">
                                        <div class="flex">
                                            <a-textarea
                                                v-model:value="messageReject"
                                                placeholder="Message"
                                                class="border-none"
                                                :rows="2"
                                            />
                                        </div>
                                        <div
                                            class="flex items-center justify-between mt-4"
                                        >
                                            <a-button
                                                class="text-gray-500"
                                                size="small"
                                                type="link"
                                                @click="cancelReject"
                                            >
                                                Cancel
                                            </a-button>
                                            <a-button
                                                size="small"
                                                type="link"
                                                @click="handleReject"
                                            >
                                                Reject
                                            </a-button>
                                        </div>
                                    </div>
                                </template>
                                Reject with comment
                            </a-popover>
                        </a-menu-item>
                    </a-menu>
                </template>
                <!-- @click.stop="$emit('reject')" -->
                <div @click.stop="isVisibleReject = !isVisibleReject">
                    <AtlanIcon icon="ChevronDown" />
                </div>
            </a-dropdown>
        </AtlanButton>
        <AtlanButton
            class="btn-actions"
            color="secondary"
            padding="compact"
            size="sm"
            @click.stop="$emit('accept')"
        >
            <span class="text-green-500"> Approve </span>
            <div class="sparator" />
            <a-dropdown
                v-model:visible="isVisibleApprove"
                trigger="click"
                placement="bottomRight"
            >
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="4" @click="$emit('accept')">
                            Approve
                        </a-menu-item>
                        <a-menu-item
                            key="2"
                            @click="handleClickApproveWithComment"
                        >
                            <a-popover
                                v-model:visible="isVisibleApproveWithComment"
                                trigger="click"
                                placement="bottomRight"
                                :align="{ offset: [15, -70] }"
                            >
                                <template #content>
                                    <div class="comment-delete">
                                        <div class="flex">
                                            <a-textarea
                                                v-model:value="messageApprove"
                                                placeholder="Message"
                                                class="border-none"
                                                :rows="2"
                                            />
                                        </div>
                                        <div
                                            class="flex items-center justify-between mt-4"
                                        >
                                            <a-button
                                                class="text-gray-500"
                                                size="small"
                                                type="link"
                                                @click="cancelApprove"
                                            >
                                                Cancel
                                            </a-button>
                                            <a-button
                                                size="small"
                                                type="link"
                                                :class="'text-primary'"
                                                @click="handleApprove"
                                            >
                                                Approve
                                            </a-button>
                                        </div>
                                    </div>
                                </template>
                                Approve with comment
                            </a-popover>
                        </a-menu-item>
                    </a-menu>
                </template>
                <div @click.stop="isVisibleApprove = !isVisibleApprove">
                    <AtlanIcon icon="ChevronDown" :class="'icon-drop'" />
                </div>
            </a-dropdown>
        </AtlanButton>
        <!-- <AtlanButton
            color="secondary"
            @click.stop="$emit('more')"
            padding="compact"
            size="sm"
            ><template #label><AtlanIcon icon="KebabMenu" /> </template>
        </AtlanButton> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import AtlanButton from '@/UI/button.vue'
    import iconQuotes from '~/assets/images/icons/Quotes.svg'
    import Avatar from '~/components/common/avatar/index.vue'
    import { RequestAttributes } from '~/types/atlas/requests'
    import UserPiece from './pieces/user.vue'
    import atlanLogo from '~/assets/images/atlan-logo.png'

    export default defineComponent({
        name: 'RequestActions',
        components: { AtlanButton, Avatar, UserPiece },
        props: {
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
        },
        emits: ['accept', 'reject', 'more'],
        setup(props, { emit }) {
            const isVisibleReject = ref(false)
            const isVisibleApprove = ref(false)
            const messageReject = ref('')
            const messageApprove = ref('')
            const isVisibleRejectWithComment = ref(false)
            const isVisibleApproveWithComment = ref(false)
            const handleClickReject = () => {
                emit('reject')
                isVisibleReject.value = false
            }
            const handleClickRejectWithComment = () => {
                // emit('reject')
                // isVisibleReject.value = false
                isVisibleRejectWithComment.value = true
                messageReject.value = ''
                setTimeout(() => {
                    isVisibleReject.value = false
                }, 300)
            }
            const cancelReject = () => {
                isVisibleRejectWithComment.value = false
            }
            const handleReject = () => {
                emit('reject', messageReject.value)
            }

            const handleClickApproveWithComment = () => {
                isVisibleApproveWithComment.value = true
                messageReject.value = ''
                setTimeout(() => {
                    isVisibleApprove.value = false
                }, 300)
            }
            const cancelApprove = () => {
                isVisibleApproveWithComment.value = false
            }
            const handleApprove = () => {
                emit('accept', messageApprove.value)
            }
            return {
                isVisibleReject,
                handleClickReject,
                handleClickRejectWithComment,
                isVisibleRejectWithComment,
                iconQuotes,
                isVisibleApprove,
                atlanLogo,
                messageReject,
                cancelReject,
                handleReject,
                isVisibleApproveWithComment,
                handleClickApproveWithComment,
                messageApprove,
                cancelApprove,
                handleApprove,
            }
        },
    })
</script>

<style lang="less">
    .message-icon {
        transform: scale(1.4) !important;
    }
</style>
<style lang="less" scoped>
    .comment-delete {
        // height: 90px;
        width: 200px;
        padding: 12px 12px;
        border-radius: 8px !important;
    }
    .sparator {
        width: 1px;
        height: 60%;
        background: #e6e6eb;
        margin-left: 10px;
    }
    .btn-actions {
        padding-right: 8px !important;
    }
</style>
