<template>
    <div class="asset-list">
        <pre>{{ list }}</pre>
        <!-- WIP -->
    </div>
    <slot name="listFooter"></slot>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType } from 'vue'
    import dayjs from 'dayjs'
    import ListItem from '@common/assets/list/assetItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { useAssetListing } from '~/composables/home/useHomeDSL'
    import { useAccessLogs } from '@/governance/accessLogs/composables/useAccessLogs.ts'
    // import redirect from '@/glossary/utils/redirectToProfile'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        name: 'AssetList',
        components: {
            VirtualList,
            ListItem,
        },
        props: {
            typeNames: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            username: {
                type: String,
                required: false,
                default: () => '',
            },
            icon: {
                type: String,
                required: false,
                default: () => '',
            },
            emptyText: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        setup(props) {
            const { typeNames, username } = toRefs(props)
            const selectedAssetId = ref('')

            const router = useRouter()
            /*             const redirectToProfile = redirect(router)
             */
            // const { list, isLoading } = useAssetListing(
            //     typeNames.value,
            //     username.value
            // )
            const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60 * 1000
            const gte = ref(
                dayjs(new Date(Date.now() - THIRTY_DAYS_IN_SECONDS)).format(
                    'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                )
            )
            const lt = ref(dayjs().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'))
            const from = ref(0)
            const size = ref(20)

            const { list, isLoading } = useAccessLogs(gte, lt, from, size)

            function handlePreview(item: any) {
                if (item.guid === '-1') {
                    selectedAssetId.value = item.displayText
                } else {
                    selectedAssetId.value = item.guid
                    if (
                        item.typeName === 'AtlasGlossaryTerm' ||
                        item.typeName === 'AtlasGlossaryCategory'
                    ) {
                        /*                         redirectToProfile(item?.typeName, item?.guid)
                         */
                    } else if (item.typeName === 'Query') {
                        router.push(`/insights?id=${item?.guid}`)
                    } else if (item.typeName === 'Column') {
                        const tableGuid = item?.attributes?.table?.guid
                        router.push(
                            `/assets/${tableGuid}/overview?column=${item?.guid}`
                        )
                    } else {
                        router.push(`/assets/${item?.guid}/overview`)
                    }
                }
            }

            const handleCardClicked = (item: any) => {
                /*  // add event
                const idx = list.value.findIndex((el) => el.guid === item.guid)
                useAddEvent('discovery', 'asset_card', 'clicked', {
                    click_index: idx,
                }) */
                handlePreview(item)
            }

            return {
                selectedAssetId,
                list,
                handleCardClicked,
                isLoading,
            }
        },
    })
</script>

<style lang="less" scoped>
    .asset-list {
        height: 500px;
        overflow-y: auto;
    }
</style>
