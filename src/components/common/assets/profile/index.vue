<template>
    <div class="flex flex-col w-full h-full">
        <AssetHeader :item="asset" />
        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.profiletab"
            class="flex-1"
            :destroy-inactive-tab-pane="true"
            @change="handleChangeTab"
        >
            <a-tab-pane
                v-for="tab in getProfileTabs(asset)"
                :key="tab.id"
                :tab="tab.label"
                :disabled="isScrubbed(asset) && tab.scrubbed"
            >
                <NoAccess
                    v-if="isScrubbed(asset) && tab.scrubbed"
                    :back-button="true"
                />

                <component
                    v-else-if="tab.component"
                    :is="tab.component"
                    :key="tab.id"
                    :selected-asset="asset"
                    :read-permission="isScrubbed(asset)"
                    @preview="$emit('preview', $event)"
                ></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        defineAsyncComponent,
        onMounted,
        PropType,
        toRefs,
        provide,
        computed,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import AssetHeader from './header/index.vue'
    import NoAccess from '@/common/assets/misc/noAccess.vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetEvaluate from '~/composables/discovery/useAssetEvaluation'

    export default defineComponent({
        name: 'AssetProfile',
        components: {
            AssetHeader,
            NoAccess,
            Columns: defineAsyncComponent(
                () => import('./tabs/columns/index.vue')
            ),
            Overview: defineAsyncComponent(
                () => import('./tabs/overview/index.vue')
            ),
            Lineage: defineAsyncComponent(
                () => import('./tabs/lineage/index.vue')
            ),
            Queries: defineAsyncComponent(
                () => import('./tabs/queries/index.vue')
            ),
            LinkedAssets: defineAsyncComponent(
                () => import('./tabs/linkedAssets/index.vue')
            ),
            TermsAndCategories: defineAsyncComponent(
                () => import('./tabs/termsAndCategories/index.vue')
            ),
            RelatedAssets: defineAsyncComponent(
                () => import('./tabs/relatedAssets/index.vue')
            ),
        },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            page: {
                type: String,
                required: false,
                default: 'assets',
            },
        },
        emits: ['preview'],
        setup(props) {
            const { asset, page } = toRefs(props)
            const { getAllowedActions } = useAssetEvaluate()
            const actions = computed(() => getAllowedActions(asset.value))
            provide('actions', actions)
            provide('selectedAsset', asset)

            const { getProfileTabs, isScrubbed } = useAssetInfo()

            const activeKey = ref()
            const route = useRoute()

            const router = useRouter()
            const handleChangeTab = (key) => {
                router.replace(`/${page.value}/${route.params.id}/${key}`)
            }

            onMounted(() => {
                activeKey.value = route?.params?.tab
            })

            return {
                getProfileTabs,
                activeKey,
                handleChangeTab,
                isScrubbed,
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
        :global(.ant-tabs-tab:first-child) {
            @apply ml-6;
        }

        :global(.ant-tabs-tab-active) {
            -webkit-text-stroke: 0.65px !important;
            -moz-text-stroke: 0.65px !important;
        }

        :global(.ant-tabs-nav) {
            @apply mb-0 !important;
        }

        :global(.ant-tabs-content-holder) {
            @apply bg-primary-light overflow-y-auto !important;
        }
        :global(.ant-tabs-content) {
            @apply min-h-full !important;
        }
    }
</style>
