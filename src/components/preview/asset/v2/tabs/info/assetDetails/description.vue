<template>
    <div class="pt-2 text-xs text-gray-500">
        <p class="mb-1">Description</p>
        <a-popover
            v-model:visible="isCompleted"
            placement="left"
            overlay-class-name="inlinepopover"
            trigger="click"
            @visibleChange="handleVisibleChange"
        >
            <template #content>
                <a-textarea
                    v-model:value="description"
                    autofocus
                    placeholder="Description"
                    :class="$style.borderless"
                    :rows="10"
                    style="width: 300px"
                >
                </a-textarea>
                <div
                    class="flex justify-end p-2 space-x-2 border-t border-gray-100 "
                >
                    <a-button size="small" @click="handleCancel"
                        >Cancel</a-button
                    >
                    <a-button
                        type="primary"
                        size="small"
                        :loading="isLoading"
                        @click="handleUpdate"
                        >Update</a-button
                    >
                </div>
            </template>
            <div class="inline-block text-sm cursor-pointer text-gray">
                <p v-if="description" class="mb-0">
                    {{ description }}
                </p>
                <div v-else>
                    <div
                        class="inline-flex px-2 py-1 rounded cursor-pointer select-none  text-primary hover:text-white hover:bg-primary _bg-primary-light"
                    >
                        <span class="flex items-center text-sm">
                            <fa icon="fal plus" />
                        </span>
                        <span class="ml-2">Add Description</span>
                    </div>
                </div>
            </div>
        </a-popover>
    </div>
    <!-- <div class="w-full pt-2 text-xs text-gray-500">
            <p class="mb-1">Description</p>
            <p class="mb-0 text-sm text-gray">
                Transaction table stores all the information required for a trip
                before an actual trip is created, such as client requirements,
                vendor and truck details a...<span
                    class="ml-2 font-semibold text-primary"
                    >show more</span
                >
            </p>
        </div> -->
</template>

<script lang="ts">
    import {
        defineComponent,
        nextTick,
        ref,
        watch,
        PropType,
        toRefs,
    } from 'vue'
    import { useMagicKeys } from '@vueuse/core'
    import updateDescription from '~/composables/asset/updateDescription'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const {
                isLoading,
                update,
                handleCancel,

                isReady,
                state,
                description,
                isCompleted,
            } = updateDescription(selectedAsset)

            const handleUpdate = () => {
                update()
            }

            const descriptionInput = ref()
            const handleVisibleChange = () => {
                if (descriptionInput?.value) {
                    nextTick(() => {
                        descriptionInput?.value?.$el?.focus()
                    })
                }
            }

            const keys = useMagicKeys()
            const esc = keys.Escape

            watch(esc, (v) => {
                if (v) {
                    handleCancel()
                }
            })
            return {
                handleUpdate,
                handleCancel,
                handleVisibleChange,
                isReady,
                state,
                description,
                isCompleted,
                isLoading,
            }
        },
    })
</script>

<style lang="less" module>
    .borderless {
        @apply border-none shadow-none p-4 !important;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        &:global(.ant-input-affix-wrapper-focused) {
            @apply border-none shadow-none;
        }
    }
</style>
<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
</style>
