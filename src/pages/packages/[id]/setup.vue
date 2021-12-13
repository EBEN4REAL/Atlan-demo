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
    import Preview from '@/packages/setup/preview.vue'
    import Sandbox from '@/packages/setup/sandbox.vue'
    import { usePackageByName } from '~/composables/package/usePackageByName'
    import { usePackageInfo } from '~/composables/package/usePackageInfo'
    import { useRoute } from 'vue-router'
    import { useConfigMapByName } from '~/composables/package/useConfigMapByName'

    export default defineComponent({
        name: 'WorkflowSetupPage',
        components: {
            PackagesSetup,
            Loader,
            ErrorView,
            Sandbox,
            Preview,
        },
        props: {
            selectedPackage: {
                type: Object,
                required: false,
            },
        },
        emits: ['select'],
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

            const { data, isLoading: isLoadingConfigMap } = useConfigMapByName(
                `${id.value}-config`,
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
