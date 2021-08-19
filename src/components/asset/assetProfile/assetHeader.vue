<template>
    <div class="flex justify-between w-full">
        <div class="flex">
            <component :is="asset.typeName" class="w-auto mr-4 h-7"></component>
            <div>
                <div
                    class="flex items-center mb-2 text-xl font-bold leading-6 align-middle "
                >
                    <div class="align-middle">
                        {{ asset.attributes.name }}
                    </div>
                    <div class="flex items-center px-2">
                        <StatusBadge
                            :showNoStatus="true"
                            :key="asset.guid"
                            :status-id="asset?.attributes?.assetStatus"
                        ></StatusBadge>
                    </div>
                </div>
                <div
                    v-if="asset.attributes.integrationName !== 'tableau'"
                    class="flex text-xs leading-4 text-gray-700"
                >
                    <span class="flex items-center mr-4"
                        ><img
                            :src="integrationIcon"
                            class="w-auto h-3.5 mr-1"
                        />
                        {{ asset.attributes.integrationName }}</span
                    >
                    <span class="flex items-center mr-4"
                        ><component is="Database" class="w-auto h-3.5 mr-1" />{{
                            asset.attributes.databaseName
                        }}</span
                    >
                    <span class="flex items-center mr-4"
                        ><component is="Schema" class="w-auto h-3.5 mr-1" />{{
                            asset.attributes.schemaName
                        }}</span
                    >
                </div>
                <div v-else class="flex text-xs leading-4 text-gray-700">
                    <p>{{ camelTotitle(asset.typeName) }}</p>
                    <p class="ml-4">
                        {{
                            camelTotitle(
                                parentOfAssetType[asset?.typeName]
                            )?.replace('Name', '')
                        }}
                        :
                    </p>
                    <p class="ml-1 font-bold">
                        {{ getParent(parentOfAssetType[asset?.typeName]) }}
                    </p>
                </div>
            </div>
        </div>
        <div class="flex h-10 text-sm">
            <div class="icon-btn">
                <fa class="w-auto" icon="fal bookmark" />
            </div>
            <div class="ml-2 icon-btn">
                <fa class="mr-2 text-sm" icon="fal share" />
                <span class="text-sm">Share</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ToRefs, toRefs, computed } from 'vue'
    // Lib
    import StatusBadge from '@common/badge/status/index.vue'
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    import { Components } from '~/api/atlas/client'
    // Util
    import { SourceList } from '~/constant/source'

    dayjs.extend(relativeTime)

    export default defineComponent({
        components: {
            StatusBadge,
        },
        props: ['asset'],

        setup(props) {
            /** DATA */
            const { asset }: ToRefs = toRefs(props)
            const attr = asset.value.attributes
            const parentOfAssetType = {
                TableauWorksheet: 'workbookName',
                TableauWorkbook: 'projectName',
                TableauDashboard: 'workbookName',
                TableauProject: 'siteName',
                TableauDatasource: 'workbookName',
                TableauDatasourceField: 'datasourceName',
            }

            // get parent of tableau asset
            const getParent = (attr: String) => asset.value.attributes[attr]

            /** COMPUTED */
            const integrationIcon = computed(() => {
                const item = SourceList.find(
                    (src: { id: string }) =>
                        src.id === asset.value.attributes.integrationName
                )
                return item?.image
            })
            const camelTotitle = (camelCaseString: String): String => {
                if (camelCaseString)
                    return camelCaseString
                        .replace(/([A-Z])/g, (match) => ` ${match}`)
                        .replace(/^./, (match) => match.toUpperCase())
                        .trim()
            }
            return {
                dayjs,
                integrationIcon,
                attr,
                camelTotitle,
                parentOfAssetType,
                getParent,
            }
        },
    })
</script>
<style lang="less" scoped>
    .icon-btn {
        @apply flex items-center px-3 py-2 border border-gray-300 rounded cursor-pointer text-gray hover:bg-gray-100 !important;
    }
</style>
