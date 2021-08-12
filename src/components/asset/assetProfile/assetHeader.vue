<template>
    <div class="flex items-center">
        <!-- <component :is="asset.typeName" class="w-auto h-10 mr-2"></component> -->
        <div>
            <div class="mb-2 text-2xl font-bold">
                {{ asset.attributes.name }}
            </div>
            <div class="flex text-xs text-gray-600 font-extralight">
                <span class="mr-4">{{ asset.typeName }}</span>
                <span class="flex items-center mr-4"
                    ><img :src="integrationIcon" class="w-auto h-3 mr-1" />
                    {{ asset.attributes.integrationName }}</span
                >
                <span class="flex items-center mr-4"
                    ><component is="Database" class="w-auto h-3 mr-1" />{{
                        asset.attributes.databaseName
                    }}</span
                >
                <span class="flex items-center mr-4"
                    ><component is="Schema" class="w-auto h-3 mr-1" />{{
                        asset.attributes.schemaName
                    }}</span
                >
                <span class="mr-4">~{{ asset.attributes.rowCount }} rows</span>
                <span class="mr-4"
                    >{{ asset.attributes.columnCount }} columns</span
                >

                <span class="mr-4"
                    >last crawled {{ dayjs().from(attr.__timestamp, true) }} ago
                    ago,
                </span>
                <span class="mr-4"
                    >last updated
                    {{ dayjs().from(attr.__modificationTimestamp, true) }} ago
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ToRefs, toRefs, computed } from 'vue'
    // Lib
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'

    // Util
    import { SourceList } from '~/constant/source'

    dayjs.extend(relativeTime)

    export default defineComponent({
        props: ['asset'],
        setup(props) {
            /** DATA */
            const { asset }: ToRefs = toRefs(props)
            const attr = asset.value.attributes
            /** COMPUTED */
            const integrationIcon = computed(() => {
                const item = SourceList.find(
                    (src: { id: string }) =>
                        src.id === asset.value.attributes.integrationName
                )
                return item?.image
            })

            return {
                dayjs,
                integrationIcon,
                attr,
            }
        },
    })
</script>
