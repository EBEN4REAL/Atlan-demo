<template>
    <div class="w-full h-full overflow-hidden">
        <iframe
            ref="iframeRef"
            :src="iframeUrl"
            class="w-full h-full"
            style="position: relative; left: 0px; top: 0px"
            @load="onLoad"
        >
            <p>Your browser does not support iframes.</p></iframe
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import Health from '@/admin/health/health.vue'

    export default defineComponent({
        components: {
            Health,
        },
        setup() {
            useHead({
                title: 'Health page',
            })

            const iframeUrl = ref(
                '/api/observe/d/E_7xL0mnz/heka-dashboard?orgId=1&refresh=10s'
            )

            const onLoad = () => {
                console.log('load')

                // console.log(iframeRef.value.contentWindow)

                // iframeRef.value.contentWindow.body.addEventListener(
                //     'mouseup',
                //     Handler
                // )
                // function Handler() {
                //     alert('works')
                // }
            }

            return { iframeUrl, onLoad }
        },
    })
</script>
<style lang="less">
    #frame {
        border: 30px dotted;
        width: 300px;
        height: 300px;
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
