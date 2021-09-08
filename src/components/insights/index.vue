<template>
    <div class="flex h-full">
        <SideNav />
        <Explorer />
        <Playground />
        <AssetSidebar />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import SideNav from '~/components/insights/sideNav.vue'
    import Explorer from '~/components/insights/explorer.vue'
    import Playground from '~/components/insights/playground/index.vue'
    import AssetSidebar from '~/components/insights/assetSidebar.vue'

    export default defineComponent({
        components: { SideNav, Explorer, Playground, AssetSidebar },
        props: {},
        setup(props) {},
    })
</script>
<style lang="less" scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
