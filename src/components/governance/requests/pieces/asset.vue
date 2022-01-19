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
            <AssetLogo :selected="selected" :asset="assetWrappper" />
            <span
                class="ml-1 overflow-hidden text-gray-500 overflow-ellipsis"
                >{{ entityType.toUpperCase() }}</span
            >
            <AtlanIcon class="mx-1 ml-2" icon="Schema2" />
            <span class="overflow-hidden text-gray-500 overflow-ellipsis">
                {{ assetText[2] }}</span
            >
            <AtlanIcon class="mx-1 ml-2" icon="SchemaGray" />

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
            const timeAgo = useTimeAgo(
                destinationEntity.value?.attributes?.certificateUpdatedAt,
                {
                    max: 'day',
                    fullDateFormatter: (dt: Date): string =>
                        dt.toDateString().split(' ').slice(1).join(' '),
                }
            )

            return { assetWrappper, assetText, timeAgo }
        },
    })
</script>
