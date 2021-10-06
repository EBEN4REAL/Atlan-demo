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
                        v-model:value="assetStatus"
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
            <div class="mb-3">
                <p class="mb-1 text-sm">Certification</p>
                <div class="flex">
                    <div
                        v-if="!assetStatus"
                        class="
                            inline-flex
                            px-1
                            py-1.5
                            mr-5
                            border
                            rounded-md
                            w-60
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
                            assetStatus &&
                            assetStatusObject &&
                            assetStatusObject.icon &&
                            assetStatusObject.label
                        "
                        class="
                            inline-flex
                            px-1
                            py-1.5
                            mr-5
                            border
                            rounded-md
                            w-60
                        "
                    >
                        <component
                            :is="assetStatusObject.icon"
                            class="self-center w-auto h-4 mr-1"
                        />
                        <span class="text-sm">{{
                            assetStatusObject.label
                        }}</span>
                    </div>

                    <div class="text-gray-500">
                        Certifications will be overidden for all selected
                        assets.
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
        const showPopover = ref(false)
        const { handleUpdateStatus } = useBulkSelect()
        const { existingStatus } = toRefs(props)
        const assetStatus = ref('')
        const statusMessage = ref('')
        const textAreaDisabled = ref(false)
        // TODO: this can come from composable itself
        const initialiseAssetStatus = () => {
            const firstStatusKey = Object.keys(existingStatus.value)[0]
            if (
                !Object.keys(existingStatus.value).some(
                    (key) =>
                        existingStatus.value[key] !==
                        existingStatus.value[firstStatusKey]
                )
            )
                assetStatus.value =
                    existingStatus.value[Object.keys(existingStatus.value)[0]]
            else assetStatus.value = ''
        }
        // initialising assetStatus to find if status of all selected assets is same
        watch(existingStatus, initialiseAssetStatus, {
            immediate: true,
            deep: true,
        })

        const assetStatusObject = computed(() =>
            List.find((item) => item.id === assetStatus.value)
        )

        // TODO: add status message flow
        const handleConfirm = () => {
            handleUpdateStatus(
                { status: assetStatus.value, statusMessage: '' },
                updatedStatus,
                existingStatus
            )
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
            assetStatus,
            textAreaDisabled,
            handleCancel,
            handleConfirm,
            assetStatusObject,
            showPopover,
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