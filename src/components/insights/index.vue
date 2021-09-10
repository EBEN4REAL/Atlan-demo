<template>
    <div class="flex h-full">
        <div class="flex">
            <Sidebar />
        </div>
        <Playground />
        <AssetSidebar />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Sidebar from '~/components/insights/sidebar/index.vue'
    import Playground from '~/components/insights/playground/index.vue'
    import AssetSidebar from '~/components/insights/assetSidebar.vue'

    export default defineComponent({
        components: { Sidebar, Playground, AssetSidebar },
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
