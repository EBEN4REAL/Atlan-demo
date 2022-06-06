<template>
    <div>
        <div class="flex">
            <div class="flex-grow">
                <div class="flex mb-2">
                    <div class="flex-grow">
                        <div class="flex items-center">
                            <AssetTitle :asset="asset" />
                        </div>
                    </div>
                    <div class="">
                        <AtlanButton2
                            label="Clear"
                            :loading="isLoading"
                            size="small"
                            color="secondary"
                            class="h-6 px-3 py-0"
                            @click="handleClear"
                        />
                    </div>
                </div>
                <div class="space-y-2 text-xs">
                    <template v-for="a in applicableList" :key="a.name">
                        <div
                            class="flex items-center text-gray-500"
                            style="font-size: 14px"
                        >
                            <div
                                class="flex"
                                style="max-width: 10rem; white-space: pre"
                            >
                                <Tooltip
                                    :tooltip-text="a.displayName"
                                    :rows="1"
                                    placement="left"
                                    classes="text-gray-500 "
                                />
                                <span>: </span>
                            </div>
                            <div class="flex-grow">
                                <ReadOnly
                                    :attribute="a"
                                    class="ml-2 text-gray-700"
                                />
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, computed, PropType, ref, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import Tooltip from '@/common/ellipsis/index.vue'
    import ReadOnly from '@/common/assets/preview/customMetadata/readOnly.vue'
    import { removeProperty } from '@/governance/custom-metadata/linkedAssets/removeProperty'
    import AssetTitle from '@/common/assets/list/assetTitle.vue'
    import { message } from 'ant-design-vue'

    const props = defineProps({
        asset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
        metadata: {
            type: Object,
            required: true,
        },
    })

    const emit = defineEmits(['success', 'error'])

    const { metadata, asset } = toRefs(props)
    /**
     * TODO asset icon
     * TODO Toast message
     */
    const {
        getDatatypeOfAttribute,
        isLink,
        formatDisplayValue,
        getApplicableAttributes,
        getEnumOptions,
        getHumanTypeName,
        attributeHasValue: hasValue,
        parseAttributeValueHelper,
    } = useCustomMetadataHelpers()

    const applicableList = ref()

    const initializeAttributesList = () => {
        applicableList.value = []
        applicableList.value = getApplicableAttributes(
            metadata.value,
            asset.value.typeName
        )
    }

    const filterAttributeList = () => {
        applicableList.value = applicableList.value.filter((a) => hasValue(a))
    }

    /**
     * @desc parses all the attached bm from the asset payload and
     *  forms the initial attribute list && attaches value to the attribute list
     */
    const setAttributesList = () => {
        initializeAttributesList()
        parseAttributeValueHelper(applicableList, asset, metadata)
        filterAttributeList()
    }

    onMounted(() => {
        setAttributesList()
    })

    const { error, isReady, isLoading, mutate } = removeProperty(
        asset.value,
        metadata.value
    )

    const handleClear = async () => {
        try {
            message.loading({
                key: 'clear',
                content: 'Clearing Custom Metadata ...',
            })
            await mutate()
            emit('success', asset.value.guid)
            message.success({
                key: 'clear',
                content: 'Custom Metadata has been cleared.',
            })
        } catch (e) {
            emit('error')
            message.error({
                key: 'clear',
                content: 'Errror clearing Custom Metadata.',
            })
        }
    }

    const {
        title,
        dataTypeCategoryImage,
        getConnectorImage,
        connectorName,
        connectionName,
        getProfilePath,
        isScrubbed,
    } = useAssetInfo()
</script>

<style scoped></style>
