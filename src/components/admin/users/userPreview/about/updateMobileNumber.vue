<template>
    <div class>
        <div>
            <div class="flex flex-row items-center cursor-pointer group">
                <p class="mb-0 text-gray-500">
                    Mobile Number
                    <AtlanIcon
                        v-if="updateSuccess"
                        icon="Approve"
                        class="inline-block h-3 mb-1 ml-1 text-success"
                    />
                </p>
                <p
                    v-if="!isUpdate && allowUpdate"
                    class="mb-0 ml-2 text-xs leading-none transition duration-300 ease-in-out delay-100 opacity-0  text-primary group-hover:opacity-100"
                    @click="onUpdate"
                >
                    edit
                </p>
            </div>
            <div v-if="isUpdate" class="flex flex-col">
                <div class="tel-input-custom">
                    <!-- v-model on vue-3-tel-input does not work, we need to handle the 2 way binding by listening to input event manually-->
                    <!-- more context: https://stackoverflow.com/questions/67806831/using-vue3-tel-input-why-v-model-directive-doesnt-work-->

                    <!-- fix me  -->
                    <!-- <vue-tel-input
                        id="tel-input-custom"
                        :value="mobileNumberLocal"
                        valid-characters-only
                        mode="international"
                        validate
                        :input-options="{ showDialCode: true }"
                        @input="onInput"
                    /> -->
                    <a-input-number
                        class="w-full"
                        v-model:value="mobileNumberLocal"
                    />
                </div>
                <div class="flex items-center justify-between max-w-full mt-1">
                    <div>
                        <a-button
                            type="primary"
                            size="small"
                            class="px-2 mr-1"
                            :disabled="updateLoading"
                            @click="handleUpdate"
                            >update</a-button
                        >
                        <a-button
                            type="link"
                            size="small"
                            class="p-0"
                            @click="onCancel"
                            >cancel</a-button
                        >
                    </div>
                    <div>
                        <a-spin v-if="updateLoading" size="small" />
                        <a-popover
                            v-else-if="updateErrorMessage"
                            placement="bottom"
                        >
                            <template #content>{{
                                updateErrorMessage
                            }}</template>
                            <AtlanIcon
                                icon="ExclaimCircle"
                                class="cursor-pointer text-error"
                            ></AtlanIcon>
                        </a-popover>
                    </div>
                </div>
            </div>
            <div
                v-else-if="
                    selectedUser &&
                    selectedUser.attributes &&
                    selectedUser.attributes.mobileNumber &&
                    selectedUser.attributes.mobileNumber[0]
                "
                class="text-gray"
            >
                {{ selectedUser.attributes.mobileNumber[0] || '-' }}
            </div>
            <div v-else class="text-gray">--</div>
        </div>
    </div>
</template>

<script lang="ts">
    // @ts-ignore
    import { defineComponent, ref, watch } from 'vue'
    import { Users } from '~/services/service/users/index'

    export default defineComponent({
        name: 'UpdateMobileNumber',
        components: {},
        props: {
            selectedUser: {
                type: Object,
                default: {},
            },
            allowUpdate: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, context) {
            const isUpdate = ref(false)
            const mobileNumberLocal = ref(
                props?.selectedUser?.attributes?.mobileNumber?.[0] ?? ''
            )
            const updateErrorMessage = ref('')
            const updateSuccess = ref(false)
            const updateLoading = ref(false)
            const onUpdate = () => {
                mobileNumberLocal.value =
                    props?.selectedUser?.attributes?.mobileNumber?.[0] ?? ''
                updateErrorMessage.value = ''
                isUpdate.value = true
            }
            // const onInput = (phone, phoneObject) => {
            //     if (phone && phoneObject?.formatted) {
            //         mobileNumberLocal.value = phoneObject.formatted
            //     } else if (!phone) mobileNumberLocal.value = ''
            // }
            const onCancel = () => {
                mobileNumberLocal.value = ''
                isUpdate.value = false
            }
            const requestPayload = ref()
            const handleUpdate = () => {
                requestPayload.value = {
                    attributes: {
                        mobileNumber: [mobileNumberLocal.value.toString()],
                    },
                }
                updateLoading.value = true
                const { data, isReady, error, isLoading } = Users.UpdateUser(
                    props.selectedUser.id,
                    requestPayload
                )
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        updateLoading.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            // context.emit("updatedUser");
                            updateSuccess.value = true
                            updateErrorMessage.value = ''
                            props.selectedUser.attributes.mobileNumber =
                                mobileNumberLocal.value
                            isUpdate.value = false
                            setTimeout(() => {
                                updateSuccess.value = false
                            }, 1000)
                        } else {
                            updateErrorMessage.value =
                                'Unable to update mobile number, please try again.'
                        }
                    },
                    { immediate: true }
                )
            }
            return {
                updateLoading,
                isUpdate,
                mobileNumberLocal,
                updateErrorMessage,
                updateSuccess,
                onUpdate,
                onCancel,
                handleUpdate,
            }
        },
    })
</script>

<style lang="less">
    #tel-input-custom {
        border: 1px solid #d9d9d9;
        &:focus,
        &:active,
        &:focus-within {
            border-color: #4876d9;
            border-right-width: 1px !important;
            outline: 0;
            box-shadow: 0 0 0 2px rgba(34, 81, 204, 0.2);
        }
        .vti__dropdown {
            outline: none !important;
        }
    }
</style>
