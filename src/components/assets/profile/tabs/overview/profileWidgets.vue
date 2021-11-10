<template>
    <div
        class="grid gap-y-3 gap-x-16"
        :class="
            asset.typeName == 'Table' || asset.typeName == 'TablePartition'
                ? 'summary-grid-3'
                : 'summary-grid-2'
        "
    >
        <SQL
            v-if="
                asset.typeName == 'View' || asset.typeName == 'MaterialisedView'
            "
            :sql="definition(asset)"
        >
            <div class="flex flex-col text-sm cursor-pointer">
                <span class="mb-2 text-sm text-gray-500">Definition</span>
                <span class="text-primary">SQL</span>
            </div>
        </SQL>
        <RowInfoHoverCard
            v-if="
                asset.typeName == 'Table' || asset.typeName == 'TablePartition'
            "
            :image="getConnectorImage(asset)"
            :row-count="rowCount(asset)"
            :size-bytes="sizeBytes(asset)"
            :source-updated-at="sourceUpdatedAt(asset)"
            :source-updated-at-raw="sourceUpdatedAt(asset, true)"
            :source-created-at="sourceCreatedAt(asset)"
            :source-created-at-raw="sourceCreatedAt(asset, true)"
        >
            <div class="flex flex-col text-sm cursor-pointer">
                <span class="mb-1 text-sm text-gray-500">Rows</span>
                <span class="text-gray-700">{{ rowCount(asset) }}</span>
            </div>
        </RowInfoHoverCard>
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-sm text-gray-500">Columns</span>
            <span class="text-gray-700">{{ columnCount(asset) }}</span>
        </div>
        <div class="max-w-screen-md">
            <div class="flex flex-col">
                <p class="mb-1 text-sm text-gray-500">Description</p>
                <Description v-model="localDescription" />
            </div>
        </div>
        <div
            :class="
                asset.typeName == 'Table' || asset.typeName == 'TablePartition'
                    ? 'status-grid'
                    : ''
            "
        >
            <CertificationPopover :selected-asset="asset" placement="bottom">
                <Certificate :selected-asset="asset" />
            </CertificationPopover>
        </div>

        <div v-if="asset.guid" class="flex flex-col">
            <p class="mb-1 text-sm text-gray-500">Owners</p>
            <Owners v-model="localOwners" @change="handleOwnersChange" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, PropType, toRefs } from 'vue'

    // Components
    import SQL from '@/assets/preview/popover/sql.vue'
    import RowInfoHoverCard from '@/assets/preview/popover/rowInfo.vue'
    import Description from '@/common/input/description/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'
    import CertificationPopover from '@/assets/preview/popover/certification.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAsset from '~/composables/discovery/updateAsset'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            RowInfoHoverCard,
            Description,
            Certificate,
            Owners,
            SQL,
            CertificationPopover,
        },

        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)

            const {
                rowCount,
                columnCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
                ownerGroups,
                ownerUsers,
                definition,
                description,
                getConnectorImage,
            } = useAssetInfo()

            const entity = ref({
                guid: asset.value.guid,
                typeName: asset.value.typeName,
                attributes: {
                    name: asset.value.attributes?.name,
                    qualifiedName: asset.value.attributes?.qualifiedName,
                    tenantId: 'default',
                },
            })

            const body = ref({
                entities: [],
            })

            const { mutate, isLoading } = updateAsset(body)

            const localDescription = ref(description(asset.value))

            watch(localDescription, () => {
                entity.value.attributes.userDescription = localDescription.value
                body.value.entities = [entity.value]
                mutate()
            })

            const localOwners = ref({
                ownerUsers: ownerUsers(asset.value),
                ownerGroups: ownerGroups(asset.value),
            })

            const handleOwnersChange = () => {
                entity.value.attributes.ownerUsers =
                    localOwners.value?.ownerUsers
                entity.value.attributes.ownerGroups =
                    localOwners.value?.ownerGroups
                body.value.entities = [entity.value]
                mutate()
            }

            return {
                rowCount,
                columnCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
                getConnectorImage,
                definition,
                localDescription,
                localOwners,
                handleOwnersChange,
            }
        },
    })
</script>

<style lang="less" scoped>
    .summary-grid-2 {
        grid-template-columns: fit-content(300px) 1fr;
    }
    .summary-grid-3 {
        grid-template-columns: fit-content(300px) fit-content(300px) 1fr;
    }
    .status-grid {
        grid-column: span 2;
    }
</style>
