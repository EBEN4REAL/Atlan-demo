<template>
    <div class="w-full px-5 mt-2">
        <p v-for="(v, k) in selectedAsset.metadata.labels" :key="v" class="mb-2">
            <div class="mb-1 text-sm tracking-wide text-gray-500">{{ capitalizeFirstLetter(k.split('-').join(' '))  }}:</div>
            <div class="mb-0 text-gray-700 break-all">{{ v}}</div>
        </p>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { capitalizeFirstLetter } from '~/utils/string'
    
    export default defineComponent({
        name: 'WorkflowPropertiesWrapper',
        components: {},
        props: {
            selectedAsset: {
                type: Object,
                required: true,
            },
        },
        setup() {
            return {capitalizeFirstLetter}
        },
    })
</script>

<style lang="less" scoped></style>
