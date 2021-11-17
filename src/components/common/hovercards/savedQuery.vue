<template>
    <div class="bg-primary-light p-2.5">
        <div v-html="displayQuery" class="break-words"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { format } from 'sql-formatter'
    import { highlight } from 'sql-highlight'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const { compiledQuery } = useAssetInfo()

            const displayQuery = computed(() =>
                selectedAsset.value
                    ? highlight(format(compiledQuery(selectedAsset.value)), {
                          html: true,
                      })
                    : '~'
            )
            return {
                displayQuery,
            }
        },
    })
</script>
