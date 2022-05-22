<template>
    <a-popover placement="bottomLeft">
        <template #content>
            <div class="flex flex-col w-80">
                <div class="px-4 py-2.5">
                    <AtlanIcon
                        icon="Trident"
                        class="text-sm text-yellow-500 mb-0.5 mr-1"
                    ></AtlanIcon>
                    <span class="mr-1 font-bold text-new-gray-600">
                        {{
                            list.length > 1 ? 'Suggestions' : 'Suggestion'
                        }}</span
                    ><AtlanIcon
                        icon="Info"
                        class="text-sm text-new-gray-600 mb-0.5"
                    ></AtlanIcon>
                </div>
                <div
                    v-for="(item, index) in list"
                    :key="index"
                    class="flex items-center justify-between px-4 py-3 border-t hover:bg-primary-light border-new-gray-200 gap-x-3"
                    style="min-height: 64px"
                    @mouseenter="showApplyButton = index"
                    @mouseleave="showApplyButton = -1"
                >
                    <div class="text-new-gray-700">
                        {{ item?.key }}
                    </div>

                    <a-button
                        v-if="editPermission && showApplyButton === index"
                        class="flex items-center justify-center p-2"
                        @click="handleApply(item?.key)"
                    >
                        <AtlanIcon
                            class="w-auto h-4 approved-icon text-success"
                            icon="CheckCurrentColor"
                    /></a-button>
                </div>
            </div>
        </template>
        <div class="border-b border-gray-300 border-dashed cursor-pointer">
            <AtlanIcon
                icon="Trident"
                class="text-sm text-yellow-500 mb-0.5 mr-1"
            ></AtlanIcon>
            <span class="text-new-gray-700"
                >{{ list.length }}
                {{ list.length > 1 ? 'suggestions' : 'suggestion' }}
                available</span
            >
        </div>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType } from 'vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            list: {
                type: Array,
                required: -1,
                default() {
                    return []
                },
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            asset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['apply'],
        setup(props, { emit }) {
            const { asset } = toRefs(props)

            const showApplyButton = ref(-1)

            const handleApply = (key) => {
                emit('apply', {
                    key: 'description',
                    value: key,
                })
                const properties = {
                    asset_type: asset.value?.typeName,
                }
                useAddEvent(
                    'discovery',
                    'metadata',
                    'suggestion_applied',
                    properties
                )
            }

            return {
                handleApply,
                showApplyButton,
            }
        },
    })
</script>

<style lang="less" scoped>
    .approved-icon {
        transform: scale(1.1);
    }

    :global(.ant-popover) {
        @apply rounded-lg !important;
    }
    :global(.ant-popover-inner) {
        @apply rounded-lg !important;
    }
</style>
