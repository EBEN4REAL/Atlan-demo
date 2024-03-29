<template>
    <DefaultLayout title="Configure SMTP">
        <div class="w-2/3 mt-5 text-gray-600 bg-white rounded smtpForm">
            <a-form
                ref="formRef"
                label-align="left"
                :rules="rules"
                :model="smtpFormModal"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18, offset: 4 }"
            >
                <template v-for="config in smtp_form" :key="config.id">
                    <a-form-item
                        :required="config.required"
                        :label="config.label"
                        :name="config.id"
                        class="w-full text-gray"
                    >
                        <DynamicInput
                            v-model="smtpFormModal[config.id]"
                            :data-type="config.type"
                            @change="disabledSave = false"
                        />
                    </a-form-item>
                </template>

                <div v-if="smtpFormModal.auth">
                    <a-form-item
                        ref="userFieldRef"
                        name="user"
                        label="Username"
                        :rules="{
                            required: true,
                            message: 'Username is required',
                            trigger: 'blur',
                        }"
                    >
                        <a-input
                            v-model:value="smtpFormModal.user"
                            type="text"
                            @change="disabledSave.value = false"
                            @blur="triggerBlur(userFieldRef)"
                        />
                    </a-form-item>

                    <a-form-item name="password">
                        <template #label>
                            Password
                            <a-tooltip
                                title="If this field is left blank, the previously saved password will be used."
                            >
                                <AtlanIcon icon="Info" class="h-3 ml-1" />
                            </a-tooltip>
                        </template>
                        <a-input-password
                            v-model:value="password"
                            @change="handleChangePassword"
                        />
                    </a-form-item>
                </div>

                <div class="flex items-center justify-between h-24">
                    <div class="flex items-center">
                        <a-button
                            variant="sm"
                            class="flex items-center mr-3 rounded-md ant-btn test-config-button h-9"
                            :loading="testing"
                            @click="test"
                        >
                            <span v-if="testing">Testing Config...</span>
                            <span v-else class="flex items-center">
                                Test SMTP Config
                            </span>
                        </a-button>
                        <span
                            v-if="testError"
                            class="flex items-center text-red-600 font-size-sm"
                        >
                            <AtlanIcon
                                icon="Times"
                                class="ml-2 mr-1 text-red-600 mb-0.5"
                            />

                            {{ 'Please check your credentials.' }}

                            <a-popover trigger="hover" placement="top">
                                <template #content>
                                    <div class="p-4">
                                        {{ testErrorMessage }}
                                    </div>
                                </template>

                                <AtlanIcon
                                    v-if="testErrorMessage"
                                    icon="Info"
                                    class="ml-2 mr-1 text-red-600"
                                />
                            </a-popover>
                        </span>
                        <span
                            v-else-if="testDone && !testError && !testing"
                            class="w-11/12 font-size-sm"
                        >
                            <AtlanIcon
                                icon="Check"
                                class="h-4 mb-1 text-green-600"
                            />
                            SMTP config is correct, <br />A test email has been
                            sent to your email ID.
                        </span>
                    </div>
                    <div class="flex">
                        <div
                            v-if="isReady && !error && !isLoading"
                            class="flex items-center justify-center px-3 py-2 mr-3 rounded bg-blue-50"
                        >
                            <AtlanIcon
                                icon="Check"
                                class="flex-none mr-2 text-green-600"
                            />
                            Config Saved
                        </div>
                        <div
                            v-else-if="error"
                            class="flex items-center px-3 py-2 mr-3 rounded bg-red-50"
                        >
                            <a-tooltip trigger="hover" placement="top">
                                <template #title>
                                    <div>Error: {{ errorMessage }}</div>
                                </template>
                                <AtlanIcon
                                    icon="Info"
                                    class="mr-2 text-red-600"
                                />
                            </a-tooltip>
                            <span>Something went wrong</span>
                        </div>
                        <AtlanButton2
                            :disabled="disabledSave"
                            size="large"
                            :loading="isLoading"
                            :label="isLoading ? 'Saving...' : 'Save'"
                            @click.prevent="saveSmtpConfigSave"
                        />
                    </div>
                </div>
            </a-form>
        </div>
    </DefaultLayout>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import DefaultLayout from '@/admin/layout.vue'
    import { useSmtp } from '@/admin/smtp/useSmtp'
    import { smtp_form, rules } from '~/constant/smtp'
    import DynamicInput from '@/common/input/dynamicInput2.vue'

    export default defineComponent({
        name: 'SmtpForm',
        components: { DefaultLayout, DynamicInput },
        setup() {
            const disabledSave = ref(true)
            const {
                data,
                isLoading,
                error,
                errorMessage,
                isReady,
                smtpFormModal,
                formRef,
                userFieldRef,
                testSmtpConfig,
                saveSmtpConfig,
                smtpServer,
                triggerBlur,
                setPassword,
                password,
            } = useSmtp()

            const {
                isLoading: testing,
                error: testError,
                isReady: testDone,
                mutate: test,
                testErrorMessage,
            } = testSmtpConfig()
            const saveSmtpConfigSave = () => {
                saveSmtpConfig(() => {
                    disabledSave.value = true
                })
            }
            const handleChangePassword = () => {
                setPassword()
                disabledSave.value = false
            }
            return {
                testDone,
                setPassword,
                password,
                smtpServer,
                rules,
                smtp_form,
                smtpFormModal,
                data,
                testErrorMessage,
                testing,
                testError,
                isReady,
                test,
                formRef,
                userFieldRef,
                isLoading,
                error,
                errorMessage,
                saveSmtpConfig,
                triggerBlur,
                disabledSave,
                saveSmtpConfigSave,
                handleChangePassword,
            }
        },
    })
</script>

<style lang="less" module>
    :global(.smtpForm .ant-form-item) {
        @apply flex items-center flex-row;
    }
    :global(.smtpForm .ant-form-item-label > label::after) {
        @apply hidden;
    }

    :global(.smtpForm .test-config-button) {
        @apply text-green-500 border-green-500;
    }
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
        @apply hidden;
    }
    // Aesterik in right side
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
        display: inline-block;
        margin-left: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
    }
</style>
