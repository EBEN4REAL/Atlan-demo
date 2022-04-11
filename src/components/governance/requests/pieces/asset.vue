<template>
    <div class="flex flex-col">
        <span
            class="mb-1 overflow-hidden text-sm overflow-ellipsis text-primary flex items-center"
            :style="size === 'small' ? 'max-width: 200px' : ''"
        >
            <Tooltip
                :tooltipText="assetText[0]"
                :clampPercentage="size === 'small' ? '80%' : '95%'"
            />
            <CertificateBadge
                v-if="destinationEntity?.attributes?.certificateStatus"
                :status="destinationEntity?.attributes?.certificateStatus"
                class="mb-1 ml-2 mr-2"
                :username="destinationEntity?.attributes?.certificateUpdatedBy"
                :timestamp="timeAgo"
            />
        </span>
        <div class="flex items-center text-xs">
            <!-- <AssetLogo :selected="selected" :asset="assetWrappper" /> -->
            <AtlanIcon class="mr-1" :icon="assetIcon" />
            <span
                class="ml-1 overflow-hidden text-gray-500 overflow-ellipsis w-12"
                >{{ entityType.toUpperCase() }}</span
            >
            <AtlanIcon class="mx-1 ml-2 icon-table" icon="Schema2" />
            <!-- <span class="overflow-hidden text-gray-500 overflow-ellipsis"> -->
            <!--     {{ assetText[2] }}</span -->
            <!-- > -->
            <span
                :style="size === 'small' ? 'max-width: 30px' : ''"
                class="w-full "
            >
                <Tooltip
                    :tooltipText="assetText[2]"
                    :classes="'text-gray-500 w-full'"
                />
            </span>
            <AtlanIcon class="mr-1  text-gray-500" icon="SchemaGray" />

            <!-- <span class="overflow-hidden text-gray-500 overflow-ellipsis"> -->
            <!--     {{ assetText[1] }}</span -->
            <!-- > -->
            <Tooltip
                :tooltipText="assetText[1]"
                :classes="'text-gray-500'"
                clampPercentage="60%"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs ,ref} from 'vue'
    import CertificateBadge from '@common/badge/certificate/index.vue'
    import { useTimeAgo } from '@vueuse/core'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import Tooltip from '@/common/ellipsis/index.vue'

    export default defineComponent({
        components: { AssetLogo, CertificateBadge, Tooltip },
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
            size: {
                type: String,
                required: false,
                default: () => 'default',
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
            return {
                assetWrappper,
                assetText,
                timeAgo,
                assetIcon,
            }
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
