<template>
    <div class="bg-primary-light p-2.5">
        <div v-html="displayQuery"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { format } from 'sql-formatter'
    import { highlight } from 'sql-highlight'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const displayQuery = computed(() =>
                selectedAsset.value
                    ? highlight(
                          format(selectedAsset.value?.attributes.compiledQuery),
                          {
                              html: true,
                          }
                      )
                    : '~'
            )

            return {
                displayQuery,
            }
        },
    })
</script>
