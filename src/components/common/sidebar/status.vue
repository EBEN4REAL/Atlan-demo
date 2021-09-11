<template>
    <div class="">
        <a-popover
            v-model:visible="isCompleted"
            class="p-0"
            placement="left"
            trigger="click"
            :destroy-tooltip-on-hide="true"
            :class="$style.popover"
            @visibleChange="handleVisibleChange"
            :destroyTooltipOnHide="true"
        >
            <template #content
                ><a-form
                    ref="statusFormRef"
                    :rules="rules"
                    :model="statusFormState"
                >
                    <div class="flex flex-col" style="width: 300px p-4">
                        <div class="">
                            <a-form-item
                                ref="statusType"
                                name="statusType"
                                class="mb-3"
                            >
                                <a-radio-group
                                    class="w-full"
                                    @change="handleStatusIdUpdate"
                                    v-model:value="statusFormState.statusType"
                                >
                                    <div class="flex flex-col">
                                        <a-radio
                                            v-for="item in List"
                                            :key="item.id"
                                            :value="item.id"
                                            class="mb-1"
                                        >
                                            <span class="align-middle">
                                                <span
                                                    class="text-gray-700  svg-icon"
                                                >
                                                    <component
                                                        :is="item.icon"
                                                        class="w-auto h-4 ml-1 mr-2  pushtop"
                                                    />
                                                    {{ item.label }}
                                                </span>
                                            </span>
                                        </a-radio>
                                    </div>
                                </a-radio-group></a-form-item
                            >
                        </div>
                    </div>
                    <div class="mt-1 border-t border-gray-100">
                        <a-form-item ref="message" name="message">
                            <a-textarea
                                v-model:value="statusFormState.message"
                                placeholder="Add a status message"
                                show-count
                                :maxlength="180"
                                style="width: 280px"
                                :rows="5"
                                class=""
                                @change="handleTextAreaUpdate"
                            ></a-textarea
                        ></a-form-item>
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
                    </div></a-form
                >
            </template>
            <div
                ref="animationPoint"
                class="flex flex-col text-xs text-gray-500 cursor-pointer"
            >
                <div class="mb-3">
                    <p class="mb-1 text-xs">Status</p>
                    <StatusBadge
                        :key="selectedAsset.guid"
                        :status-id="selectedAsset?.attributes?.assetStatus"
                        :status-message="
                            selectedAsset?.attributes?.assetStatusMessage
                        "
                        :show-chip-style-status="true"
                        :statusUpdatedAt="
                            selectedAsset?.attributes?.assetStatusUpdatedAt
                        "
                        :statusUpdatedBy="
                            selectedAsset?.attributes?.assetStatusUpdatedBy
                        "
                        :show-no-status="true"
                        :show-label="true"
                    ></StatusBadge>
                </div>

                <!-- <div
                    v-if="selectedAsset?.attributes?.assetStatusMessage"
                    class=""
                >
                    <p class="mb-1 text-xs">Message</p>
                    <p
                        v-linkified
                        class="mb-0 text-sm text-gray"
                        v-html="statusMessage"
                    ></p>
                </div> -->
            </div>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        PropType,
        toRefs,
        reactive,
    } from 'vue'
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
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            // const isLoading = ref(false);
            const { selectedAsset } = toRefs(props)
            const statusFormRef = ref()

            const statusFormState = reactive({
                message: '',
                statusType: 1,
            })
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

            const animationPoint = ref(null)
            const message = ref(statusMessage.value)

            const rules = {
                statusType: [
                    {
                        required: true,
                        message: 'Please select a status type',
                        trigger: 'change',
                    },
                ],
                message: [
                    {
                        required: true,
                        message: 'Please input a status message',
                        trigger: 'blur',
                    },
                ],
            }
            const handleUpdate = () => {
                statusFormRef.value
                    .validate()
                    .then(() => {
                        update()
                        statusFormRef.value.resetFields()
                    })
                    .catch((err) => {})
            }
            const handleTextAreaUpdate = (e: any) => {
                statusMessage.value = e.target.value
            }
            const handleVisibleChange = () => {
                message.value = statusMessage.value
            }

            const handleStatusIdUpdate = (e: any) => {
                statusId.value = e.target.value
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
                    emit('update:selectedAsset', selectedAsset.value)
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
                handleVisibleChange,
                handleUpdate,
                handleCancel,
                handleTextAreaUpdate,
                handleStatusIdUpdate,
                statusFormState,
                rules,
                isReady,
                state,
                statusId,
                statusMessage,
                isCompleted,
                List,
                animationPoint,
                isLoading,
                statusFormRef,
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
