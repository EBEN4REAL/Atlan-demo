<template>
    <div class="flex w-full overflow-hidden">
        <router-view v-if="isItem" @select="handleSelect"></router-view>

        <keep-alive>
            <PackageDiscoveryList
                :style="displayStyle"
                @select="handleSelect"
                @setup="handleSetup"
            ></PackageDiscoveryList>
        </keep-alive>

        <PackageSidebar
            v-if="selectedPackage"
            class="h-full bg-white border-l border-gray-200 asset-preview-container"
            :item="selectedPackage"
            mode="package"
        />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import PackageSidebar from '~/workflowsv2/migrated/packageSidebar.vue'
    import PackageDiscoveryList from '~/workflowsv2/migrated/packages/index.vue'

    export default defineComponent({
        name: 'AtlanMarketplace',
        components: {
            PackageDiscoveryList,
            PackageSidebar,
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
