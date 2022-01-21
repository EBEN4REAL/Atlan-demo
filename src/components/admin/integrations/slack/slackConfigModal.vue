<template>
    <div class="relative flex flex-col">
        <header class="flex items-center pl-6 border-b" style="height: 68px">
            <AtlanIcon :icon="'Slack'" class="h-6 mr-2" />
            <h1 class="text-xl font-bold">Add to Slack</h1>
        </header>
        <section
            class="flex justify-between p-8 gap-x-10"
            style="min-height: 268px"
        >
            <nav class="space-y-8">
                <div
                    style="width: 161px"
                    class="relative step_completed flex flex-col py-2 pl-3 border rounded-lg gap-y-0.5 h-14 step"
                    :class="
                        currentStep === 1 ? 'current_step' : 'inactive_step'
                    "
                    data-step="1"
                >
                    <div
                        v-if="currentStep > 1"
                        style="top: -8px; left: -8px"
                        class="absolute flex items-center justify-center w-5 h-5 rounded-full bg-success"
                    >
                        <AtlanIcon icon="Check" class="text-success" />
                    </div>
                    <span
                        class="font-bold"
                        :class="currentStep !== 1 ? '' : 'text-primary'"
                    >
                        Create Atlan App
                    </span>
                    <span class="text-xs text-gray-500">
                        Add configuration tokens
                    </span>
                </div>
                <div
                    style="width: 161px"
                    class="relative flex gap-y-0.5 flex-col py-2 pl-3 border rounded-lg h-14 step"
                    :class="currentStep === 2 ? 'current_step' : 'bg-gray-100'"
                    data-step="2"
                >
                    <div
                        v-if="currentStep > 2"
                        style="top: -8px; left: -8px"
                        class="absolute flex items-center justify-center w-5 h-5 rounded-full bg-success"
                    >
                        <AtlanIcon icon="Check" class="text-success" />
                    </div>
                    <span class="font-bold text-gray-500">Install</span>
                    <span class="text-xs text-gray-500">Install Slack app</span>
                </div>
            </nav>
            <main class="flex-grow space-y-9">
                <div class="flex justify-between">
                    <div class="flex flex-col gap-y-1">
                        <span class="text-lg font-bold">
                            Generate a configuration token
                        </span>
                        <span class="text-xs text-gray-500">
                            Need help locating this?
                            <router-link
                                class="text-blue-500 cursor-pointer hover:underline"
                                to="//api.slack.com/apps"
                                replace
                                target="_blank"
                            >
                                Here’s where to find it
                            </router-link>
                        </span>
                    </div>
                    <Button color="secondary" size="sm" padding="compact">
                        Learn More
                    </Button>
                </div>
                <div class="">
                    <a-form
                        ref="form"
                        label-align="left"
                        :colon="false"
                        layout="vertical"
                    >
                        <a-form-item required>
                            <template #label>
                                <span class="">Access token</span>
                            </template>
                            <a-input v-model:value="accessToken" />
                        </a-form-item>
                        <a-form-item required>
                            <template #label>
                                <span class="">Refresh token</span>
                            </template>
                            <a-input v-model:value="refreshToken" />
                        </a-form-item>
                    </a-form>
                </div>
            </main>
        </section>
        <footer>
            <div class="flex justify-end px-6 py-6 border-t">
                <div class="flex items-center">
                    <a-button class="mr-3 border-0" @click="$emit('close')"
                        >Cancel
                    </a-button>
                    <Button
                        :disabled="buttonDisabled"
                        :loading="loading"
                        type="primary"
                        html-type="submit"
                        @click="handleSubmit"
                    >
                        {{ buttonCopy }}
                    </Button>
                </div>
            </div>
        </footer>

        <template v-if="false">
            <div v-if="!slackResponse">
                <!-- create app token flow -->
                <div>
                    <!-- help content -->
                    <div
                        class="flex items-center px-2 py-4 rounded bg-blue-50 mb-7"
                    >
                        <AtlanIcon
                            icon="Info"
                            class="mr-2 text-xs text-gray-500"
                        />
                        <div>
                            <span class="mr-1">
                                Generate a configuration token from
                                <a
                                    class="text-blue-500 cursor-pointer"
                                    href="https://api.slack.com/apps"
                                    target="_blank"
                                >
                                    here</a
                                >
                            </span>
                        </div>
                    </div>
                </div>
                <div class="">
                    <a-form
                        ref="form"
                        label-align="left"
                        :colon="false"
                        layout="vertical"
                    >
                        <a-form-item>
                            <template #label>
                                <span class="font-bold">Access token</span>
                            </template>
                            <a-input v-model:value="accessToken" />
                        </a-form-item>
                        <a-form-item>
                            <template #label>
                                <span class="font-bold">Refresh token</span>
                            </template>
                            <a-input v-model:value="refreshToken" />
                        </a-form-item>
                    </a-form>
                </div>
            </div>
            <div v-else class="mb-4">
                <!-- install app flow -->
                <div class="flex flex-col">
                    <div class="flex items-center">
                        <AtlanIcon
                            icon="CheckCurrentColor"
                            class="p-0.5 border text-white border-success p-3 rounded-full h-4 w-4 bg-success mr-2"
                        ></AtlanIcon>
                        <span>Atlan app created in your Slack workspace</span>
                    </div>
                    <div class="flex items-center mt-2">
                        <AtlanIcon
                            icon="CheckCurrentColor"
                            class="p-0.5 border text-white border-success p-3 rounded-full h-4 w-4 mr-2"
                        ></AtlanIcon>
                        <span class="flex items-center">
                            Install the Atlan app in your Slack workspace.
                            <span
                                class="flex items-center ml-1 text-blue-500 cursor-pointer"
                                target="_blank"
                                @click="openOauthUrl"
                            >
                                Install now<AtlanIcon
                                    :icon="'ArrowRight'"
                                ></AtlanIcon> </span
                        ></span>
                    </div>

                    <!-- <component
                    :is="SuccessIllustration"
                    class="w-5 h-5"
                ></component> -->
                </div>
            </div>
            <div class="flex justify-end">
                <div class="flex items-center">
                    <a-button class="mr-3 border-0" @click="$emit('close')"
                        >Cancel
                    </a-button>
                    <Button
                        :disabled="buttonDisabled"
                        :loading="loading"
                        type="primary"
                        html-type="submit"
                        @click="handleSubmit"
                    >
                        {{ buttonCopy }}
                    </Button>
                </div>
            </div>
        </template>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import { message } from 'ant-design-vue'
    import { Integrations } from '~/services/service/integrations'
    import SuccessIllustration from '~/assets/images/illustrations/check-success.svg'
    import { getSlackInstallUrlState } from '~/composables/integrations/useSlack'
    import { useAuthStore } from '~/store/auth'
    import useIntegration from '~/composables/integrations/useIntegrations'

    export default defineComponent({
        name: 'SlackConfigModal',
        emits: ['close', 'handleInviteSent'],
        setup(props, { emit }) {
            // stores
            const authStore = useAuthStore()

            // variables
            const loading = ref(false)
            const error = ref(null)
            const slackResponse = ref(null)
            const accessToken = ref('')
            const refreshToken = ref('')
            const currentStep = ref(2)

            // computed
            const buttonDisabled = computed(
                () => !(accessToken.value && refreshToken.value)
            )

            const oauthUrl = computed(
                () =>
                    `${
                        slackResponse?.value?.oauth_authorize_url
                    }&state=${getSlackInstallUrlState(true)}`
            )

            const buttonCopy = computed(() => {
                if (slackResponse.value) {
                    return 'Done'
                }
                return 'Next'
            })
            // methods

            const openOauthUrl = () => {
                window.open(oauthUrl.value)
            }

            const handleSubmit = async () => {
                if (slackResponse.value) {
                    emit('close')
                } else {
                    // send api request
                    const body = ref({
                        slackConfigurationToken: accessToken.value,
                        slackRefreshToken: refreshToken.value,
                        atlanDomain: 'beta.atlan.com',
                        // baseUrl: 'https://ac96-117-199-197-221.ngrok.io',
                    })
                    try {
                        loading.value = true
                        const data = await Integrations.CreateSlackApp(body)
                        slackResponse.value = data.slackAppResponse
                        loading.value = false
                        console.log('slack create app data', data)
                        // refresh integrations
                        useIntegration()
                        message.success({
                            content:
                                'Successfully created integration, you can now configure',
                        })
                    } catch (err) {
                        loading.value = false
                        error.value = err
                        console.error('error in creating app', err)
                        message.error({
                            content:
                                'Kindly check your token or contact support',
                        })
                    }
                }
            }

            return {
                currentStep,
                loading,
                handleSubmit,
                accessToken,
                refreshToken,
                buttonDisabled,
                slackResponse,
                SuccessIllustration,
                oauthUrl,
                buttonCopy,
                openOauthUrl,
            }
        },
        data() {
            return {
                showDefaultGroups: false,
            }
        },
    })
</script>

<style lang="less">
    .step::before {
        content: attr(data-step);
        position: absolute;
        @apply bg-gray-300 text-gray-500 rounded-full h-5 w-5 flex items-center text-center justify-center;
        top: -8px;
        left: -8px;
    }
    .current_step::before {
        @apply bg-primary text-white;
    }
    .inactive_step {
        @apply bg-gray-100;
    }
</style>
