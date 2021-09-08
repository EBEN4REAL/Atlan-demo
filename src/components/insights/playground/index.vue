<template>
    <div class="flex flex-col flex-1 h-full bg-white">
        <div class="flex py-1.5 px-3 border-b text-gray">Tabs</div>
        <Editor />
        <div class="flex border-b border-t text-gray py-1.5 px-3">Result</div>
        <Result />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Editor from '~/components/insights/playground/editor.vue'
    import Result from '~/components/insights/playground/result.vue'

    export default defineComponent({
        components: { Editor, Result },
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
