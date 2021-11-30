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
        name: 'QueryPage',
        setup() {
            const state = reactive({
                iframeUrl:
                    '/api/observe/d/E_7xL0mnz/heka-dashboard?orgId=1&refresh=10s',
            })

            return {
                ...toRefs(state),
            }
        },
    })
</script>

<style scoped></style>
