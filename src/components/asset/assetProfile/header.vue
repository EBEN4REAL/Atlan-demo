<template>
    <div class="flex items-start justify-between">
        <div class="flex">
            <div>
                <a-button
                    :ghost="true"
                    class="px-2 mr-1 border-0 outline-none"
                    style="margin-top: -2px"
                    @click="$router.back()"
                    ><atlan-icon
                        icon="ChevronDown"
                        class="w-auto transform rotate-90 h-7"
                /></a-button>
            </div>
            <div>
                <div class="flex">
                    <component
                        :is="assetData.typeName"
                        class="flex-none w-auto h-6 mt-1 mr-1"
                    ></component>
                    <div
                        class="flex items-center mt-1 mb-2 text-xl font-bold lowercase "
                    >
                        <span>{{ assetData.attributes.name }}</span>
                        <atlan-icon icon="Verified" class="w-auto h-4 ml-2" />
                    </div>
                </div>
                <div class="flex text-sm">
                    <div class="flex items-center mr-6 capitalize">
                        <img :src="integrationIcon" class="w-auto h-4 mr-2" />
                        <span>{{ assetData.attributes.integrationName }}</span>
                    </div>
                    <div class="flex items-center mr-6 lowercase">
                        <atlan-icon icon="Database" class="w-auto h-4 mr-2" />
                        <span>{{ assetData.attributes.databaseName }}</span>
                    </div>
                    <div class="flex items-center lowercase">
                        <atlan-icon icon="Schema" class="w-auto h-4 mr-2" />
                        <span class="mt-1">{{
                            assetData.attributes.schemaName
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex">
            <a-button class="px-2 mr-2"
                ><atlan-icon icon="BookmarkOutlined" class="w-auto h-4"
            /></a-button>
            <a-button class="flex items-center"
                ><atlan-icon icon="Share" class="w-auto h-4 mr-2" />
                <span class="mt-1 text-sm">Share</span></a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, inject } from 'vue'

    // Util
    import { SourceList } from '~/constant/source'

    export default defineComponent({
        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            const integrationIcon = computed(() => {
                const item = SourceList.find(
                    (src: { id: string }) =>
                        src.id === assetData.value.attributes.integrationName
                )
                return item?.image
            })

            return {
                assetData,
                integrationIcon,
            }
        },
    })
</script>
