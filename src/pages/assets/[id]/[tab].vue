<template>
    <LoadingView v-if="loading" />
    <ErrorView v-else-if="error" :error="error" />
    <div v-else class="w-full">
        <div class="h-24 p-4">
            <AssetHeader :asset="response?.entities[0]" />
        </div>
        <a-menu
            v-model:selectedKeys="current"
            mode="horizontal"
            @select="selectTab"
        >
            <a-menu-item key="overview"> Overview </a-menu-item>
            <a-menu-item key="lineage"> Lineage </a-menu-item>
        </a-menu>
        <div>
            <component
                :is="selectedTab"
                :asset="response?.entities[0] || {}"
            ></component>
        </div>
    </div>
</template>
<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    import LoadingView from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import useAsset from '~/composables/asset/useAsset'

    import Overview from '~/components/asset/assetProfile/tabs/overview.vue'
    import Lineage from '~/components/asset/assetProfile/tabs/lineage.vue'
    import AssetHeader from '~/components/asset/assetProfile/assetHeader.vue'

    export default defineComponent({
        components: {
            overview: Overview,
            lineage: Lineage,
            AssetHeader,
            LoadingView,
            ErrorView,
        },
        setup() {
            const route = useRoute()
            const id = computed(() => route?.params?.id || '')
            const tab = computed(() => route?.params?.tab || '')

            const current = ref([tab.value])
            const selectedTab = ref(tab.value)
            const router = useRouter()

            const { response, error, loading } = useAsset({
                entityId: id.value,
            })

            const selectTab = (item: any) => {
                selectedTab.value = item.key
                router.replace(`/assets/${id.value}/${item.key}`)
            }

            return {
                current,
                selectTab,
                selectedTab,
                response,
                error,
                loading,
            }
        },
    })
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
