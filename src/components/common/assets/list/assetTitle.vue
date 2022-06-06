<template>
    <a-tooltip v-if="connectorName(asset)" placement="left">
        <template #title>
            <span>{{ connectorName(asset) }} </span>
            <span v-if="connectionName(asset)">{{
                `/${connectionName(asset)}`
            }}</span>
        </template>
        <img :src="getConnectorImage(asset)" class="h-4 mr-1 mb-0.5" />
    </a-tooltip>
    <div
        v-if="['column'].includes(asset.typeName?.toLowerCase())"
        class="flex items-center mr-1"
    >
        <component
            :is="dataTypeCategoryImage(asset)"
            class="h-4 mb-1 text-gray-500"
        />
    </div>

    <Tooltip
        v-if="
            ['process', 'columnprocess', 'biprocess'].includes(
                asset.typeName?.toLowerCase()
            )
        "
        :clamp-percentage="assetNameTruncatePercentage"
        :tooltip-text="`${title(asset)}`"
        :classes="
            isScrubbed(asset)
                ? 'mb-0 font-semibold text-gray-500 opacity-80 tracking-wide'
                : 'font-bold mb-0 text-gray-500 tracking-wide'
        "
    />

    <Tooltip
        v-else
        :clamp-percentage="assetNameTruncatePercentage"
        :tooltip-text="`${title(asset)}`"
        :route-to="getProfilePath(asset)"
        :classes="
            isScrubbed(asset)
                ? 'text-md mb-0  font-semibold cursor-pointer text-primary hover:underline opacity-80 tracking-wide'
                : 'text-md font-bold mb-0 cursor-pointer text-primary hover:underline tracking-wide '
        "
        :should-open-in-new-tab="openAssetProfileInNewTab"
        @click="(e) => e.stopPropagation()"
    />

    <CertificateBadge
        v-if="certificateStatus(asset)"
        :status="certificateStatus(asset)"
        :username="certificateUpdatedBy(asset)"
        :timestamp="certificateUpdatedAt(asset)"
        class="mb-1 ml-1"
    ></CertificateBadge>

    <a-tooltip placement="right"
        ><template #title>Limited Access</template>
        <AtlanIcon
            v-if="isScrubbed(asset)"
            icon="Lock"
            class="h-4 mb-1 ml-2 text-gray-500"
        ></AtlanIcon
    ></a-tooltip>
</template>

<script setup lang="ts">
    import { ref, toRefs, computed, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import Tooltip from '@common/ellipsis/index.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'

    const props = defineProps({
        asset: {
            type: Object as PropType<assetInterface>,
            required: false,
            default() {
                return {}
            },
        },
        openAssetProfileInNewTab: {
            type: Boolean,
            default: true,
        },
        assetNameTruncatePercentage: {
            type: String,
            default: '95%',
            required: false,
        },
    })

    const {
        connectorName,
        connectionName,
        dataTypeCategoryImage,
        getConnectorImage,
        title,
        certificateStatus,
        certificateUpdatedAt,
        certificateUpdatedBy,
        getProfilePath,
        isScrubbed,
    } = useAssetInfo()
</script>

<style scoped></style>
