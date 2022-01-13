<template>
    <div class="flex flex-col">
        <span
            class="mb-1 overflow-hidden text-sm overflow-ellipsis text-primary"
        >
            {{ assetText[0] }}
        </span>
        <div class="flex items-center text-xs">
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
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'

    export default defineComponent({
        components: { AssetLogo },
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
