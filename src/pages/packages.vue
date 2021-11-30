<template>
    <PackageDiscovery
        v-if="!isItem"
        ref="assetdiscovery"
        @setup="handleSetup"
    ></PackageDiscovery>
    <router-view :selectedPackage="selectedPackage" v-else></router-view>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import PackageDiscovery from '@/packages/index.vue'

    export default defineComponent({
        name: 'WorkflowSetupPage',
        components: {
            PackageDiscovery,
        },
        emits: ['preview'],
        setup(props, { emit }) {
            const selectedPackage = ref(null)
            const route = useRoute()
            const isItem = computed(() => !!route.params.id)
            const router = useRouter()
            const handleSetup = (item: any) => {
                selectedPackage.value = item
                const url = selectedPackage.value.metadata.name

                router.push(`/packages/${url}`)
            }

            return {
                handleSetup,
                selectedPackage,
                isItem,
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
