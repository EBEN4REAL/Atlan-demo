<template>
    <div class="flex flex-col">
        <a-input class="mb-3" v-model:value="searchTerm" placeholder="Search" />
        <div
            class="flex flex-col mb-2"
            v-for="(asset, index) in filteredList"
            :key="index"
        >
            <div class="flex items-center">
                <component
                    :is="dataTypeImage(asset)"
                    class="w-5 h-5 mr-1 text-gray"
                ></component>
                <span
                    class="flex-shrink mr-2 font-bold leading-tight text-gray"
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
            <span class="leading-relaxed text-gray-description">
                {{ asset.attributes.description || '-' }}
            </span>
        </div>
        <div v-if="!isReady">Loading</div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType } from 'vue'
    import { toRefs } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useColumns } from '~/composables/asset/useColumnRelations'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {},
        props: {
            id: String,
            componentData: {
                type: Object as PropType<any>,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { dataTypeImage } = useAssetInfo()
            const { selectedAsset } = toRefs(props)

            const assetId = computed(() => selectedAsset.value.guid)
            const { filteredList, isReady, error, searchTerm } =
                useColumns(assetId)

            return {
                filteredList,
                searchTerm,
                dataTypeImage,
                isReady,
                error,
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
