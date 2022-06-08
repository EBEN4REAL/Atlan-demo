<template>
    <div>
        <div class="flex">
            <div class="flex-grow">
                <div
                    class="p-3 space-y-2 space-y-3 text-xs bg-gray-100 rounded-lg"
                >
                    <template v-for="a in applicableList" :key="a.name">
                        <div
                            class="flex flex-col text-gray-500 gap-y-1"
                            style="font-size: 14px"
                        >
                            <div class="flex flex-grow" qwsA>
                                <Tooltip
                                    :tooltip-text="a.displayName"
                                    :rows="1"
                                    placement="left"
                                    classes="text-gray-500 "
                                />
                            </div>
                            <div class="flex-grow">
                                <ReadOnly
                                    :attribute="a"
                                    class="text-gray-700"
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
    import { onMounted, PropType, ref, toRefs, computed } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useCustomMetadataHelpers from '~/composables/custommetadata/useCustomMetadataHelpers'
    import Tooltip from '@/common/ellipsis/index.vue'
    import ReadOnly from '@/common/assets/preview/customMetadata/readOnly.vue'

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

    const applicableList: any = ref([])

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

    const count = computed(() => applicableList.value.length)

    defineExpose({
        count,
    })

    onMounted(() => {
        setAttributesList()
    })

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
