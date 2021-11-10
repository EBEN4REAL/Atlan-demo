<template>
    <AssetLogo :selected="selected" :asset="assetWrappper" />
    <span class="overflow-hidden text-sm overflow-ellipsis text-gray">
        {{ assetText[0] }}
    </span>
    <AtlanIcon icon="ChevronDown" class="flex-none transform rotate-90" />
    <span class="overflow-hidden text-sm text-gray-500 overflow-ellipsis">
        {{ assetText[1] }}</span
    >
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
                assetQfName.value.split('/').slice(-2).reverse()
            )

            return { assetWrappper, assetText }
        },
    })
</script>
