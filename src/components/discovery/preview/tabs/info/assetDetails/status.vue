<template>
    <div class="">
        <a-popover
            v-model:visible="isCompleted"
            class="p-0"
            placement="left"
            trigger="click"
            :class="$style.popover"
        >
            <template #content>
                <div class="flex flex-col" style="width: 300px p-4">
                    <div class="">
                        <a-radio-group
                            v-model:value="statusId"
                            class="w-full mb-3"
                        >
                            <div class="flex flex-col">
                                <a-radio
                                    v-for="item in List"
                                    :key="item.id"
                                    :value="item.id"
                                    class="mb-1"
                                >
                                    <span class="align-middle">
                                        <span class="text-gray-700 svg-icon">
                                            <component
                                                :is="item.icon"
                                                class="w-auto h-4 ml-1 mr-2  pushtop"
                                            />
                                            {{ item.label }}
                                        </span>
                                    </span>
                                </a-radio>
                            </div>
                        </a-radio-group>
                    </div>
                </div>
                <div class="mt-1 border-t border-gray-100">
                    <a-textarea
                        v-model:value="message"
                        placeholder="Add a status message"
                        show-count
                        :maxlength="180"
                        style="width: 280px"
                        :rows="5"
                        class=""
                        @change="handleTextAreaUpdate"
                    ></a-textarea>
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
            <div
                ref="animationPoint"
                class="inline-flex flex-col text-xs text-gray-500 cursor-pointer "
            >
                <p class="mt-1 mb-1.5 text-sm">Status</p>
                <StatusBadge
                    :key="selectedAsset.guid"
                    :status-id="selectedAsset?.attributes?.assetStatus"
                    :status-message="
                        selectedAsset?.attributes?.assetStatusMessage
                    "
                    :show-chip-style-status="true"
                    :show-no-status="true"
                    :show-label="true"
                ></StatusBadge>
            </div>
        </a-popover>
        <div
            v-if="selectedAsset?.attributes?.assetStatusMessage"
            class="px-2 mt-1"
        >
            <p
                v-linkified
                class="mb-0 text-xs font-semibold text-gray-500"
                v-html="statusMessage"
            ></p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, PropType, toRefs, inject } from 'vue'
    import { useMagicKeys } from '@vueuse/core'
    import StatusBadge from '@common/badge/status/index.vue'

    import { List } from '~/constant/status'
    import updateStatus from '~/composables/asset/updateStatus'
    import confetti from '~/utils/confetti'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { StatusBadge },

        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            // const isLoading = ref(false);
            const { selectedAsset } = toRefs(props)

            const {
                handleCancel,
                update,
                isReady,
                state,
                statusId,
                statusMessage,
                isCompleted,
                isLoading,
            } = updateStatus(selectedAsset)

            const mutateSelectedAsset: (updatedAsset: assetInterface) => void =
                inject('mutateSelectedAsset')

            const animationPoint = ref(null)
            const message = ref('')

            const handleUpdate = () => {
                update()
            }
            const handleTextAreaUpdate = (e: any) => {
                statusMessage.value = e.target.value
            }

            watch(isReady, () => {
                if (isReady.value) {
                    if (statusId.value === 'verified') {
                        const config = {
                            angle: 45,
                            startVelocity: 10,
                            spread: 100,
                            elementCount: 50,
                            colors: [
                                '#2251cc',
                                '#2251cc',
                                '#82b54b',
                                '#e94a3f',
                                '#faa040',
                            ],
                            width: '0.3rem',
                            height: '0.3rem',
                        }
                        confetti(animationPoint.value, config)
                    }
                    mutateSelectedAsset(selectedAsset.value)
                }
            })

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
                handleTextAreaUpdate,
                message,
                selectedAsset,
                isReady,
                state,
                statusId,
                statusMessage,
                isCompleted,
                List,
                animationPoint,
                isLoading,
            }
        },
    })
</script>

<style lang="less" module>
    .popover {
        :global(.ant-popover-inner-content) {
            @apply p-4 !important;
        }
    }
</style>
