<template>
    <a-collapse
        class="p-0 m-0 text-gray-700 bg-transparent border-none"
        :bordered="false"
        expandIconPosition="right"
    >
        <a-collapse-panel class="border-none">
            <template #header
                ><span class="font-bold">Asset was updated</span></template
            >

            <div><b>Description</b> updated</div>
            <div>
                {{ data.value }}
            </div>
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            data,
        },
    })
</script>
