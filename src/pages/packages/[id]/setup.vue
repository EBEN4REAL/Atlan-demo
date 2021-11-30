<template>
    <div class="flex w-full h-full overflow-x-hidden bg-white">
        <PackagesSetup
            v-if="localConfig"
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

    import PackagesSetup from '@/packages/setup/index.vue'
    import { usePackageByName } from '~/composables/package/usePackageByName'
    import { usePackageInfo } from '~/composables/package/usePackageInfo'
    import { useRoute } from 'vue-router'
    import { useConfigMapList } from '~/composables/package/useConfigMapList'

    export default defineComponent({
        name: 'WorkflowSetupPage',
        components: {
            PackagesSetup,
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
            if (getTemplateName(props.selectedPackage)) {
                fetch.value = false
            }

            const localSelected = ref(props.selectedPackage)
            const localConfig = ref(null)
            const { workflowPackage } = usePackageByName(id, fetch.value)

            const { list, data } = useConfigMapList({
                dependentKey: ref(true),
                limit: ref(1),
                filter: ref({
                    $or: [
                        {
                            labels: {
                                $elemMatch: {
                                    'com.atlan.orchestration/workflow-template-name': `${id.value}`,
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
                            list.value[0].configmap.data.config
                        )

                        if (localConfig.value) {
                            localConfig.value['_schedule'] = {
                                type: 'string',
                                ui: {
                                    widget: 'schedule',
                                    label: '',
                                    placeholder: 'Credential Guid',
                                    hidden: false,
                                },
                            }
                        }

                        // Add Schedule
                    } catch (e) {
                        console.log(e)
                    }
                }
            })

            return {
                localSelected,
                localConfig,
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
