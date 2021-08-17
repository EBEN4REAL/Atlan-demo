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

            <div>
                <b>Classifications </b
                >{{
                    data.displayValue === 'classificationAdded'
                        ? 'added'
                        : 'removed'
                }}
            </div>
            <div>
                <span class="px-3 py-2 rounded-full pill">{{
                    data.value
                }}</span>
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
