<template>
    <a-popover title="">
        <template #content>
            <div class="user-popover">
                <div class="flex items-center">
                    <!-- <img :src="logoTitle" class="h-3 mr-1" /> -->
                    <AtlanIcon icon="User" class="mr-1 mb-0.5" />
                    <span class="uppercase">user</span>
                </div>
                <div class="flex items-center gap-3 mt-2">
                    <a-avatar size="large">U</a-avatar>
                    <div>
                        <div class="text-sm font-semibold">{{ name }}</div>
                        <div class="text-xs text-gray-500">@christoph91</div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Ownership</div>
                    <div class="flex gap-5 mt-1">
                        <div><strong>150</strong> Assets</div>
                        <div><strong>20</strong> Business Terms</div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Groups</div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span
                            class="
                                px-2
                                py-0.5
                                text-xs
                                border border-gray-300 border-solid
                                rounded-xl
                            "
                            >Storefront</span
                        >
                        <span
                            class="
                                px-2
                                py-0.5
                                text-xs
                                border border-gray-300 border-solid
                                rounded-xl
                            "
                            >Frontend</span
                        >
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Personas</div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span
                            class="
                                px-2
                                py-0.5
                                text-xs
                                bg-gray-200
                                border border-gray-300 border-solid
                                rounded-xl
                            "
                            >Data Scientist</span
                        >
                    </div>
                </div>
                <router-link :to="path">
                    <a-button class="mt-3" block>
                        <strong> View user profile </strong>
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
    .user-popover {
        width: 370px;
        padding: 16px;
    }
</style>
