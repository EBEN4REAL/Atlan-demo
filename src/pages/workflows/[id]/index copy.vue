<template>
    <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-4 py-3 border-b">
            <div class="flex items-center">
                <a-button
                    class="px-1 mr-2"
                    @click="handleBack"
                    v-if="mode === 'monitor'"
                >
                    <atlan-icon
                        icon="ArrowRight"
                        class="w-auto h-4 text-gray-500 transform rotate-180"
                    />
                </a-button>
                <div class="flex flex-col">
                    <div class="flex items-center" style="padding-bottom: 1px">
                        <div class="flex items-center justify-between">
                            <div
                                class="flex items-center flex-grow border-gray-200"
                                v-if="workflowPackage?.metadata?.annotations"
                            >
                                <div
                                    class="relative w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
                                >
                                    <img
                                        v-if="
                                            workflowPackage?.metadata
                                                ?.annotations[
                                                'orchestration.atlan.com/icon'
                                            ]
                                        "
                                        class="self-center w-6 h-6"
                                        :src="
                                            workflowPackage?.metadata
                                                ?.annotations[
                                                'orchestration.atlan.com/icon'
                                            ]
                                        "
                                    />
                                    <span
                                        v-else-if="
                                            workflowPackage?.metadata
                                                ?.annotations[
                                                'orchestration.atlan.com/emoji'
                                            ]
                                        "
                                        class="self-center w-6 h-6"
                                    >
                                        {{
                                            workflowPackage?.metadata
                                                ?.annotations[
                                                'orchestration.atlan.com/emoji'
                                            ]
                                        }}</span
                                    >
                                    <span v-else class="self-center w-6 h-6">
                                        {{ '\ud83d\udce6' }}</span
                                    >

                                    <div
                                        v-if="
                                            workflowPackage?.metadata?.labels[
                                                'orchestration.atlan.com/certified'
                                            ] === 'true'
                                        "
                                        class="absolute -right-1 -top-2"
                                    >
                                        <a-tooltip
                                            title="Certified"
                                            placement="left"
                                        >
                                            <AtlanIcon
                                                icon="Verified"
                                                class="ml-1"
                                            ></AtlanIcon>
                                        </a-tooltip>
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <div
                                        class="flex items-center font-semibold leading-none truncate overflow-ellipsis"
                                    >
                                        {{ name(item) }}
                                    </div>

                                    <div
                                        class="flex mt-1 text-gray-500 gap-x-2"
                                    >
                                        <span class="text-gray-500">{{
                                            displayName(
                                                workflowPackage,
                                                name(item)
                                            )
                                        }}</span>
                                        <div class="text-gray-500">
                                            <span
                                                >created
                                                {{
                                                    creationTimestamp(
                                                        item,
                                                        true
                                                    )
                                                }}
                                                ago by
                                                {{
                                                    creatorUsername(item)
                                                }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex gap-x-1" v-if="mode === 'monitor'">
                <a-button @click="toggleMode"> Edit </a-button>
                <a-dropdown>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item key="1">1st item</a-menu-item>
                            <a-menu-item key="2">2nd item</a-menu-item>
                            <a-menu-item key="3">3rd item</a-menu-item>
                        </a-menu>
                    </template>
                    <a-button> Settings </a-button>
                </a-dropdown>
            </div>
            <div class="flex gap-x-1" v-else>
                <a-button @click="toggleMode" type="danger"> Exit </a-button>
            </div>
        </div>

        <MonitorWorkflow
            :workflowName="id"
            v-if="mode === 'monitor'"
        ></MonitorWorkflow>
        <div
            v-if="
                workflowPackage.metadata?.name &&
                configMap.metadata?.name &&
                mode === 'edit'
            "
        >
            <PackagesSetupEdit
                :workflowTemplate="workflowPackage"
                :configMap="localConfigMap"
                :initialValue="initialValue"
            ></PackagesSetupEdit>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, inject, watch } from 'vue'

    import { packageFilters } from '~/constant/filters/packageFilters'
    import PackagesSetupEdit from '@/packages/setup/edit.vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useWorkflowDiscoverList } from '~/composables/package/useWorkflowDiscoverList'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import MonitorWorkflow from '@/workflows/monitor/index.vue'
    import { usePackageByName } from '~/composables/package/usePackageByName'
    import { useConfigMapByName } from '~/composables/package/useConfigMapByName'

    export default defineComponent({
        name: 'PackageDiscovery',
        components: { MonitorWorkflow, PackagesSetupEdit },
        props: {},
        emits: ['setup', 'sandbox', 'select'],
        setup(props, { emit }) {
            const mode = ref('monitor')

            const route = useRoute()
            const { id } = route.params
            const router = useRouter()

            const limit = ref(1)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                name: id,
            })

            const dependentKey = ref('workflow_profile')

            const handlePreview = inject('preview')

            const { isLoading, list, error } = useWorkflowDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                queryText,
                source: ref({}),
            })

            const item = computed(() => {
                if (list.value?.length > 0) {
                    return list.value[0]
                }
                return {}
            })

            const isEdit = ref(null)
            // const workflowTemplate = ref(null)

            const workflowTemplate = computed(() => {
                // console.log('template', item.value)
                return item.value?.metadata?.annotations[
                    'package.argoproj.io/name'
                ]
            })

            const { workflowPackage, mutate, changeName } = usePackageByName(
                workflowTemplate.value,
                false
            )

            const { configMap, changeName: fetchConfig } = useConfigMapByName(
                workflowTemplate.value,
                false
            )

            const localConfigMap = computed(() =>
                JSON.parse(configMap.value?.data?.config)
            )

            const initialValue = computed(() => {
                if (item.value.spec?.templates.length > 0) {
                    if (item.value.spec?.templates[0].dag?.tasks?.length > 0) {
                        const map = {}
                        item.value.spec.templates[0].dag?.tasks[0].arguments?.parameters.forEach(
                            (element) => {
                                map[element.name] = element.value
                            }
                        )
                        return map
                    }
                }

                return {}
            })

            watch(item, () => {
                let workflowTemplateName =
                    item.value?.metadata?.annotations[
                        'package.argoproj.io/name'
                    ]

                if (workflowTemplateName) {
                    changeName(
                        workflowTemplateName
                            .replaceAll('@', '')
                            .replaceAll('/', '-')
                    )
                    fetchConfig(
                        workflowTemplateName
                            .replaceAll('@', '')
                            .replaceAll('/', '-')
                    )
                }
            })

            const handleBack = () => {
                console.log('back')
                router.push('/workflows')
            }

            const toggleMode = () => {
                mode.value = mode.value === 'monitor' ? 'edit' : 'monitor'
            }

            const { name, creationTimestamp, creatorUsername, displayName } =
                useWorkflowInfo()

            return {
                isLoading,
                list,
                id,
                queryText,
                error,
                packageFilters,
                facets,
                item,
                name,
                creationTimestamp,
                handlePreview,
                handleBack,
                router,
                isEdit,
                workflowTemplate,
                mutate,
                changeName,
                workflowPackage,
                fetchConfig,
                configMap,
                localConfigMap,
                initialValue,
                mode,
                toggleMode,
                creatorUsername,
                displayName,
            }
        },
    })
</script>
