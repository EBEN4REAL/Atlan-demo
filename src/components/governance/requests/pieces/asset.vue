<template>
    <div class="flex flex-col">
        <div class="flex items-center mb-1 text-xs">
            <AssetLogo :selected="selected" :asset="assetWrappper" />
            <span
                class="ml-1 overflow-hidden text-gray-500 overflow-ellipsis"
                >{{ entityType.toUpperCase() }}</span
            >
            <span style="color: #c4c4c4" class="mx-2"> • </span>
            <span class="overflow-hidden text-gray-500 overflow-ellipsis">
                {{ assetText[2] }}</span
            >
            <span class="px-1 text-gray-300">/</span>

            <span class="overflow-hidden text-gray-500 overflow-ellipsis">
                {{ assetText[1] }}</span
            >
        </div>
        <span class="overflow-hidden text-sm overflow-ellipsis text-gray">
            {{ assetText[0] }}
        </span>
    </div>
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
            entityType: {
                type: String,
                required: true,
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
                assetQfName.value.split('/').slice(-3).reverse()
            )

            return { assetWrappper, assetText }
        },
    })
</script>
