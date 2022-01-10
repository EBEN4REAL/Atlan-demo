<template>
    <a-tooltip :placement="placement">
        <template #title>
            <div class="p-2">
                <div
                    class="flex items-center mb-0 text-base"
                    :class="status?.toLowerCase()"
                >
                    <component
                        :is="icon"
                        class="inline-flex self-center w-auto h-5 mr-1 mb-0.5"
                    />
                    <span class="font-semibold tracking-wide">{{
                        status
                    }}</span>
                </div>
                <div class="flex items-center justify-between text-white">
                    <div class="flex text-sm">
                        <div class="mx-1">by {{ username }}</div>
                    </div>

                    {{ timestamp }}
                </div>
            </div>
        </template>
        <component
            :is="icon"
            class="inline-flex self-center w-4 h-4"
            style="min-width: 1rem"
        />
    </a-tooltip>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, computed } from 'vue'
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

            const icon = computed(() => {
                const found = certificateList.find(
                    (item) =>
                        item.id.toLowerCase() === status.value.toLowerCase()
                )
                if (found) {
                    return found.icon
                }

                return ''
            })

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
                color: rgb(4, 165, 128) !important;
            }
        }
        &.draft {
            .ant-tooltip-arrow-content {
                background-color: #ffeec6 !important;
            }
            .ant-tooltip-inner {
                background-color: #ffeec6 !important;
                color: rgb(243, 180, 68) !important;
            }
        }
        &.deprecated {
            .ant-tooltip-arrow-content {
                background-color: #ffd2b8 !important;
            }
            .ant-tooltip-inner {
                background-color: #ffd2b8 !important;
                color: rgb(254, 148, 88) !important;
            }
        }
    }
</style>
