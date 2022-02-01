<template>
    <div class="relative h-full pb-6">
        <Shortcut
            shortcut-key="esc"
            action="close"
            placement="left"
            :delay="0.4"
            :edit-permission="true"
        >
            <div class="close-btn-sidebar" @click="$emit('close')">
                <AtlanIcon icon="Add" class="text-white outline-none" />
            </div>
        </Shortcut>

        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanLoader class="h-10" />
        </div>
        <div
            v-if="error"
            class="flex flex-col items-center justify-center h-full bg-white"
        >
            <ErrorView>
                <div class="absolute top-0 right-0 flex justify-end p-4">
                    <AtlanIcon
                        icon="Cross"
                        class="absolute mt-2 cursor-pointer"
                        @click="$emit('close')"
                    />
                </div>
                <div class="mt-3">
                    <AtlanButton color="secondary" @click="reload">
                        <AtlanIcon icon="Reload" />
                        Try again
                    </AtlanButton>
                </div>
            </ErrorView>
        </div>
        <template v-else-if="!isLoading && classification">
            <div class='px-5 py-5'>
                <h2 class='text-primary text-base font-bold'>
                    {{ classification.displayName }}
                </h2>
                <div class='flex content-center items-center h-4 mt-2.5'>
                    <ClassificationIcon
                        :classification='classification'
                    />
                    <span class='uppercase text-gray-500 ml-1'>Classification</span>
                    <a-button
                        v-auth="map.PAGE_GOVERNANCE"
                        class="px-2 py-1 ml-auto"
                        @click="handleRedirect(classification.name)"
                    >
                        <AtlanIcon icon="Enter"/>
                    </a-button>
                </div>
            </div>
            <a-tabs
                v-model:activeKey="activeKey"
                tab-position="left"
                class="h-full border-t"
                :destroy-inactive-tab-pane="true"
                :class="$style.previewtab"
            >
                <a-tab-pane v-for="(tab, index) in tabs" :key="tab.key">
                    <template #tab>
                        <SidePanelTabHeaders
                            :title="tab.name"
                            :icon="tab.icon"
                            :is-active="activeKey === tab.key"
                            :active-icon="tab.activeIcon"
                            :class="index === 0 ? 'mt-1' : ''"
                        />
                    </template>
                    <component
                        :is="tab.component"
                        class="h-full"
                        :classification="classification"
                        @set-tab="setActiveTab($event)"
                    />
                </a-tab-pane>
            </a-tabs>
        </template>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        defineAsyncComponent,
        defineProps,
        toRefs,
        ref
    } from 'vue'
    import SidePanelTabHeaders from '@common/tabs/sidePanelTabHeaders.vue'
    import Shortcut from '@/common/popover/shortcut.vue'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import AtlanLoader from '@/common/loaders/atlanLoader.vue'
    import ErrorView from '@common/error/index.vue'
    import AtlanButton from '@/UI/button.vue'
    import { tabs } from '~/constant/classification'
    import ClassificationIcon from '@common/icon/classificationIcon.vue'
    import { useRouter } from 'vue-router'
    import map from '~/constant/accessControl/page'

    export default defineComponent({
        name: 'ClassificationDrawer',
        components: {
            Overview: defineAsyncComponent(
                () => import('./overview.vue')
            ),
            LinkedAssets: defineAsyncComponent(
                () => import('./linkedAssets.vue')
            ),
            Purposes: defineAsyncComponent(
                () => import('./purposes.vue')
            ),
            SidePanelTabHeaders,
            Shortcut,
            AtlanIcon,
            AtlanLoader,
            ErrorView,
            AtlanButton,
            ClassificationIcon
        }
    })
</script>

<script lang='ts' setup>
    const props = defineProps({
        classificationProp: {
            type: Object,
            required: true
        }
    })

    const router = useRouter()

    const emits = defineEmits(['close'])

    const activeKey = ref('overview')

    const { classificationProp: classification } = toRefs(props)

    const setActiveTab = (activeTabKey: string) => {
        activeKey.value = activeTabKey
    }

    const handleRedirect = (name) => {
        router.push(
            `/governance/classifications/${name}`
        )
    }
</script>

<style lang="less" module>
    .previewtab {
        &:global(.ant-tabs-left) {
            :global(.ant-tabs-nav-container) {
                width: 48px !important;
            @apply ml-0 !important;
            }
            :global(.ant-tabs-tab) {
                padding: 3px 8px !important;
            @apply justify-center;
            }

            :global(.ant-tabs-nav-wrap) {
            @apply pt-3;
            }

            :global(.ant-tabs-content) {
            @apply px-0 h-full !important;
            }
            :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
                margin-bottom: 1px;
            }
            :global(.ant-tabs-tabpane) {
            @apply px-0 !important;
            @apply pb-0 !important;
            @apply h-full !important;
            }

            :global(.ant-tabs-content-holder) {
            @apply h-full !important;
            }
        }
    }
</style>