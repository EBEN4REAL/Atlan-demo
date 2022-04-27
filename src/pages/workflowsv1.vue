<template>
    <KeepAlive>
        <router-view v-if="isItem" />
        <WorkflowDiscovery v-else ref="assetdiscovery" />
    </KeepAlive>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, provide, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'
    import WorkflowDiscovery from '~/workflows/components/workflows/workflowDiscovery.vue'

    export default defineComponent({
        components: {
            WorkflowDiscovery,
        },
        setup() {
            useHead({
                title: 'Workflows Center',
            })
            const route = useRoute()
            const assetdiscovery = ref()

            const isSetup = computed(() =>
                route.path.startsWith('/workflowsv1/setup')
            )

            const isItem = computed(() => route.params.id || isSetup.value)

            const localSelected = ref()

            const handlePreview = (asset) => {
                localSelected.value = asset
            }
            const updateList = (asset) => {
                if (assetdiscovery.value) {
                    assetdiscovery.value.updateCurrentList(asset)
                }
                handlePreview(asset)
            }

            provide('updateList', updateList)
            provide('preview', handlePreview)

            return {
                isSetup,
                assetdiscovery,
                localSelected,
                isItem,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
