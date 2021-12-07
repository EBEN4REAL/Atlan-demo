<template>
    <Resources :asset="selectedAsset" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Resources from '@common/widgets/resources/index.vue'

export default defineComponent({
    name: 'ResourcesWidget',
    components: { Resources },
    props: {
        selectedAsset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    },
    setup() {},
})
</script>
