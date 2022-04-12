<template>
    <div class="flex items-center px-3 py-3 bg-primary-light">
        <div class="px-1 rounded-full wrapper-icon-warning">
            <AtlanIcon icon="WarningIcon" />
        </div>
        <div class="flex-1 ml-2 text-sm text-gray-700">
            There are 5 other policies for same assets {{ listSameAssets }}
        </div>
        <a-popover
            trigger="click"
            placement="bottom"
            :align="{ offset: [115, 0] }"
        >
            <template #content>
                <div class="py-1">
                    <div
                        class="flex items-center px-4 py-3 border-b border-gray-200 w-80"
                    >
                        <div class="flex-1 mr-2">
                            <div
                                class="text-base font-bold truncate text-primary"
                            >
                                Data scientists
                            </div>
                            <div class="flex items-center mt-2">
                                <div
                                    class="flex items-center text-sm text-gray-500"
                                >
                                    <AtlanIcon icon="User" class="mr-1" />
                                    50
                                </div>
                                <div
                                    class="flex items-center ml-4 text-sm text-gray-500"
                                >
                                    <AtlanIcon icon="Group" class="mr-1" />
                                    10
                                </div>
                                <div
                                    class="flex items-center ml-4 text-sm text-gray-500"
                                >
                                    <AtlanIcon icon="Policies" class="mr-1" />
                                    5
                                </div>
                            </div>
                        </div>
                        <AtlanIcon icon="ChevronRight" />
                    </div>
                </div>
            </template>
            <div class="ml-2 text-sm font-bold text-primary">View policies</div>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, computed } from 'vue'

    export default defineComponent({
        name: 'SameAssetPolicy',
        components: {},
        props: {
            assets: {
                type: Array,
                default: () => [],
            },
        },
        emits: ['updateStatus'],
        setup(props, { emit }) {
            const { assets } = toRefs(props)
            const listSameAssets = computed(() => {
                console.log(assets.value, 'shjdgjsdgjhsgdjsgd')
                return assets.value
            })
            return {
                listSameAssets,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped>
    .shadow-box {
        min-width: 145px;
        box-shadow: 0px 9px 32px 0px #0000001f;
    }
    .btn-status {
        height: fit-content !important;
    }
    .clean-input {
        @apply block bg-transparent border-0 shadow-none outline-none;

        &:focus {
            @apply outline-none;
        }
    }
</style>
