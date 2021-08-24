<template>
    <div class="mb-4 text-xs text-gray-500">
        <p class="mb-2 text-sm">Description</p>
        <a-popover
            v-model:visible="isCompleted"
            placement="left"
            trigger="click"
            @visibleChange="handleVisibleChange"
        >
            <template #content>
                <div class="">
                    <a-textarea
                        v-model:value="descriptionInput"
                        autofocus
                        placeholder="Add an asset description"
                        show-count
                        :maxlength="140"
                        :rows="4"
                        style="width: 280px"
                        @change="handleTextAreaUpdate"
                    >
                    </a-textarea>
                    <div class="flex justify-end w-full mt-4 space-x-4">
                        <a-button class="px-4" @click="handleCancel"
                            >Cancel</a-button
                        >
                        <a-button
                            type="primary"
                            class="px-4"
                            :loading="isLoading"
                            @click="handleUpdate"
                            >Update</a-button
                        >
                    </div>
                </div>
            </template>
            <div class="inline-block text-sm cursor-pointer text-gray">
                <p v-if="description" class="mb-0">
                    {{ description }}
                </p>
                <div v-else>
                    <div
                        class="
                            flex
                            items-center
                            px-3
                            py-1.5
                            mr-3
                            rounded-full
                            cursor-pointer
                            bg-gray-light
                            text-gray-700
                            hover:bg-primary hover:text-white
                        "
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
    import { useMagicKeys } from '@vueuse/core'
    import {
        defineComponent,
        inject,
        nextTick,
        PropType,
        ref,
        toRefs,
        watch,
    } from 'vue'
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
            const mutateSelectedAsset: (updatedAsset: assetInterface) => void =
                inject('mutateSelectedAsset')

            const handleUpdate = () => {
                update()
            }

            const descriptionInput = ref('')
            const handleVisibleChange = () => {
                if (descriptionInput?.value) {
                    nextTick(() => {
                        descriptionInput?.value?.$el?.focus()
                    })
                }
            }
            const handleTextAreaUpdate = (e: any) => {
                description.value = e.target.value
            }

            const keys = useMagicKeys()
            const esc = keys.Escape

            watch(esc, (v) => {
                if (v) {
                    handleCancel()
                }
            })

            watch(description, () => {
                mutateSelectedAsset(selectedAsset.value)
            })

            return {
                handleTextAreaUpdate,
                handleUpdate,
                handleCancel,
                handleVisibleChange,
                descriptionInput,
                isReady,
                state,
                description,
                isCompleted,
                isLoading,
            }
        },
    })
</script>
