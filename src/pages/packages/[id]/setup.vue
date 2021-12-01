<template>
    <div class="flex w-full h-full overflow-x-hidden bg-white">
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
            :sandboxValue="sandbox"
        ></PackagesSetup>
        <div
            class="flex flex-col"
            v-if="sandbox && localConfig"
            style="width: 33%; min-width: 33%"
        >
            <Sandbox
                v-model:configMap="localConfig"
                v-model:workflowTemplate="localSelected"
            ></Sandbox>
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
    import Sandbox from '@/packages/setup/sandbox.vue'
    import { usePackageByName } from '~/composables/package/usePackageByName'
    import { usePackageInfo } from '~/composables/package/usePackageInfo'
    import { useRoute } from 'vue-router'
    import { useConfigMapList } from '~/composables/package/useConfigMapList'

    export default defineComponent({
        name: 'WorkflowSetupPage',
        components: {
            PackagesSetup,
            Loader,
            ErrorView,
            Sandbox,
        },
        props: {
            selectedPackage: {
                type: Object,
                required: false,
            },
        },
        setup(props, { emit }) {
            const route = useRoute()
            const id = computed(() => route?.params?.id || '')
            const { getTemplateName } = usePackageInfo()
            const fetch = ref(true)

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

            const {
                list,
                data,
                isLoading: isLoadingConfigMap,
            } = useConfigMapList({
                dependentKey: ref(true),
                limit: ref(1),
                filter: ref({
                    $or: [
                        {
                            metadata: {
                                $elemMatch: {
                                    labels: {
                                        'com.atlan.orchestration/workflow-template-name': `${id.value}`,
                                    },
                                },
                            },
                        },
                    ],
                }),
            })

            watch(workflowPackage, () => {
                localSelected.value = workflowPackage.value
            })

            watch(data, () => {
                if (list.value.length > 0) {
                    try {
                        localConfig.value = JSON.parse(
                            list.value[0].data.config
                        )

                        // Add Schedule
                    } catch (e) {
                        console.log(e)
                    }
                }
            })

            return {
                localSelected,
                localConfig,
                isLoadingPackage,
                isLoadingConfigMap,
                error,
                sandbox,
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
