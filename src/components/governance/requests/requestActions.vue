<template>
    <div class="flex items-center gap-x-2">
        <RequestDropdown
            :type="'reject'"
            :is-loading="loading"
            :item-drop-down="'Reject with comment'"
            @submit="(message) => $emit('reject', message || '')"
        >
            <span class="text-red-500"> Reject </span>
        </RequestDropdown>

        <RequestDropdown
            :type="'approve'"
            :is-loading="isApprovalLoading"
            :item-drop-down="'Approve with comment'"
            @submit="(message) => $emit('accept', message || '')"
        >
            <span class="text-green-500"> Approve </span>
        </RequestDropdown>
        <a-popover
            v-if="request?.message"
            trigger="hover"
            placement="bottomRight"
            :align="{ offset: [90, -5] }"
        >
            <template #content>
                <div class="px-2 py-3 comment-delete">
                    <div class="flex">
                        <component :is="iconQuotes" class="mr-2.5" />
                        <p>{{ request?.message }}</p>
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
            <AtlanIcon class="ml-3 message-icon" icon="Message" />
        </a-popover>
        <div v-else class="w-7" />
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
    import RequestDropdown from '~/components/common/dropdown/requestDropdown.vue'

    export default defineComponent({
        name: 'RequestActions',
        components: { AtlanButton, Avatar, UserPiece, RequestDropdown },
        props: {
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
            loading: {
                type: Boolean,
                required: false,
                default: false,
            },
            isApprovalLoading: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['accept', 'reject', 'more'],
        setup(props, { emit }) {
            return {
                iconQuotes,
                atlanLogo,
            }
        },
    })
</script>

<style lang="less">
    .message-icon {
        transform: scale(1.4) !important;
    }
    .btn-actions {
        padding-right: 0px !important;
        .chevron-icon {
            height: 28px;
            // background: red;
            padding-top: 3px;
            padding-right: 7px;
        }
    }
</style>
