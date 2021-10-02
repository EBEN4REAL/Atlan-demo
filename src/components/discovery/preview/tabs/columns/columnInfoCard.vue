<template>
    <a-popover placement="left" mouseEnterDelay="0.3">
        <template #content>
            <div class="flex flex-col gap-y-1">
                <div class="flex items-center">
                    <component
                        :is="typeIcon"
                        class="flex-none w-auto h-4 mr-1 text-gray-500"
                    ></component>
                    <span class="text-sm font-bold text-gray-500 pt-0.5">{{
                        columnAsset.attributes.dataType
                    }}</span>
                </div>

                <span class="mb-1 break-words text-gray">{{
                    columnAsset.displayText
                }}</span>

                <Pill
                    v-if="columnAsset.attributes.isPrimary"
                    label="Primary Key"
                    :has-action="false"
                >
                    <template #prefix>
                        <AtlanIcon icon="PrimaryKey" />
                    </template>
                </Pill>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Pill from '~/components/UI/pill/pill.vue'

    export default defineComponent({
        name: 'ColumnInfoHoverCard',
        props: {
            columnAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: { Pill },
        setup(props) {
            const { columnAsset } = toRefs(props)
            const { dataTypeImage } = useAssetInfo()

            const typeIcon = computed(() => dataTypeImage(columnAsset.value))

            return { typeIcon }
        },
    })
</script>
