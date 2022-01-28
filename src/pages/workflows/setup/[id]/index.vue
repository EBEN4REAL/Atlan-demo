<template>
    <div class="flex flex-col w-full h-full overflow-hidden bg-white">
        <!--     <div
            class="flex items-center w-full px-6 py-3 text-lg font-semibold text-gray-700 border-b"
        >
            <a-button class="px-1 mr-2" @click="handleBack">
                <atlan-icon
                    icon="ArrowRight"
                    class="w-auto h-4 text-gray-500 transform rotate-180"
                />
            </a-button>

            <div class="flex items-center">
                <div class="flex items-center justify-between">
                    <div
                        class="flex items-center flex-grow border-gray-200"
                        v-if="localSelected?.metadata?.annotations"
                    >
                        <div
                            class="relative w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
                        >
                            <img
                                v-if="
                                    localSelected?.metadata?.annotations[
                                        'orchestration.atlan.com/icon'
                                    ]
                                "
                                class="self-center w-6 h-6"
                                :src="
                                    localSelected?.metadata?.annotations[
                                        'orchestration.atlan.com/icon'
                                    ]
                                "
                            />
                            <span
                                v-else-if="
                                    localSelected?.metadata?.annotations[
                                        'orchestration.atlan.com/emoji'
                                    ]
                                "
                                class="self-center w-6 h-6"
                            >
                                {{
                                    localSelected?.metadata?.annotations[
                                        'orchestration.atlan.com/emoji'
                                    ]
                                }}</span
                            >
                            <span v-else class="self-center w-6 h-6">
                                {{ '\ud83d\udce6' }}</span
                            >

                            <div
                                v-if="
                                    localSelected?.metadata?.labels[
                                        'orchestration.atlan.com/certified'
                                    ] === 'true'
                                "
                                class="absolute -right-1 -top-2"
                            >
                                <a-tooltip title="Certified" placement="left">
                                    <AtlanIcon
                                        icon="Verified"
                                        class="ml-1"
                                    ></AtlanIcon>
                                </a-tooltip>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div
                                class="flex items-center text-base font-semibold leading-none truncate overflow-ellipsis"
                            >
                                {{
                                    localSelected?.metadata?.annotations[
                                        'orchestration.atlan.com/name'
                                    ]
                                }}
                                <a-tooltip
                                    placement="right"
                                    :title="
                                        localSelected?.metadata?.annotations[
                                            'package.argoproj.io/description'
                                        ]
                                    "
                                >
                                    <AtlanIcon
                                        icon="Info"
                                        class="h-3 ml-1"
                                    ></AtlanIcon
                                ></a-tooltip>
                            </div>

                            <div class="flex text-sm text-gray-500">
                                {{
                                    localSelected?.metadata.annotations[
                                        'package.argoproj.io/name'
                                    ]
                                }}
                                ({{
                                    localSelected?.metadata.labels[
                                        'package.argoproj.io/version'
                                    ]
                                }})
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
        <Loader v-if="isLoadingPackage || isLoadingConfigMap"></Loader>
        <div
            v-else-if="!isLoadingPackage && !isLoadingConfigMap && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>
        <div class="flex-1 h-full overflow-hidden" v-else-if="localConfig">
            <PackagesSetup
                :workflowTemplate="localSelected"
                :configMap="localConfig"
            ></PackagesSetup>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        toRefs,
        Ref,
        watch,
        provide,
    } from 'vue'

    import Loader from '@/common/loaders/page.vue'
    import ErrorView from '@common/error/discover.vue'
    import PackagesSetup from '@/packages/setup/index.vue'

    import { usePackageByName } from '~/composables/package/usePackageByName'
    import { usePackageInfo } from '~/composables/package/usePackageInfo'
    import { useRoute, useRouter } from 'vue-router'
    import { useConfigMapByName } from '~/composables/package/useConfigMapByName'
    import { useHead } from '@vueuse/head'

    export default defineComponent({
        name: 'WorkflowSetupPage',
        components: {
            PackagesSetup,
            Loader,
            ErrorView,
        },
        props: {
            selectedPackage: {
                type: Object,
                required: false,
            },
        },
        emits: ['select', 'selectedconfig'],
        setup(props, { emit }) {
            const { getTemplateName } = usePackageInfo()
            const fetch = ref(true)
            const route = useRoute()
            const id = computed(() => route?.params?.id || '')
            const sandbox = computed(() => route?.query?.sandbox || '')

            if (getTemplateName(props.selectedPackage)) {
                fetch.value = false
            }

            const localSelected = ref(props.selectedPackage)

            const localConfig = ref(null)
            const {
                workflowPackage,
                isLoading: isLoadingPackage,
                error,
            } = usePackageByName(id, fetch.value)

            useHead({
                title: computed(
                    () =>
                        localSelected.value?.metadata?.annotations[
                            'orchestration.atlan.com/name'
                        ]
                ),
            })

            const { data, isLoading: isLoadingConfigMap } = useConfigMapByName(
                `${id.value}`,
                true
            )

            watch(workflowPackage, () => {
                localSelected.value = workflowPackage.value
                emit('select', workflowPackage.value)
            })

            watch(data, () => {
                if (data.value.data.config) {
                    try {
                        console.log(data.value.data.config)
                        localConfig.value = JSON.parse(data.value.data.config)
                        emit('selectedconfig', localConfig)
                        // Add Schedule
                    } catch (e) {
                        console.log(e)
                    }
                }
            })

            const router = useRouter()
            const handleBack = () => {
                router.push('/workflows/setup')
            }

            return {
                localSelected,
                localConfig,
                isLoadingPackage,
                isLoadingConfigMap,
                error,
                sandbox,
                router,
                handleBack,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_WORKFLOWTEMPLATE]
</route>
