<template>
    <div class="w-full h-full overflow-hidden">
        <iframe
            ref="iframeRef"
            :src="iframeUrl"
            class="w-full h-full"
            style="position: relative; left: 0px; top: 0px"
            @load="onLoad"
        ></iframe>
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

            const iframeUrl = ref('/api/observe/login/generic_oauth')

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
<style lang="less" module></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
