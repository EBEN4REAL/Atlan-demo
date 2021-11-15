<template>
    <div class="flex flex-col w-full h-full">
        <GlossaryHeader :item="selectedGlossary"></GlossaryHeader>

        <a-tabs
            :class="$style.profiletab"
            v-model:activeKey="activeKey"
            @change="handleChangeTab"
            class="flex-1"
        >
            <a-tab-pane
                :tab="tab.label"
                v-for="tab in getProfileTabs(selectedGlossary)"
                :key="tab.id"
            >
                <component
                    :is="tab.component"
                    :key="tab.id"
                    :selected-asset="selectedGlossary"
                ></component>
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
        provide,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import GlossaryHeader from '@/glossary/profile/header/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetEvaluate from '~/composables/discovery/useAssetEvaluation'

    export default defineComponent({
        name: 'AssetProfile',
        props: {
            selectedGlossary: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: {
            GlossaryHeader,
            Overview: defineAsyncComponent(
                () => import('@/glossary/profile/tabs/overview/index.vue')
            ),
        },
        setup(props) {
            const { selectedGlossary } = toRefs(props)
            const { getAllowedActions } = useAssetEvaluate()
            const actions = computed(() =>
                getAllowedActions(selectedGlossary.value)
            )
            provide('actions', actions)
            provide('selectedGlossary', selectedGlossary)

            const { getProfileTabs } = useAssetInfo()

            const refs: { [key: string]: any } = ref({})

            const activeKey = ref()
            const route = useRoute()

            const router = useRouter()
            const handleChangeTab = (key) => {
                router.replace(`/assets/${route.params.id}/${key}`)
            }

            onMounted(() => {
                activeKey.value = route?.params?.tab
            })

            return {
                refs,
                selectedGlossary,

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
            @apply ml-8 !important;
        }

        :global(.ant-tabs-tab-active) {
            @apply font-bold !important;
        }

        :global(.ant-tabs-nav) {
            @apply mb-0 !important;
        }

        :global(.ant-tabs-content-holder) {
            @apply bg-primary-light overflow-y-auto !important;
        }
    }
</style>
