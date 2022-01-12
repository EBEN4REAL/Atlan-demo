<template>
    <div class="flex w-full h-full">
        dsadasd
        <!-- <div class="flex flex-col w-full container-workFlow">
            <Header
                :id="id"
                :workflow="data.asset"
                :creator="creator"
                class="px-5 pt-3 bg-white"
                :logo="logo"
                @open-logs="workflowLogsIsOpen = true"
            />
            <a-tabs
                :active-key="activeKey"
                :class="$style.profiletab"
                @change="selectTab($event)"
            >
                <a-tab-pane
                    v-for="t in tabs"
                    :key="t.id"
                    class="tabs-workflow"
                    :tab="t.name"
                >
                    <component
                        :is="t.component"
                        v-if="workflowTemplate"
                        :key="activeKey || id"
                        :ref="
                            (el) => {
                                refs[t.id] = el
                            }
                        "
                        :selected-run-name="selectedRunName"
                        :workflow-template="workflowTemplate"
                        :workflow="id"
                        class="bg-transparent"
                        :selected-dag="selectedDag"
                        :workflow-data="data.asset"
                        :selected-pod="selectedPod"
                        :active-key="activeKey"
                        :form-config="formConfig"
                        :data="data"
                        @change="updateSelected"
                        @openLog="openLog"
                        @setSelectedPod="setSelectedPod"
                        @setSelectedGraph="setSelectedGraph"
                        @set-loading-fetch-pod="setLoadingFetchPod"
                        @handleSetLogo="handleSetLogo"
                    />
                </a-tab-pane>
            </a-tabs>
        </div>
        <div
            v-if="isErrorVisible"
            class="border-l border-gray-300 preview-container"
        >
            <EmptyView
                empty-screen="EmptyDiscover"
                :desc="`Invalid config UI found: ${errorCaptured}`"
                desc-class="w-56 text-center"
            />
        </div>
        <div v-else class="border-l border-gray-300 preview-container">
            <ProfilePreview
                v-if="selected"
                :selected-workflow="selected"
                :selected-dag="selectedDag"
                :form-config="formConfig"
                :loading-fetch-pod="loadingFetchPod"
                @change="selectedRunName = $event"
                @updateSelected="updateSelected"
            />
        </div>

        <WorkflowLogs
            ref="workflowLogs"
            :is-open="workflowLogsIsOpen"
            :selected-pod="selectedPod"
            :selected-graph="selectedGraph"
            @close="workflowLogsIsOpen = false"
        /> -->
    </div>
</template>
<script lang="ts">
    // Vue
    // import {
    //     computed,
    //     defineComponent,
    //     ref,
    //     defineAsyncComponent,
    //     watch,
    //     onMounted,
    //     provide,
    //     ComputedRef,
    // } from 'vue'
    // import { useRoute, useRouter } from 'vue-router'

    // // Components
    // import LoadingView from '@common/loaders/section.vue'
    // import ErrorView from '@common/error/index.vue'
    // import EmptyView from '@common/empty/index.vue'
    // import { storeToRefs } from 'pinia'
    // import ProfilePreview from '@/workflows/profile/preview/preview.vue'
    // import Header from '@/workflows/profile/header.vue'
    // import { useUsers } from '~/composables/user/useUsers'

    // // Composables
    // import {
    //     useWorkflowByName,
    //     getWorkflowConfigMapByName,
    // } from '~/composables/workflow/useWorkflowList'

    // import useWorkflowStore from '~/store/workflows'

    export default defineComponent({
        components: {},
        props: {},
        emits: ['preview'],
        setup(props, { emit }) {},
    })
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
