<template>
    <div class="flex w-full overflow-hidden">
        <router-view v-if="isItem" @select="handleSelect"></router-view>

        <keep-alive>
            <PackageDiscoveryList
                :style="displayStyle"
                @select="handleSelect"
                @setup="handleSetup"
                @sandbox="handleSandbox"
            ></PackageDiscoveryList>
        </keep-alive>

        <WorkflowPreview
            v-if="selectedPackage"
            class="h-full bg-white border-l border-gray-200 asset-preview-container"
            :item="selectedPackage"
            mode="package"
        />
        <!-- <PackagePreview :selectedPackage="selectedPackage"></PackagePreview> -->
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import WorkflowPreview from '~/workflows/components/workflows/preview/index.vue'

    import PackageDiscoveryList from '~/workflows/components/packages/index.vue'

    // import Sandbox from '~/workflows/components/packages/preview/sandbox.vue'

    export default defineComponent({
        name: 'AtlanMarketplace',
        components: {
            PackageDiscoveryList,
            // Sandbox,
            WorkflowPreview,
        },
        setup(props, { emit }) {
            const selectedPackage = ref(null)

            const route = useRoute()
            const isItem = computed(() => !!route.params.id)

            const router = useRouter()

            const handleSetup = (item: any) => {
                selectedPackage.value = item
                const url = selectedPackage.value.metadata.name
                router.push({
                    path: `/workflows/setup/${url}`,
                    query: {},
                })
            }

            const handleSelect = (item: any) => {
                selectedPackage.value = item
            }

            const handleSandbox = (item: any) => {
                selectedPackage.value = item
                const url = selectedPackage.value.metadata.name
                router.push({
                    path: `/workflows/setup/${url}`,
                    query: { sandbox: 'true' },
                })
            }

            const displayStyle = computed(() => {
                if (isItem.value) {
                    return {
                        display: 'none !important',
                    }
                }
                return {}
            })

            return {
                handleSetup,
                handleSandbox,
                selectedPackage,
                isItem,
                handleSelect,
                displayStyle,
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

<style scoped>
    .asset-preview-container {
        min-width: 360px !important;
        max-width: 360px !important;
    }
</style>
