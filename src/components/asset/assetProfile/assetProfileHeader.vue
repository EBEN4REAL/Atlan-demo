<template>
    <div class="flex items-start justify-between">
        <div class="flex">
            <div>
                <component
                    :is="asset.typeName"
                    class="flex-none w-auto h-6 mt-1 mr-3"
                ></component>
            </div>
            <div>
                <div
                    class="flex items-center mt-1 mb-2 text-xl font-bold lowercase "
                >
                    <span>{{ asset.attributes.name }}</span>
                    <atlan-icon icon="Verified" class="w-auto h-4 ml-2" />
                </div>
                <div class="flex text-sm">
                    <div class="flex items-center mr-6 capitalize">
                        <img :src="integrationIcon" class="w-auto h-4 mr-2" />
                        <span>{{ asset.attributes.integrationName }}</span>
                    </div>
                    <div class="flex items-center mr-6 lowercase">
                        <component :is="'Database'" class="w-auto h-4 mr-2" />
                        <span>{{ asset.attributes.databaseName }}</span>
                    </div>
                    <div class="flex items-center lowercase">
                        <component :is="'Schema'" class="w-auto h-4 mr-2" />
                        <span class="mt-1">{{
                            asset.attributes.schemaName
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
    import { defineComponent, ToRefs, toRefs, computed } from 'vue'

    // Util
    import { SourceList } from '~/constant/source'

    export default defineComponent({
        props: ['asset'],
        setup(props) {
            /** DATA */
            const { asset }: ToRefs = toRefs(props)

            /** COMPUTED */
            const integrationIcon = computed(() => {
                const item = SourceList.find(
                    (src: { id: string }) =>
                        src.id === asset.value.attributes.integrationName
                )
                return item?.image
            })

            return {
                integrationIcon,
            }
        },
    })
</script>
