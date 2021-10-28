<template>
    <a-tooltip
        :placement="placement"
        :overlayClassName="`tooltips-badge ${status?.toLowerCase()}`"
    >
        <template #title>
            <div class="p-2">
                <div class="flex items-center mb-0 text-base text-gray-500">
                    <component
                        :is="icon"
                        class="inline-flex self-center w-auto h-5 mr-1"
                    />
                    {{ status }}
                </div>
                <div class="flex items-center justify-between text-gray-500">
                    <div class="flex text-sm">
                        <!-- <UserAvatar
                            :username="username"
                            style-class="bg-white"
                        ></UserAvatar> -->
                        <div class="ml-1">by {{ username }}</div>
                    </div>
                    {{ timestamp }}
                </div>
            </div>
        </template>
        <component :is="icon" class="inline-flex self-center w-auto h-4 mb-1" />
    </a-tooltip>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import { certificateList } from '~/constant/certification'
    import UserAvatar from '@/common/avatar/user.vue'

    export default defineComponent({
        components: {
            UserAvatar,
        },
        props: {
            status: {
                type: String,
                required: false,
                default: () => '',
            },
            message: {
                type: String,
                required: false,
            },
            username: {
                type: String,
                required: false,
                default: () => '',
            },
            timestamp: {
                type: String,
                required: false,
                default: () => '',
            },
            placement: {
                type: String,
                required: false,
                default: () => 'right',
            },
        },
        setup(props) {
            const { status, placement, username } = toRefs(props)

            const found = certificateList.find(
                (item) => item.id.toLowerCase() === status.value.toLowerCase()
            )

            const icon = ref()
            if (found) {
                icon.value = found.icon
            }

            return { icon, status, placement, username }
        },
    })
</script>

<style lang="less">
    .tooltips-badge {
        .ant-tooltip-inner {
            font-size: 12px;

            color: #3e4359;
            padding: 0;
            border-radius: 8px;

            min-width: 150px;
        }
        .ant-tooltip-arrow {
            @apply hidden !important;
        }

        &.ant-tooltip-placement-right,
        &.ant-tooltip-placement-rightTop,
        &.ant-tooltip-placement-rightBottom {
            padding-left: 4px !important;
        }

        &.verified {
            .ant-tooltip-arrow-content {
                background-color: #eeffef !important;
            }
            .ant-tooltip-inner {
                background-color: #eeffef !important;
            }
        }
        &.draft {
            .ant-tooltip-arrow-content {
                background-color: #ffeec6 !important;
            }
            .ant-tooltip-inner {
                background-color: #ffeec6 !important;
            }
        }
        &.deprecated {
            .ant-tooltip-arrow-content {
                background-color: #ffd2b8 !important;
            }
            .ant-tooltip-inner {
                background-color: #ffd2b8 !important;
            }
        }
    }
</style>
