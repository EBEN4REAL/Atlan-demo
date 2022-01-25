<template>
    <a-popover
        v-if="request.status === 'approved' && request.approvedBy[0]?.message"
        trigger="hover"
        placement="bottomLeft"
        :align="{ offset: [0] }"
    >
        <template #content>
            <div class="comment-delete">
                <div class="flex">
                    <component :is="iconQuotes" class="mr-4" />
                    <p>{{ request.approvedBy[0]?.message }}</p>
                </div>
                <div class="flex items-center mt-4">
                    <Avatar
                        :allow-upload="false"
                        :avatar-size="16"
                        :avatar-shape="'circle'"
                        class="mr-2"
                    />
                    <span class="text-gray-700">{{ nameUpdater }}</span>
                </div>
            </div>
        </template>
        <AtlanIcon
            class="ml-3 mr-4 text-success check-icon"
            icon="MessageSuccess"
        />
    </a-popover>
    <AtlanIcon
        v-else-if="request.status === 'approved'"
        class="ml-3 mr-4 text-success check-icon"
        icon="Check"
    />
    <AtlanIcon
        v-else-if="
            request.status === 'rejected' && !request.rejectedBy[0].message
        "
        class="ml-3 mr-4 cross-icon"
        icon="CrossCircle"
    />
    <a-popover
        v-else-if="request.status === 'rejected'"
        trigger="hover"
        placement="bottomLeft"
        :align="{ offset: [0] }"
    >
        <template #content>
            <div class="comment-delete">
                <div class="flex">
                    <component :is="iconQuotes" class="mr-4" />
                    <p>{{ request.rejectedBy[0].message }}</p>
                </div>
                <div class="flex items-center mt-4">
                    <Avatar
                        :allow-upload="false"
                        :avatar-size="16"
                        :avatar-shape="'circle'"
                        class="mr-2"
                    />
                    <span class="text-gray-700">{{ nameUpdater }}</span>
                </div>
            </div>
        </template>
        <AtlanIcon class="ml-3 mr-4 message-cross-icon" icon="MessageCross" />
    </a-popover>
    <AtlanIcon
        v-else-if="request.message"
        class="ml-3 mr-4 message-icon"
        icon="Message"
    />
    <div v-else class="w-7" />
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { RequestAttributes } from '~/types/atlas/requests'
    import Avatar from '~/components/common/avatar/index.vue'
    import UserPiece from './pieces/user.vue'
    import iconQuotes from '~/assets/images/icons/Quotes.svg'

    export default defineComponent({
        name: 'IconStatus',
        components: { Avatar, UserPiece },
        props: {
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
            nameUpdater: {
                type: String,
                required: true,
            },
        },
        setup(props, { emit }) {
            return {
                iconQuotes,
            }
        },
    })
</script>

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
