<template>
    <div>
        <div class="mb-2.5 font-bold text-base">
            {{ assetTypeTitle }} Summary
        </div>
        <div class="flex mb-5">
            <div
                v-for="property in propertiesData"
                :key="property.id"
                class="w-1/4 mr-3"
            >
                <div class="mb-2 text-sm text-gray-500">
                    {{ property.label }}
                </div>
                <div class="text-gray-700 cursor-default">
                    <a-tooltip>
                        <template v-if="property.relatedProperty" #title>
                            {{ property[property.relatedProperty] }}
                        </template>
                        {{ property[property.id] }}
                    </a-tooltip>
                </div>
            </div>
        </div>
        <div class="max-w-screen-md mb-3.5">
            <Description
                v-if="selectedAsset.guid"
                :selected-asset="selectedAsset"
                @update:selected-asset="mutateAsset"
            />
        </div>
        <div class="flex mb-6">
            <Status
                v-if="selectedAsset.guid"
                :selected-asset="selectedAsset"
                class="w-1/4 mr-3"
                @update:selected-asset="mutateAsset"
            />

            <Owners
                v-if="selectedAsset.guid"
                :selected-asset="selectedAsset"
                class="mb-1.5"
                @update:selected-asset="mutateAsset"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, computed, ref, Ref } from 'vue'
import Description from '@common/sidebar/description.vue'
import Status from '@common/sidebar/status.vue'
import Owners from '@common/sidebar/owners.vue'
import { assetInterface } from '~/types/assets/asset.interface'
import useAssetInfo from '~/composables/asset/useAssetInfo'
import {
    useInfoPanels,
    tableauProperty,
} from '~/components/discovery/preview/tabs/info/List'

export default defineComponent({
    name: 'TableauSummary',
    components: { Description, Status, Owners },
    props: {
        selectedAsset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    },
    setup(props) {
        const { selectedAsset } = toRefs(props)
        let tableauProperties: Array<tableauProperty> | undefined = []
        const { getTableauProperties, assetTypeLabel, assetType, attributes } =
            useAssetInfo()
        const page: Ref<string> = ref('biOverview')
        const infoTab = useInfoPanels(page, selectedAsset)
        tableauProperties = infoTab?.properties
        const propertiesData = getTableauProperties(
            selectedAsset,
            tableauProperties
        )
        const assetTypeTitle = computed(() => {
            if (assetType(selectedAsset.value) === 'TableauDatasource')
                if (attributes(selectedAsset.value).isPublished)
                    return `Published Datasource`
                else return `Embedded Datasource`
            return assetTypeLabel(selectedAsset.value)
        })
        return {
            assetTypeTitle,
            propertiesData,
            tableauProperties,
        }
    },
})
</script>

<style>
</style>