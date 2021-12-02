<template>
    <div id="invite-user-modal-content" class="relative flex flex-col p-6">
        <div class="flex items-center mb-4">
            <AtlanIcon :icon="'Slack'" class="h-5 mr-2"></AtlanIcon>
            <h1 class="text-xl font-bold">Slack</h1>
        </div>
        <div v-if="!slackResponse">
            <!-- create app token flow -->
            <div>
                <!-- help content -->
                <div
                    class="flex items-center px-2 py-4 rounded bg-blue-50 mb-7"
                >
                    <AtlanIcon icon="Info" class="mr-2 text-xs text-gray-500" />
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
                        <a
                            class="text-blue-500 cursor-pointer"
                            href="https://docs.atlan.com/integrations/collaboration/slack"
                            target="_blank"
                        >
                            Learn more
                            <AtlanIcon :icon="'ArrowRight'"></AtlanIcon>
                        </a>
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
                            <div class="">Access token</div>
                        </template>
                        <a-input v-model:value="accessToken" />
                    </a-form-item>
                    <a-form-item>
                        <template #label>
                            <div class="">Refresh token</div>
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
                        class="
                            p-0.5
                            border
                            text-white
                            border-success
                            p-3
                            rounded-full
                            h-4
                            w-4
                            bg-success
                            mr-2
                        "
                    ></AtlanIcon>
                    <span>Atlan app created in your Slack workspace</span>
                </div>
                <div class="flex items-center mt-2">
                    <AtlanIcon
                        icon="CheckCurrentColor"
                        class="
                            p-0.5
                            border
                            text-white
                            border-success
                            p-3
                            rounded-full
                            h-4
                            w-4
                            mr-2
                        "
                    ></AtlanIcon>
                    <span class="flex items-center">
                        Install the Atlan app in your Slack workspace.
                        <span
                            class="flex items-center ml-1 text-blue-500 cursor-pointer "
                            @click="openOauthUrl"
                            target="_blank"
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
            <div>
                <a-button class="mr-3 border-0" @click="$emit('close')"
                    >Cancel
                </a-button>
                <a-button
                    :disabled="buttonDisabled"
                    :loading="loading"
                    type="primary"
                    html-type="submit"
                    @click="handleSubmit"
                >
                    {{ buttonCopy }}
                </a-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Integrations } from '~/services/service/integrations'
import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
import SuccessIllustration from '~/assets/images/illustrations/check-success.svg'
import { getSlackInstallUrlState } from '~/composables/integrations/useSlack'
import { useAuthStore } from '~/store/auth'

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

        // computed
        const buttonDisabled = computed(
            () => !(accessToken.value && refreshToken.value)
        )

        const oauthUrl = computed(
            () =>
                `${
                    slackResponse?.value?.oauth_authorize_url
                }&state=${getSlackInstallUrlState(true, authStore.id)}`
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
                // close modal
                // openOauthUrl()
                emit('close')
            } else {
                // send api request
                const body = ref({
                    slackConfigurationToken: accessToken.value,
                    slackRefreshToken: refreshToken.value,
                    atlanDomain: 'beta.atlan.com',
                    baseUrl: 'https://ac96-117-199-197-221.ngrok.io',
                })
                try {
                    loading.value = true
                    const data = await Integrations.CreateSlackApp(body, {})
                    slackResponse.value = data.slackAppResponse
                    loading.value = false
                    console.log('slack create app data', data)
                    // error.value = err
                } catch (err) {
                    loading.value = false
                    error.value = err
                    console.error('error in creating app', err)
                }
            }
        }

        return {
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
    components: { AtlanIcon },
})
</script>

<style lang="less">
</style>
