<template>
    <div class="w-full h-full overflow-hidden">
        <iframe
            ref="iframeRef"
            :src="iframeUrl"
            class="w-full h-full"
            style="position: relative; left: 0px; top: 0px"
        >
            <p>Your browser does not support iframes.</p>
        </iframe>
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive, toRefs } from 'vue'

    export default defineComponent({
        name: 'ServicesPage',
        setup() {
            const state = reactive({
                iframeUrl:
                    '/api/observe/d/TFHNXCk7k/atlan-service-overview?orgId=1&refresh=1m&kiosk',
            })

            return {
                ...toRefs(state),
            }
        },
    })
</script>

<style scoped></style>
