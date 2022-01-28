<template>
    <div class="flex flex-col">
        <span
            class="mb-1 overflow-hidden text-sm overflow-ellipsis text-primary"
        >
            {{ assetText[0] }}
            <CertificateBadge
                v-if="destinationEntity?.attributes?.certificateStatus"
                :status="destinationEntity?.attributes?.certificateStatus"
                class="mb-1 ml-1"
                :username="destinationEntity?.attributes?.certificateUpdatedBy"
                :timestamp="timeAgo"
            />
        </span>
        <div class="flex items-center text-xs">
            <!-- <AssetLogo :selected="selected" :asset="assetWrappper" /> -->
            <AtlanIcon class="mr-1" :icon="assetIcon" />
            <span
                class="ml-1 overflow-hidden text-gray-500 overflow-ellipsis"
                >{{ entityType.toUpperCase() }}</span
            >
            <AtlanIcon class="mx-1 ml-2 icon-table" icon="Schema2" />
            <span class="overflow-hidden text-gray-500 overflow-ellipsis">
                {{ assetText[2] }}</span
            >
            <AtlanIcon class="mx-1 ml-2 text-gray-500" icon="SchemaGray" />

            <span class="overflow-hidden text-gray-500 overflow-ellipsis">
                {{ assetText[1] }}</span
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import CertificateBadge from '@common/badge/certificate/index.vue'
    import { useTimeAgo } from '@vueuse/core'
    import AssetLogo from '@/common/icon/assetIcon.vue'

    export default defineComponent({
        components: { AssetLogo, CertificateBadge },
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
            destinationEntity: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { assetQfName } = toRefs(props)
            const { destinationEntity } = toRefs(props)
            const assetWrappper = computed(() => ({
                attributes: {
                    integrationName: assetQfName.value.split('/')[1],
                },
            }))

            const assetText = computed(() =>
                assetQfName.value.split('/').slice(-3).reverse()
            )
            const assetIcon = computed(() => {
                let name = assetQfName.value?.split('/')[1] || ''
                name = name.toLowerCase()
                // name[0] = name[0].toUpperCase()
                const result = `${name[0]?.toUpperCase() || ''}${name.slice(
                    1,
                    name.length
                )}`
                return result
            })
            const timeAgo = useTimeAgo(
                destinationEntity.value?.attributes?.certificateUpdatedAt,
                {
                    max: 'day',
                    fullDateFormatter: (dt: Date): string =>
                        dt.toDateString().split(' ').slice(1).join(' '),
                }
            )

            return { assetWrappper, assetText, timeAgo, assetIcon }
        },
    })
</script>
<style lang="less">
    .icon-table {
        path {
            stroke: rgba(111, 117, 144, 1) !important;
        }
    }
</style>
