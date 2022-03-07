<template>
    <div class="flex flex-col text-sm">
        <span class="mb-1 text-sm text-gray-500">Categories</span>
        <span class="text-gray-700">{{ categoryCount(selectedGlossary) }}</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType ,computed} from 'vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryStore from '~/store/glossary'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { categoryCount } = useAssetInfo()
            const glossaryStore = useGlossaryStore()

            const selectedGlossary = computed(() => {
                const found = glossaryStore?.list?.find(
                    (el) => el?.guid === props.asset?.guid
                )
                if (found) return found
                return props.asset
            })

            return {
                categoryCount,
                selectedGlossary
            }
        },
    })
</script>
