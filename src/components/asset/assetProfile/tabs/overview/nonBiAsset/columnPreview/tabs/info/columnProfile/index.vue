<template>
    <div class="w-full px-5">Column Properties</div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            selectedRow: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
    })
</script>
