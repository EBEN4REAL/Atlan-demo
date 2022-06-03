<template>
    <div>
        <div class="">
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
        </div>
        <div class="flex">
            <div class="flex-grow">
                <div class="flex">
                    <div class="flex-grow">
                        <div class="flex">
                            <Tooltip
                                :tooltip-text="`${title(asset)}`"
                                :route-to="getProfilePath(asset)"
                                :classes="
                                    isScrubbed(asset)
                                        ? 'text-md mb-0  font-semibold cursor-pointer text-primary hover:underline opacity-80 tracking-wide'
                                        : 'text-md font-bold mb-0 cursor-pointer text-primary hover:underline tracking-wide '
                                "
                                :should-open-in-new-tab="true"
                                class="mb-1"
                                @click="(e) => e.stopPropagation()"
                            />
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
                            class="flex items-center font-normal text-gray-500"
                        >
                            <div
                                class="flex"
                                style="max-width: 10rem; white-space: pre"
                            >
                                <Tooltip
                                    :tooltip-text="a.displayName"
                                    :rows="1"
                                    placement="left"
                                    classes="text-gray-500"
                                />
                                <a-tooltip>
                                    <template #title>
                                        <span>{{ a.options.description }}</span>
                                    </template>
                                    <div class="">
                                        <AtlanIcon
                                            v-if="a.options.description"
                                            class="h-4 mb-1 ml-2 text-gray-400 hover:text-gray-500"
                                            icon="Info"
                                        />
                                    </div>
                                </a-tooltip>
                                <span>: </span>
                            </div>
                            <div class="flex-shrink">
                                <ReadOnly :attribute="a" class="ml-2" />
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
            await mutate()
            emit('success', asset.value.guid)
        } catch (e) {
            emit('error')
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
