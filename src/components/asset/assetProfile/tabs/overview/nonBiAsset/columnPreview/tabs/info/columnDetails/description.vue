<template>
    <div class="mb-4 text-xs text-gray-500">
        <p class="mb-2 text-sm">Description</p>

        <div class="inline-block text-sm cursor-pointer text-gray">
            <p v-if="selectedRow?.description" class="mb-0">
                {{ selectedRow?.description }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            selectedRow: {
                type: Object as PropType<any>,
                required: true,
            },
        },
    })
</script>
