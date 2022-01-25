<template>
    <div class="flex flex-col w-full h-full overflow-x-hidden bg-white">
        <div
            class="flex items-center w-full px-6 py-3 text-lg font-semibold text-gray-700 border-b"
        >
            <a-button class="px-1 mr-2" @click="handleBack">
                <atlan-icon
                    icon="ArrowRight"
                    class="w-auto h-4 text-gray-500 transform rotate-180"
                />
            </a-button>
            New Workflow
        </div>
        <Loader v-if="isLoadingPackage || isLoadingConfigMap"></Loader>
        <div
            v-else-if="!isLoadingPackage && !isLoadingConfigMap && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>

        <PackagesSetup
            v-else-if="localConfig"
            :workflowTemplate="localSelected"
            :configMap="localConfig"
        ></PackagesSetup>
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
