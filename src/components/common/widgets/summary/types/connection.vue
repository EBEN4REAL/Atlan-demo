<template>
    <div class="flex flex-col text-sm">
        <span class="mb-1 text-sm text-gray-500">Connection</span>
        <div class="flex items-center">
            <img :src="getConnectorImage(asset)" class="h-4 mr-1" />

            <span
                @click="handleOpenDrawer"
                class="font-bold cursor-pointer text-primary hover:underline"
                >{{ `${connectorName(asset)}/${connectionName(asset)}` }}</span
            >
        </div>
    </div>
    <AssetDrawer
        :data="drawerData"
        :show-drawer="drawerVisible"
        @closeDrawer="handleCloseDrawer"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, ref, watch } from 'vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'
    import {
        AssetAttributes,
        InternalAttributes,
        AssetRelationAttributes,
    } from '~/constant/projection'

    export default defineComponent({
        components: { AssetDrawer },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const {
                getConnectorImage,
                connectorName,
                connectionName,
                connectionGuid,
            } = useAssetInfo()

            const drawerVisible = ref(false)
            const drawerData = ref({})

            const { asset } = toRefs(props)

            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                guid: connectionGuid(asset.value),
            })

            const dependentKey = ref(null)

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])

            const { list, fetch } = useDiscoverList({
                isCache: false,
                dependentKey,
                facets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            const handleOpenDrawer = () => {
                fetch()
            }

            const handleCloseDrawer = () => {
                drawerVisible.value = false
                drawerData.value = {}
            }

            watch(
                () => [...list.value],
                () => {
                    drawerData.value = list.value[0]
                    drawerVisible.value = true
                }
            )

            return {
                getConnectorImage,
                connectorName,
                connectionName,
                connectionGuid,
                drawerVisible,
                drawerData,
                handleCloseDrawer,
                handleOpenDrawer,
            }
        },
    })
</script>
