<template>
    <div class="flex items-center mb-1">
        <component
            :is="dataTypeImage(asset)"
            class="flex-none w-auto h-4 mr-2 text-gray"
        ></component>
        <span
            class="
                flex-shrink
                pt-0.5
                mr-2
                overflow-hidden
                text-xs
                font-bold
                align-middle
                text-gray
                overflow-ellipsis
            "
        >
            {{ asset.displayText }}
        </span>
        <div v-if="asset.attributes.isPrimary" class="chip">
            <AtlanIcon icon="PrimaryKey" />
        </div>
        <div v-if="asset.attributes.isPrimary" class="chip">
            <AtlanIcon icon="ForeignKey" />
        </div>
    </div>
    <span class="text-xs leading-relaxed text-gray-500 whitespace-pre-wrap">
        {{ asset.attributes.description || 'No description' }}
    </span>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'ColumnListItem',
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
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
</style>
