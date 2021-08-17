<template>
    <a-collapse
        class="text-gray-700 bg-transparent border-none"
        :bordered="false"
        expand-icon-position="right"
    >
        <a-collapse-panel class="border-none">
            <template #header
                ><span class="font-bold">Asset was updated</span></template
            >

            <div class="mt-2">
                <b>Terms </b
                >{{ data.displayValue === 'termAdded' ? 'added' : 'removed' }}
            </div>
            <div class="flex">
                <div class="px-3 py-1 m-1 rounded-full pill">
                    {{ data.value }}
                </div>
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
