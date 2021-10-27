<template>
    <div class="flex flex-col" style="width: 300px p-4">
        <div class="">
            <a-radio-group
                v-model:value="statusType"
                class="w-full mb-3"
                @change="handleStatusRadioUpdate"
            >
                <div class="flex flex-col">
                    <a-radio
                        v-for="item in ListForSidebar"
                        :key="item.id"
                        :value="item.id"
                        class="mb-1"
                    >
                        <span class="align-middle">
                            <span class="text-gray-700 svg-icon">
                                <component
                                    :is="item.icon"
                                    class="w-auto h-4 ml-1 mr-2 pushtop"
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
            placeholder="Add a certification message"
            show-count
            :maxlength="180"
            style="width: 280px"
            :rows="5"
            class=""
            @change="handleTextAreaUpdate"
        ></a-textarea>
        <div class="flex justify-end w-full mt-4 space-x-4">
            <a-button class="px-4" @click="handleCancel">Cancel</a-button>
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

<script lang="ts">
    import { defineComponent, ref, watch, PropType, toRefs } from 'vue'
    import { useMagicKeys } from '@vueuse/core'
    import StatusBadge from '@common/badge/status/index.vue'
    import { ListForSidebar } from '~/constant/status'
    import updateStatus from '~/composables/asset/updateStatus'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'

    export default defineComponent({
        components: { StatusBadge },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
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
            const animationPoint = ref(null)

            const message = ref(statusMessage.value)
            const statusType = ref(statusId.value)

            const handleUpdate = () => {
                statusMessage.value = message.value
                statusId.value = statusType.value

                update()
            }
            const handleTextAreaUpdate = (e: any) => {
                message.value = e.target.value
            }
            const handleStatusRadioUpdate = (e: any) => {
                statusType.value = e.target.value
            }

            watch(isReady, () => {
                if (isReady.value) {
                    if (statusId.value === 'VERIFIED') {
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
                    }
                    // event sent on certificate description
                    if (
                        selectedAsset.value?.typeName === 'AtlasGlossary' ||
                        selectedAsset.value?.typeName === 'AtlasGlossaryTerm' ||
                        selectedAsset.value?.typeName ===
                            'AtlasGlossaryCategory'
                    )
                        useAddEvent(
                            'gtc',
                            'metadata',
                            'certification_updated',
                            {
                                gtc_type:
                                    assetTypeLabel[
                                        selectedAsset.value?.typeName
                                    ],
                            }
                        )
                    else
                        useAddEvent(
                            'discovery',
                            'metadata',
                            'certification_updated',
                            undefined
                        )

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
                handleUpdate,
                handleCancel,
                handleTextAreaUpdate,
                handleStatusRadioUpdate,
                message,
                statusType,
                isReady,
                state,
                statusId,
                statusMessage,
                isCompleted,
                ListForSidebar,
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
