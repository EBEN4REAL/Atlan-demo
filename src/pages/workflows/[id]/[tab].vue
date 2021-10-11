<template>
    <LoadingView v-if="!data?.asset" />
    <ErrorView v-else-if="data?.error" :error="data?.error" />

    <div v-if="data?.asset" class="w-full h-full">
        <div class="flex flex-col">
            <Header class="px-5 pt-3 bg-white" />

            <a-tabs
                :active-key="activeKey"
                :class="$style.profiletab"
                @change="selectTab($event)"
            >
                <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.name">
                    <component
                        :is="tab.component"
                        :key="activeKey || id"
                        :ref="
                            (el) => {
                                refs[tab.id] = el
                            }
                        "
                        :selected-run-id="selectedRunId"
                        class="bg-transparent"
                    ></component>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>
<script lang="ts">
    // Vue
    import {
        computed,
        defineComponent,
        ref,
        defineAsyncComponent,
        watch,
        onMounted,
        provide,
        toRefs,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    // Components
    import LoadingView from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import Header from '@/workflows/profile/header.vue'

    // Composables
    import { useWorkflowByName } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        components: {
            Header,
            LoadingView,
            ErrorView,
            setup: defineAsyncComponent(
                () => import('@/workflows/profile/tabs/setup/index.vue')
            ),
            monitor: defineAsyncComponent(
                () => import('@/workflows/profile/tabs/monitor/index.vue')
            ),

            settings: defineAsyncComponent(
                () => import('@/workflows/profile/tabs/settings/index.vue')
            ),
        },
        props: {
            updateProfile: { type: Boolean, required: true },
            selectedRunId: {
                type: String,
                required: true,
            },
        },
        emits: ['preview'],
        setup(props, context) {
            /** DATA */
            const activeKey = ref(2)
            const data = ref({})
            const refs: { [key: string]: any } = ref({})
            const { updateProfile } = toRefs(props)
            const tabs = [
                {
                    id: 1,
                    name: 'Setup',
                    component: 'setup',
                },
                {
                    id: 2,
                    name: 'Monitor',
                    component: 'monitor',
                },
                {
                    id: 3,
                    name: 'Settings',
                    component: 'settings',
                },
            ]

            /** UTILS */
            const router = useRouter()
            const route = useRoute()

            /** COMPUTED */
            // ! this is actually name
            const id = computed(() => route?.params?.id || '')

            /** METHODS */
            // selectTab
            const selectTab = (val: number) => {
                activeKey.value = val
                const selectedTab = tabs.find((i) => i.id === val)
                router.replace(
                    `/workflows/${id.value}/${selectedTab?.name.toLowerCase()}`
                )
            }

            // handlePreview
            const handlePreview = (item) => {
                context.emit('preview', item)
            }

            // fetch
            const fetch = () => {
                const {
                    workflow: response,
                    error,
                    isLoading,
                } = useWorkflowByName(id.value)

                watch(response, (v) => {
                    data.value.asset = v
                    data.value.error = error.value
                    handlePreview(data.value?.asset)
                })
            }

            /** LIFECYCLES */
            onMounted(async () => {
                await fetch()

                // const tab = route?.params?.tab
                // if (!tab) return
                // const currTab = tabs.find(
                //     (i) => i.name.toLowerCase() === tab.toLowerCase()
                // )
                // activeKey.value = currTab.id
            })

            /** WATCHERS */
            watch(id, () => {
                if (id.value) fetch()
            })
            watch(updateProfile, () => fetch())

            /** PROVIDER */
            provide('assetData', data.value)

            return {
                id,
                activeKey,
                tabs,
                handlePreview,
                refs,
                data,
                selectTab,
            }
        },
    })
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>

<style lang="less" module>
    .profiletab {
        :global(.ant-tabs-tab) {
            padding-left: 2px;
            padding-right: 2px;
            @apply pb-5 mr-5 text-gray-500 text-sm tracking-wide;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-5;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray font-bold;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0 pl-7;
            @apply bg-white;
        }

        :global(.ant-tabs-tabpane) {
            height: 100vh !important;
            // height: calc(100vh - 170px) !important;
            overflow: auto !important;
            @apply pr-0;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 pb-0 !important;
        }
    }
</style>
