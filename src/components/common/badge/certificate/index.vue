<template>
    <a-tooltip
        :placement="placement"
        :overlayClassName="`tooltips-badge ${status?.toLowerCase()}`"
    >
        <template #title>
            <div class="p-2">
                <div class="flex items-center justify-between">
                    <UserAvatar
                        :name="messageBy"
                        style-class="bg-white"
                    ></UserAvatar>
                    {{ messageBy }}
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
            messageBy: {
                type: String,
                required: false,
                default: () => '',
            },
            messageAt: {
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
            const { status, placement, messageBy } = toRefs(props)

            const found = certificateList.find(
                (item) => item.id.toLowerCase() === status.value.toLowerCase()
            )

            const icon = ref()
            if (found) {
                icon.value = found.icon
            }

            return { icon, status, placement, messageBy }
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
