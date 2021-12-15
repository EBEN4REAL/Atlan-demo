<template>
    <div class="flex w-full h-full overflow-x-hidden bg-white">
        <div class="flex flex-1 h-full">
            <router-view v-if="isItem" @select="handleSelect"></router-view>

            <keep-alive>
                <PackageDiscoveryList
                    :style="displayStyle"
                    @select="handleSelect"
                    @setup="handleSetup"
                    @sandbox="handleSandbox"
                ></PackageDiscoveryList>
            </keep-alive>
        </div>

        <div
            class="relative hidden h-full overflow-y-auto bg-white border-l border-gray-200 asset-preview-container md:block"
        >
            <PackagePreview :selectedPackage="selectedPackage"></PackagePreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute, useRouter } from 'vue-router'

    import PackageDiscoveryList from '@/packages/index.vue'
    import PackagePreview from '@/packages/preview/index.vue'
    import Sandbox from '@/packages/preview/sandbox.vue'

    export default defineComponent({
        name: 'PackageSetupPage',
        components: {
            PackageDiscoveryList,
            PackagePreview,
            Sandbox,
        },
        setup(props, { emit }) {
            useHead({
                title: 'Worfklow Setup',
            })
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
