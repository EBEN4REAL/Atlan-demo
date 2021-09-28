<template>
    <div class="h-full">
        <div
            v-if="current === 3"
            class="flex items-center justify-center w-full h-full align-middle bg-white "
        >
            <StatusView
                :item="selectedConnector"
                :job="selectedJob"
                :credential="selectedCredential"
                @back="handleError"
            ></StatusView>
        </div>
        <div class="flex w-full h-full bg-transparent">
            <div
                class="flex flex-col hidden p-6 border-r border-gray-200  sm:block"
            >
                <p
                    class="mb-2 text-xs tracking-wide text-gray-500 uppercase cursor-pointer "
                    @click="handleBack"
                >
                    <fa
                        icon="fal chevron-left"
                        class="mr-1 leading-none pushtop"
                    ></fa
                    >Back
                </p>
                <p class="text-2xl font-medium tracking-tight">
                    New Connection
                </p>
                <a-steps
                    v-model:current="current"
                    size="default"
                    direction="vertical"
                    progress-dot
                    class="flex-grow"
                >
                    <a-step
                        class
                        disabled
                        description="Select your connector"
                        @click="handleStepClick(0)"
                    >
                        <template #title>
                            <div class="text-tight">Connectors</div>
                        </template>
                    </a-step>
                    <a-step
                        disabled
                        description="Enter your credentials"
                        @click="handleStepClick(1)"
                    >
                        <template #title>
                            <div class="text-tight">Credential</div>
                        </template>
                    </a-step>
                    <a-step
                        disabled
                        description="One last step"
                        @click="handleStepClick(2)"
                    >
                        <template #title>
                            <div class="text-tight">Settings</div>
                        </template>
                    </a-step>
                </a-steps>
                <div class="p-4 mt-4 bg-gray-100 border rounded-lg">
                    <p class="mb-1 font-semibold tracking-tight">
                        Can't find your favourite connector?
                    </p>
                    <p class="mb-0">Reach us at support@atlan.com.</p>
                </div>
            </div>
            <div class="flex flex-col w-full h-full shadow-md">
                <div
                    v-if="current !== 0"
                    class="px-6 py-4 bg-transparent border-b"
                >
                    <div class="flex items-center justify-between align-middle">
                        <div class="flex items-center align-middle">
                            <div class="flex items-center align-middle">
                                <p
                                    class="px-1 mb-0 mr-2 text-xl leading-none text-gray-500 "
                                    @click="handlePrevious"
                                >
                                    <fa icon="fal chevron-left"></fa>
                                </p>
                                <img
                                    :src="logo(selectedConnector)"
                                    class="w-auto h-8 mr-2"
                                />
                            </div>

                            <div class="flex flex-col">
                                <div class="text-base tracking-wide text-gray">
                                    {{ title(selectedConnector) }}
                                </div>
                            </div>
                        </div>
                        <a
                            :href="supportLink(selectedConnector)"
                            target="_blank"
                            >Need Help?</a
                        >
                    </div>
                </div>

                <div class="h-full overflow-y-auto flew-grow">
                    <keep-alive class="">
                        <ConnectorList
                            v-if="current === 0"
                            @select="handleConnectorSelect"
                        ></ConnectorList>
                        <CredentialForm
                            v-else-if="current === 1"
                            ref="CredentialForm"
                            :key="selectedConnector.guid"
                            class="px-8 py-4"
                            :item="selectedConnector"
                            @verified="handleVerified"
                        ></CredentialForm>
                        <Settings
                            v-else-if="current === 2"
                            ref="settingsView"
                            class="px-8 py-4"
                            :item="selectedConnector"
                            :credential="selectedCredential"
                        ></Settings>
                    </keep-alive>
                </div>

                <div
                    v-if="current !== 0"
                    class="flex justify-between px-8 py-5 align-middle bg-white border-t "
                >
                    <a-button
                        :type="nextType"
                        :loading="loadingNext"
                        class="px-8"
                        @click="handleNext"
                    >
                        {{ nextTitle }}
                        <fa icon="fal chevron-right" class="ml-1"></fa>
                    </a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import CredentialForm from '@/setup/credential/index.vue'
    import ConnectorList from '@/setup/connectors/list.vue'
    import StatusView from '@/setup/status/index.vue'
    import Settings from '@/setup/settings/index.vue'
    import ConnectorMixin from '~/mixins/connector'

    export default defineComponent({
        name: 'Setup',
        components: { ConnectorList, CredentialForm, Settings, StatusView },
        mixins: [ConnectorMixin],
        data() {
            return {
                current: 0,
                selectedConnector: null,
                selectedCredential: null,
                selectedJob: null,
                loadingNext: false,
                nextTitle: 'Test & Continue',
                nextType: 'default',
                loading: false,
                error: '',
            }
        },
        mounted() {},
        methods: {
            handleError() {
                this.current = 2
            },
            handleBack() {
                this.$router.push('/connections')
            },
            handleStepClick(value: number) {
                if (value > this.current) {
                    if (value === 2) {
                        this.handleNext()
                    }
                } else if (value < this.current) {
                    this.current = value
                }
            },
            handleConnectorSelect(item: any) {
                this.selectedConnector = item
                this.current += 1
            },
            handlePrevious() {
                this.current -= 1
                if (this.current === 0) {
                    const query = {}
                    this.$router.replace({ query })
                } else if (this.current === 1) {
                    this.nextTitle = 'Test & Continue'
                    this.nextType = 'default'
                } else if (this.current === 2) {
                    this.nextTitle = 'Setup & Run'
                    this.nextType = 'primary'
                }
            },

            handleVerified(credential) {
                console.log('handleVerified', credential)
                if (credential && this.loadingNext) {
                    this.loadingNext = false
                    this.selectedCredential = credential
                    this.current += 1
                    this.nextTitle = 'Setup & Run'
                    this.nextType = 'primary'
                } else {
                    this.loadingNext = false
                }
            },
            async handleNext() {
                try {
                    if (this.current === 1) {
                        this.loadingNext = true
                        if (this.$refs.CredentialForm) {
                            const res =
                                await this.$refs.CredentialForm.getCredential()
                            if (!res) {
                                this.loadingNext = false
                            }
                        }
                    }
                    if (this.current === 2) {
                        this.loadingNext = true
                        if (this.$refs.settingsView) {
                            this.selectedJob = this.$refs.settingsView.getJob()
                            console.log(this.selectedJob)
                            this.current += 1
                        }
                        this.loadingNext = false
                    }
                } catch (err) {
                    this.loadingNext = false
                }
            },
            handleConnectionSetup() {},
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
