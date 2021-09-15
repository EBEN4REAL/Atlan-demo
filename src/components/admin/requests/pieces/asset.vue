<template>
    <AssetLogo :selected="selected" :asset="assetWrappper" />
    <span class="text-sm overflow-ellipsis">
        {{ assetText }}
    </span>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'

    export default defineComponent({
        props: {
            assetQfName: { type: String, required: true },
            selected: {
                type: Boolean,
                default: () => false,
                required: false,
            },
        },
        components: { AssetLogo },
        setup(props) {
            const { assetQfName } = toRefs(props)
            const assetWrappper = computed(() => ({
                attributes: {
                    integrationName: assetQfName.value.split('/')[1],
                },
            }))

            const assetText = computed(() =>
                assetQfName.value.split('/').slice(-2).join('.')
            )

            return { assetWrappper, assetText }
        },
    })
</script>
