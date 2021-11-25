<template>
    <a-popover title="">
        <template #content>
            <div class="groups-popover">
                <div class="flex items-center">
                    <!-- <img :src="logoTitle" class="h-3 mr-1" /> -->
                    <AtlanIcon icon="Group" class="mr-1 mb-0.5" />
                    <span class="uppercase">GROUP</span>
                </div>
                <div class="mt-2">
                    <div class="text-xl font-semibold">Wework Sales staff</div>
                </div>
                <div class="flex items-center">
                    <AtlanIcon icon="User" class="mr-1 icon-blue-color" />
                    <span class="text-xs text-gray-500">13 members</span>
                    <div class="dot" />
                    <span class="text-xs text-gray-500">@ww-sales-staff</span>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Description</div>
                    <div>
                        Sales team collaboarating to gather insights on all
                        company sales data.
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Ownership</div>
                    <div class="flex gap-5 mt-1">
                        <div><strong>1500</strong> Assets</div>
                        <div><strong>200</strong> Business Terms</div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Created by</div>
                    <div class="flex gap-5 mt-1">
                        <UserPill username="user" />
                    </div>
                </div>
                <router-link :to="path">
                    <a-button class="mt-3" block>
                        <strong> View group profile </strong>
                        <AtlanIcon icon="Enter" class="mr-1 mb-0.5" />
                    </a-button>
                </router-link>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { toRefs, computed } from 'vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import UserPill from '@/common/pills/user.vue'

    export default {
        name: 'PopoverAsset',
        components: {
            // UserAvatar,
            ClassificationPill,
            UserPill,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            path: {
                type: String,
                required: false,
                default: '',
            },
            name: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: [],
        setup(props) {
            return {}
        },
    }
</script>
<style lang="less">
    .icon-blue-color {
        path {
            stroke: #5277d7;
        }
    }
</style>
<style lang="less" scoped>
    .groups-popover {
        width: 370px;
        padding: 16px;
    }

    .dot {
        background: #c4c4c4;
        height: 4px;
        width: 4px;
        border-radius: 50%;
        margin: 0 5px;
    }
</style>
