<template>
    <a-layout class="min-h-full">
        <a-layout-header class="z-30 h-10 p-0 m-0">
            <div class="h-full px-4 bg-primary-light">
                <img :src="AtlanLogo" class="w-24" />
            </div>
        </a-layout-header>
        <a-layout class="w-full h-full">
            <a-layout-content
                class="relative flex w-full overflow-hidden"
                style="height: calc(100vh - 40px) !important"
            >
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanLogo from '~/assets/images/atlan-logo-no-bg.png'

    export default defineComponent({
        name: 'MinimalLayout',
        setup() {
            return { AtlanLogo }
        },
    })
</script>
