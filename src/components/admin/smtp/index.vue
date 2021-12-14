<template>
    <DefaultLayout title="Configure SMTP">
        <div class="w-2/3 mt-5 text-gray-600 bg-white rounded smtpForm">
            <a-form
                ref="formRef"
                label-align="left"
                :rules="rules"
                :model="smtpServer"
                :labelCol="{ span: 6 }"
                :wrapper-col="{ span: 18, offset: 4 }"
            >
                <a-form-item
                    v-for="config in smtpConfig"
                    :key="config.id"
                    :required="config.required"
                    :label="config.label"
                    :name="config.id"
                    class="w-full text-gray"
                >
                    <a-switch
                        v-if="config.type === 'switch'"
                        :key="config.id"
                        :checked="smtpServer[config.id] === 'true'"
                        size="small"
                        @change="
                            (checked) =>
                                updateSmtpProperty(
                                    config.id,
                                    checked.toString()
                                )
                        "
                    />
                    <a-input
                        v-else
                        :key="config.id"
                        v-model:value="smtpServer[config.id]"
                        :type="config.type"
                        :placeholder="config.placeholder"
                        :default-value="smtpServer[config.id]"
                        @input="
                            updateSmtpProperty(config.id, $event.target.value)
                        "
                    />
                </a-form-item>

                <div v-if="smtpServer.auth === 'true'">
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
                            v-model:value="smtpServer.user"
                            type="text"
                            @blur="triggerBlur(userFieldRef)"
                            @input="
                                updateSmtpProperty('user', $event.target.value)
                            "
                        />
                    </a-form-item>

                    <a-form-item label="Password" name="password">
                        <a-input-password
                            v-model:value="smtpServer.password"
                            :default-value="smtpServer.password"
                            :value="smtpServer.password"
                            @input="
                                updateSmtpProperty(
                                    'password',
                                    $event.target.value
                                )
                            "
                        />
                    </a-form-item>
                </div>

                <div class="flex justify-between mt-8">
                    <div class="flex items-center">
                        <a-button
                            variant="sm"
                            class="mr-3 rounded-md ant-btn test-config-button"
                            :loading="isLoading"
                            @click="test"
                        >
                            <span v-if="isLoading">Testing Config...</span>
                            <div v-else class="flex items-center">
                                <AtlanIcon icon="Plug" class="mr-1" />
                                Test SMTP Config
                            </div>
                        </a-button>
                        <span
                            v-if="error"
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
                                    icon="Info"
                                    v-if="testErrorMessage"
                                    class="ml-2 mr-1 text-red-600"
                                />
                            </a-popover>
                        </span>
                        <span
                            v-else-if="isReady && !error && !isLoading"
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
                            v-if="saveSmtpConfigState === 'SUCCESS'"
                            class="flex items-center justify-center px-3 py-2 mr-3 rounded bg-blue-50"
                        >
                            <AtlanIcon
                                icon="Check"
                                class="mr-2 text-green-600"
                            />
                            Config Saved
                        </div>
                        <div
                            v-else-if="saveSmtpConfigState === 'ERROR'"
                            class="flex items-center px-3 py-2 mr-3 rounded bg-red-50"
                        >
                            <a-popover trigger="hover" placement="right">
                                <template #content>
                                    <div>{{ saveSmtpConfigError }}</div>
                                </template>
                                <fa
                                    icon="fal exclamation-circle"
                                    class="mr-2 text-red-600"
                                />
                            </a-popover>
                            <span>Something went wrong</span>
                        </div>
                        <a-button
                            style="width: 150px"
                            class="rounded-md ant-btn ant-btn-primary"
                            :loading="saveSmtpConfigState === 'SAVING'"
                            @click.prevent="saveSmtpConfig"
                        >
                            <span v-if="saveSmtpConfigState === 'SAVING'"
                                >Saving...</span
                            >
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

    export default defineComponent({
        name: 'SmtpForm',
        components: { DefaultLayout },
        setup() {
            const {
                formRef,
                userFieldRef,
                rules,
                smtpConfig,
                testSmtpConfigState,
                testSmtpConfigError,
                saveSmtpConfigState,
                saveSmtpConfigError,
                passwordReentered,
                updateSmtpProperty,
                testSmtpConfig,
                saveSmtpConfig,
                smtpServer,
                finalTestSmtpConfigError,
                triggerBlur,
            } = useSmtp()

            const {
                data,
                isLoading,
                error,
                isReady,
                mutate: test,
                testErrorMessage,
            } = testSmtpConfig()

            return {
                data,
                testErrorMessage,
                isLoading,
                error,
                isReady,
                test,
                formRef,
                rules,
                userFieldRef,
                smtpConfig,
                testSmtpConfigState,
                testSmtpConfigError,
                saveSmtpConfigState,
                saveSmtpConfigError,
                passwordReentered,
                updateSmtpProperty,
                saveSmtpConfig,
                smtpServer,
                finalTestSmtpConfigError,
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
