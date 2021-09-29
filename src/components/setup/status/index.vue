<template>
    <div class="px-10 text-center">
        <div class="mb-2">
            <a-spin
                v-if="status === 'loading'"
                size="large"
                class="text-gray-500"
            />
            <fa
                v-else-if="status === 'success'"
                icon="fas check-circle"
                class="text-green-400 text-7xl"
                :class="$style.animatedicon"
            ></fa>
            <fa
                v-else-if="status === 'error'"
                icon="fas exclamation-circle"
                class="text-red-400 text-7xl"
                :class="$style.animatedicon"
            ></fa>
        </div>
        <div class="mt-3">
            <p v-if="status === 'loading'" class="mb-0 text-base text-gray-500">
                Securely saving your credentials, connecting to the source and
                starting your metadata refresh.
            </p>
            <div v-if="status === 'success'">
                <p class="mb-2 text-base text-gray-500">
                    Metadata refresh in progress. You can change the settings
                    anytime in future.
                </p>
                <a-button @click="handleProgress">Track Progress</a-button>
            </div>
            <div v-if="status === 'error'">
                <p class="mb-2 text-base text-red-400">
                    {{ error }}
                </p>
                <a-button @click="handleBack">Go back</a-button>
            </div>
            <!-- <div ref="animationPoint" class="flex items-center mt-2 mb-3">
        <img :src="logo(item)" class="w-auto h-10 mr-2" alt="Image" />

        <a-progress
          :stroke-color="{
            from: '#eee',
            to: '#eee',
          }"
          :show-info="false"
          :percent="0"
          status="active"
        />
        <img class="ml-2" alt="Image" />
      </div> -->
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { Connection } from '~/api/auth/connection'
    import ConnectorMixin from '~/mixins/connector'

    export default defineComponent({
        name: 'SetupResultsView',
        components: {},
        mixins: [ConnectorMixin],
        props: {
            item: {
                type: Object,
                required: false,
                default(): any {
                    return {}
                },
            },
            credential: {
                type: Object,
                required: false,
                default(): any {
                    return {}
                },
            },
            job: {
                type: Object,
                required: false,
                default(): any {
                    return {}
                },
            },
        },
        emits: ['back'],
        data() {
            return {
                status: '',
                error: '',
                guid: '',
            }
        },
        mounted() {
            this.status = 'loading'

            this.handleConnectionSetup()
        },
        methods: {
            handleBack() {
                this.$emit('back')
            },
            handleProgress() {
                this.$router.push(`/connections/${this.guid}`)
            },
            async handleConnectionSetup() {
                try {
                    const resp = await Connection.Setup(
                        {
                            botQualifiedName: this.attributes(this.item)
                                .qualifiedName,
                            connection: {
                                displayName: this.credential.displayName,
                                host: this.credential.host,
                                port: this.credential.port,
                                allowQuery: this.job.allowQuery,
                                allowPreview: this.job.allowPreview,
                                extra: this.credential.extra,
                                previewConfig: {},
                                queryConfig: {},
                            },
                            credential: {
                                authType: this.credential.authType,
                                connType: this.credential.connType,
                                extra: this.credential.extra,
                                login: this.credential.login,
                                password: this.credential.password,
                                database: this.credential.database,
                            },
                            job: {
                                isCron: this.job.isCron,
                                triggerNow: this.job.triggerNow,
                                cronString: this.job.cronString,
                                cronTimezone: this.job.cronTimezone,
                                arguments: this.job.arguments,
                            },
                        },
                        { timeout: 10000 }
                    )
                    this.guid =
                        resp.connection?.guidAssignments[
                            Object.keys(resp.connection?.guidAssignments)[0]
                        ]

                    this.status = 'success'
                } catch (err) {
                    console.log(err)
                    this.status = 'error'
                    if (err?.response?.data) {
                        this.error = `${err?.response?.data?.error}(Code - ${err?.response?.data?.code})`
                    } else {
                        this.error = err
                    }
                }
            },
        },
    })
</script>

<style lang="less" module>
    .animatedicon {
        animation: icon 0.5s cubic-bezier(0.895, 0.03, 0.685, 0.22) forwards;
    }

    @keyframes icon {
        from {
            opacity: 0;
            transform: scale(0.3);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
