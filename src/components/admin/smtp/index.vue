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
                <a-form-item
                    v-for="config in smtp_form"
                    :key="config.id"
                    :required="config.required"
                    :label="config.label"
                    :name="config.id"
                    class="w-full text-gray"
                >
                    <DynamicInput
                        v-model="smtpFormModal[config.id]"
                        :data-type="config.type"
                    />
                </a-form-item>

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
                            @blur="triggerBlur(userFieldRef)"
                        />
                    </a-form-item>

                    <a-form-item label="Password" name="password">
                        <a-input-password
                            v-model:value="password"
                            @change="setPassword"
                        />
                    </a-form-item>
                </div>

                <div class="flex justify-between mt-8">
                    <div class="flex items-center">
                        <a-button
                            variant="sm"
                            class="mr-3 rounded-md ant-btn test-config-button"
                            :loading="testing"
                            @click="test"
                        >
                            <span v-if="testing">Testing Config...</span>
                            <div v-else class="flex items-center">
                                <AtlanIcon icon="Plug" class="mr-1" />
                                Test SMTP Config
                            </div>
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
                                class="mr-2 text-green-600"
                            />
                            Config Saved
                        </div>
                        <div
                            v-else-if="error"
                            class="flex items-center px-3 py-2 mr-3 rounded bg-red-50"
                        >
                            <a-popover trigger="hover" placement="right">
                                <template #content>
                                    <div>{{ errorMessage }}</div>
                                </template>
                                <AtlanIcon
                                    icon="ExclainCircle"
                                    class="mr-2 text-red-600"
                                />
                            </a-popover>
                            <span>Something went wrong</span>
                        </div>
                        <a-button
                            style="width: 150px"
                            class="rounded-md ant-btn ant-btn-primary"
                            :loading="isLoading"
                            @click.prevent="saveSmtpConfig"
                        >
                            <span v-if="isLoading">Saving...</span>
                            <span v-else>Save</span>
                        </a-button>
                    </div>
                </div>
            </a-form>
        </div>
    </DefaultLayout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import DefaultLayout from '@/admin/layout.vue'
    import { useSmtp } from '@/admin/smtp/useSmtp'
    import { smtp_form, rules } from '~/constant/smtp'
    import DynamicInput from '@/common/input/dynamicInput2.vue'

    export default defineComponent({
        name: 'SmtpForm',
        components: { DefaultLayout, DynamicInput },
        setup() {
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
