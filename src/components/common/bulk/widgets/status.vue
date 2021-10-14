<template>
    <a-popover
        v-model:visible="showPopover"
        class="p-0"
        placement="left"
        trigger="click"
        :class="$style.popover"
        :destroy-tooltip-on-hide="true"
    >
        <template #content>
            <div class="flex flex-col" style="width: 300px p-4">
                <div class="">
                    <a-radio-group
                        v-model:value="certificateStatus"
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
                    v-model:value="statusMessage"
                    placeholder="Add a status message"
                    show-count
                    :maxlength="180"
                    style="width: 280px"
                    :rows="5"
                    class=""
                    :disabled="textAreaDisabled"
                ></a-textarea>
                <div class="flex justify-end w-full mt-4 space-x-4">
                    <a-button class="px-4" @click="handleCancel"
                        >Cancel</a-button
                    >
                    <a-button
                        type="primary"
                        class="px-4"
                        :loading="isLoading"
                        @click="handleConfirm"
                        >Done</a-button
                    >
                </div>
            </div>
        </template>
        <div
            ref="animationPoint"
            class="flex flex-col text-xs text-gray-500 cursor-pointer"
        >
            <div>
                <p class="mb-1 text-sm text-gray mb-2.5">Certification</p>
                <div class="flex">
                    <div
                        v-if="!publishedAssetStatus && !originalAssetStatus"
                        class="
                            inline-flex
                            px-1
                            py-1.5
                            mr-5
                            border
                            rounded-md
                            flex-none
                        "
                    >
                        <AtlanIcon
                            class="self-center mr-1"
                            icon="MultipleStatus"
                        />
                        <span class="text-sm">Multiple certifcations</span>
                    </div>
                    <div
                        v-else-if="
                            publishedAssetStatus &&
                            publishedAssetStatusObject &&
                            publishedAssetStatusObject.icon &&
                            publishedAssetStatusObject.label
                        "
                        class="
                            inline-flex
                            px-2
                            py-1.5
                            mr-5
                            border
                            rounded-md
                            flex-none
                        "
                    >
                        <component
                            :is="publishedAssetStatusObject.icon"
                            class="self-center w-auto h-4 mr-1"
                        />
                        <span class="text-sm">{{
                            publishedAssetStatusObject.label
                        }}</span>
                    </div>

                    <div class="self-center text-gray-500">
                        Certifications will be overidden for all selected
                        assets.
                    </div>
                </div>
                <div
                    v-if="
                        (changeLog &&
                            changeLog.to &&
                            changeLog.from !== changeLog.to) ||
                        changeLog.updatedStatusMessage
                    "
                    class="mt-2.5"
                >
                    <div
                        v-if="
                            changeLog &&
                            changeLog.to &&
                            changeLog.from !== changeLog.to
                        "
                    >
                        Certification changed<span
                            v-if="changeLog.from"
                            class="ml-1"
                            >from
                            <span class="font-bold">{{ changeLog.from }}</span>
                        </span>
                        <span class="ml-1"
                            >to
                            <span class="font-bold">{{
                                changeLog.to
                            }}</span></span
                        >
                    </div>
                    <div v-if="changeLog.updatedStatusMessage" class="mt-1.5">
                        Updated status message
                    </div>
                </div>
            </div>
        </div>
    </a-popover>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, ref, inject, watch } from 'vue'
import useBulkSelect from '~/composables/asset/useBulkSelect'
import { List } from '~/constant/status'
import confetti from '~/utils/confetti'

export default defineComponent({
    name: 'UpdateBulkStatus',
    props: {
        existingStatus: {
            type: Object,
            default: () => {},
        },
    },
    setup(props) {
        /** INJECTIONS */
        const updatedStatus = inject('updatedStatus')
        const updatedStatusMessage = inject('updatedStatusMessage')
        const publishedStatusChangeLogRef = inject(
            'publishedStatusChangeLogRef'
        )
        const showPopover = ref(false)
        const { handleUpdateStatus } = useBulkSelect()
        const { existingStatus } = toRefs(props)
        const certificateStatus = ref('')
        const publishedAssetStatus = ref('')
        const originalAssetStatus = ref('')
        // has labels for to and from states 👇
        const changeLog = ref({
            to: '',
            from: '',
            updatedStatusMessage: '',
        })
        const statusMessage = ref('')
        const textAreaDisabled = ref(false)
        const animationPoint = ref(null)

        // TODO: this can come from composable itself
        const initialiseAssetStatus = () => {
            const firstStatusKey = Object.keys(existingStatus.value)[0]
            if (
                !Object.keys(existingStatus.value).some(
                    (key) =>
                        existingStatus.value[key] !==
                        existingStatus.value[firstStatusKey]
                )
            ) {
                certificateStatus.value =
                    existingStatus.value[Object.keys(existingStatus.value)[0]]
                originalAssetStatus.value =
                    existingStatus.value[Object.keys(existingStatus.value)[0]]
                publishedAssetStatus.value =
                    existingStatus.value[Object.keys(existingStatus.value)[0]]
            } else {
                certificateStatus.value = ''
                originalAssetStatus.value = ''
                publishedAssetStatus.value = ''
            }
            // reset changelog
            changeLog.value = { to: '', from: '', updatedStatusMessage: '' }
        }
        // initialising certificateStatus to find if status of all selected assets is same
        watch(existingStatus, initialiseAssetStatus, {
            immediate: true,
            deep: true,
        })
        const publishedAssetStatusObject = computed(() =>
            List.find((item) => item.id === publishedAssetStatus.value)
        )
        const originalAssetStatusObject = computed(() =>
            List.find((item) => item.id === originalAssetStatus.value)
        )

        // TODO: add status message flow
        const handleConfirm = () => {
            publishedAssetStatus.value = certificateStatus.value
            changeLog.value.from = originalAssetStatusObject?.value?.label ?? ''
            changeLog.value.to = publishedAssetStatusObject?.value?.label ?? ''
            changeLog.value.updatedStatusMessage = statusMessage.value
            handleUpdateStatus(
                {
                    status: certificateStatus.value,
                    statusMessage: statusMessage.value,
                },
                updatedStatus,
                updatedStatusMessage,
                publishedStatusChangeLogRef,
                changeLog
            )
            // changeLog has labels not ids
            if (
                changeLog.value.to === 'Verified' &&
                changeLog.value.from !== 'Verified'
            ) {
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
            showPopover.value = false
        }
        const handleCancel = () => {
            initialiseAssetStatus()
            statusMessage.value = ''
            showPopover.value = false
        }

        return {
            List,
            statusMessage,
            certificateStatus,
            textAreaDisabled,
            handleCancel,
            handleConfirm,
            publishedAssetStatusObject,
            showPopover,
            publishedAssetStatus,
            originalAssetStatus,
            originalAssetStatusObject,
            changeLog,
            animationPoint,
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
