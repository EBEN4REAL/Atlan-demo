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
                        v-if="tenantSlackStatus.created"
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
                        v-if="tenantSlackStatus.configured"
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
                <template v-if="currentStep === 1">
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
                </template>
                <template v-if="currentStep === 2">
                    <div
                        style="width: 435px"
                        class="flex items-center px-2.5 bg-gray-100 border border-gray-200 rounded gap-x-2 h-11"
                    >
                        <AtlanIcon icon="Atlan" class="h-5" />
                        <span>Atlan app created</span>
                        <div class="flex-grow" />
                        <span
                            class="text-red-500 cursor-pointer"
                            @click="handleReconfigure"
                            >Reconfigure</span
                        >
                    </div>
                    <div class="space-y-5">
                        <h3 class="font-bold text-gray-700">
                            Install the Atlan app in your Slack workspace
                        </h3>
                        <span class="text-xs text-gray-500"
                            >Install now or complete configuration later</span
                        >
                        <div class="">
                            <div
                                v-if="tenantSlackStatus.configured"
                                class="flex items-center justify-center text-gray-500 border rounded cursor-not-allowed h-9 w-28"
                            >
                                Installed
                            </div>
                            <Button
                                v-else
                                class="text-primary"
                                color="secondary"
                                size="lg"
                                padding="compact"
                                @click="
                                    () =>
                                        openSlackOAuth({
                                            tenant: true,
                                            emit: $emit,
                                        })
                                "
                            >
                                Install now
                                <AtlanIcon :icon="'ArrowRight'" />
                            </Button>
                        </div>
                    </div>
                </template>
            </main>
        </section>
        <footer>
            <div class="flex justify-end px-6 py-6 border-t">
                <div v-if="tenantSlackStatus.configured" class="">
                    <Button color="secondary">Close</Button>
                </div>
                <div v-else class="flex items-center">
                    <a-button class="mr-3 border-0" @click="$emit('close')"
                        >Cancel
                    </a-button>
                    <Button
                        :disabled="buttonDisabled"
                        :loading="isLoading"
                        type="primary"
                        html-type="submit"
                        @click="next"
                    >
                        {{ buttonCopy }}
                    </Button>
                </div>
            </div>
        </footer>
    </div>
</template>
<script lang="ts">
    import { defineComponent, ref, computed, toRefs, watch } from 'vue'
    import isForced from 'splitpanes'
    import SuccessIllustration from '~/assets/images/illustrations/check-success.svg'
    import {
        archiveSlack,
        createApp,
        openSlackOAuth,
    } from '~/composables/integrations/useSlack'
    import { useAuthStore } from '~/store/auth'
    import useIntegration from '~/composables/integrations/useIntegrations'
    import integrationStore from '~/store/integrations/index'

    export default defineComponent({
        name: 'SlackConfigModal',
        emits: ['close', 'handleInviteSent'],
        setup(props, { emit }) {
            // stores
            const store = integrationStore()

            const { tenantSlackStatus } = toRefs(store)

            // variables
            const accessToken = ref(
                'xoxe.xoxp-1-Mi0yLTI5NzE0NjYxMTg2MjQtMjk0MTA1MjcyOTMzNC0yOTUwMDM2OTE0Mjc2LTI5OTIwMDk5Njc1MzktZDEwYWE2YTFiMmY3MjllMDNiOGFiOGY5OWYyYzE1ZTQzN2E1NGE5ZjAzOTJlNmQzNDQ1YmY4MWY2MzVmZGFlZg'
            )
            const refreshToken = ref(
                'xoxe-1-My0xLTI5NzE0NjYxMTg2MjQtMjk1MDAzNjkxNDI3Ni0yOTg1MzAzNDk1MTEwLWUxNzYzODEwZGVjYTQwY2UzMmRhZDRjNThiNGJjMzI4YjNlOWIwMDQzOTYyNDU4M2M5N2QwNDdlNWJmYjgxMzM'
            )

            const currentStep = ref(tenantSlackStatus.value.created ? 2 : 1)

            // watch(tenantSlackStatus, (v) => {
            //     if (v.created) currentStep.value = 2
            // })

            // computed
            const buttonDisabled = computed(
                () => !(accessToken.value && refreshToken.value)
            )

            const buttonCopy = computed(() => {
                if (currentStep.value === 1) return 'Next'
                return 'Done'
            })
            // methods

            const body = computed(() => ({
                slackConfigurationToken: accessToken.value,
                slackRefreshToken: refreshToken.value,
                atlanDomain: 'beta.atlan.com',
            }))

            const { isLoading, data, error, mutate } = createApp(body)
            const next = async () => {
                if (currentStep.value === 1) {
                    await mutate()
                    if (!error.value) currentStep.value += 1
                }
            }

            const pV = computed(() => ({ id: tenantSlackStatus.value.id }))

            const {
                data: d,
                isLoading: l,
                error: e,
                disconnect,
            } = archiveSlack(pV)

            const handleReconfigure = async () => {
                await disconnect()
                if (!e.value) currentStep.value -= 1
            }

            return {
                tenantSlackStatus,
                handleReconfigure,
                disconnect,
                openSlackOAuth,
                next,
                currentStep,
                isLoading,
                data,
                error,
                accessToken,
                refreshToken,
                buttonDisabled,
                SuccessIllustration,
                buttonCopy,
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
