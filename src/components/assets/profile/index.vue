<template>
    <div class="flex flex-col w-full h-full">
        <AssetHeader :item="selectedAsset"></AssetHeader>

        <a-tabs
            :class="$style.profiletab"
            v-model:activeKey="activeKey"
            @change="handleChangeTab"
        >
            <a-tab-pane
                :tab="tab.label"
                v-for="tab in getProfileTabs(selectedAsset)"
                :key="tab.id"
            >
                <component :is="tab.component" :key="tab.id"></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        ref,
        watch,
        defineAsyncComponent,
        onMounted,
        PropType,
        toRefs,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import AssetHeader from '@/assets/profile/header/index.vue'

    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'AssetProfile',
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: {
            AssetHeader,

            Columns: defineAsyncComponent(
                () => import('@/assets/profile/tabs/columns/index.vue')
            ),
            Overview: defineAsyncComponent(
                () => import('@/assets/profile/tabs/overview/index.vue')
            ),
            Lineage: defineAsyncComponent(
                () => import('@/assets/profile/tabs/lineage/index.vue')
            ),
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const { getProfileTabs } = useAssetInfo()

            const refs: { [key: string]: any } = ref({})

            const activeKey = ref()
            const route = useRoute()

            const router = useRouter()
            const handleChangeTab = (key) => {
                router.replace(`/assets/${id.value}/${key}`)
            }

            onMounted(() => {
                activeKey.value = route?.params?.tab
            })

            return {
                refs,
                selectedAsset,

                getProfileTabs,
                activeKey,
                handleChangeTab,
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
            @apply ml-8;
        }

        :global(.ant-tabs-tab-active) {
            @apply font-bold;
        }
    }
</style>
