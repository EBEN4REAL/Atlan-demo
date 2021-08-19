<template>
    <div class="flex items-center mb-1">
        <component
            :is="dataTypeImage(asset)"
            class="w-3 h-3 mr-1 text-gray"
        ></component>
        <span
            class="items-center flex-shrink mr-2 text-xs leading-tight  text-gray"
        >
            {{ asset.displayText }}
        </span>
        <div class="chip pkey" v-if="asset.attributes.isPrimary">
            <Fa icon="fas key" />
            <span class="pl-1">Pkey</span>
        </div>
        <div class="chip fkey" v-if="asset.attributes.isPrimary">
            <Fa icon="fas key" class="transform rotate-180" />
            <span class="pl-1">Fkey</span>
        </div>
    </div>
    <span class="text-xs leading-relaxed text-gray-500">
        {{ asset.attributes.description || 'No description' }}
    </span>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        name: 'Column List item',
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { dataTypeImage } = useAssetInfo()

            return {
                dataTypeImage,
            }
        },
    })
</script>

<style scoped>
    .chip {
        @apply px-1 py-0.5 mr-1;
        @apply rounded;
        @apply flex;
        @apply items-center;
        @apply text-xs;
    }
    .pkey {
        color: #52c7d7;
        background-color: #52c7d71a;
    }
    .fkey {
        color: #d452d7;
        background-color: #d452d71a;
    }
</style>
