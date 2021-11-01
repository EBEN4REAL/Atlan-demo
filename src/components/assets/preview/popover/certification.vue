<template>
    <a-popover placement="left">
        <template #content
            ><div classs="popover-container">
                <div class="flex flex-col">
                    <div class="flex mb-1">
                        <component
                            :is="icon"
                            :key="selectedAsset.guid"
                            class="
                                inline-flex
                                self-center
                                w-auto
                                h-4
                                mr-1
                                mb-0.5
                            "
                        />
                        <span
                            class="text-sm font-bold tracking-wide capitalize  text-gray"
                            >Verified</span
                        >
                    </div>
                    <div class="text-xs">
                        This is a new certification message
                    </div>
                </div>
                <div class="mt-3">
                    <div class="flex items-center mb-1 text-sm text-gray-500">
                        Updated
                    </div>
                    <div class="leading-none">
                        <span class="mb-1 text-sm font-bold"> 6 days ago</span>
                    </div>
                    <span class="text-xs">by Nitya</span>
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import { certificateList } from '~/constant/certification'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { capitalizeFirstLetter } from '~/utils/string'

    export default defineComponent({
        name: 'CertificationPopover',
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const {
                certificateUpdatedBy,
                certificateUpdatedAt,
                certificateStatus,
            } = useAssetInfo()

            const status = computed(() =>
                certificateStatus(selectedAsset.value)
            )

            const username = computed(() =>
                certificateUpdatedBy(selectedAsset.value)
            )

            const timestamp = computed(() =>
                certificateUpdatedAt(selectedAsset.value)
            )

            const icon = computed(() => {
                const found = certificateList.find(
                    (item) =>
                        item.id.toLowerCase() === status?.value?.toLowerCase()
                )
                if (found) {
                    return found.icon
                }

                return ''
            })

            return {
                selectedAsset,
                status,
                username,
                timestamp,
                icon,
            }
        },
    })
</script>

<style lang="less" scoped>
    .popover-container {
        min-width: 200px !important;
    }
</style>
