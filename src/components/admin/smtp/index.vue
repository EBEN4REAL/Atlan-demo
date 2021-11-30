<template>
    <DefaultLayout title="Configure SMTP">
        <div class="w-2/3 text-gray-600 bg-white rounded smtpForm">
            <a-form
                ref="formRef"
                label-align="left"
                :rules="rules"
                :model="smtpServer"
                :labelCol="{ span: 4 }"
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
                            :loading="testSmtpConfigState === 'TESTING'"
                            @click="testSmtpConfig"
                        >
                            <span v-if="testSmtpConfigState === 'TESTING'"
                                >Testing Config...</span
                            >
                            <div v-else class="flex items-center">
                                <fa
                                    icon="fal plug"
                                    class="mr-1 text-green-600"
                                />
                                Test SMTP Config
                            </div>
                        </a-button>
                        <span
                            v-if="testSmtpConfigState === 'INVALID'"
                            class="flex items-center font-size-sm"
                        >
                            <fa
                                v-if="
                                    testSmtpConfigError ===
                                    'Please re-enter password to test'
                                "
                                icon="fal times"
                                class="ml-2 mr-1 text-red-600"
                            />

                            {{ finalTestSmtpConfigError }}

                            <a-popover trigger="hover" placement="right">
                                <template #content>
                                    <div>{{ testSmtpConfigError }}</div>
                                </template>

                                <fa
                                    v-if="
                                        testSmtpConfigError !==
                                        'Please re-enter password to test'
                                    "
                                    icon="fal info-circle"
                                    class="ml-2 mr-1 text-red-600"
                                />
                            </a-popover>
                        </span>
                        <span
                            v-else-if="testSmtpConfigState === 'VALID'"
                            class="font-size-sm"
                        >
                            <i
                                class="ml-2 mr-1 text-green-600 fal fa-check"
                            ></i>
                            SMTP config is correct
                        </span>
                    </div>
                    <div class="flex">
                        <div
                            v-if="saveSmtpConfigState === 'SUCCESS'"
                            class="flex items-center justify-center px-3 py-2 mr-3 rounded bg-blue-50"
                        >
                            <fa
                                icon="fal check-circle"
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

            return {
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
                testSmtpConfig,
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
