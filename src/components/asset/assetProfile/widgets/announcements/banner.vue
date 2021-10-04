<template>
    <div class="w-full"></div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {},
    })
</script>
