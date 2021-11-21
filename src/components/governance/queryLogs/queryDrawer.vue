<!-- This component works in 3 modes/views: 1/ form to generate a key 2/ form to update/delete a key 3/ info for generated key; generatedAPIKey (3) is the first level of distinction bw these modes/views, if value exists for that we show the third screen; If not we check if the passed in key (props) that we take in this component as apiKeyDirty has an id or not; if it has id, we are in edit mode i.e. 2nd screen (form is prefilled) else new key generation mode (form is empty)-->
<template>
    <div class="h-full">
        <div
            class="flex items-center justify-between p-4 border-b border-gray-300 "
        >
            <span class="text-base font-bold tex-gray-700">Query details</span>
            <div class="top-0 p-1 cursor-pointer right-2">
                <AtlanIcon icon="Cross" class="r" @click="handleClose" />
            </div>
        </div>
        <div class="p-4">
            <SQLSnippet :text="query._source.log.message?.userSqlQuery" />
        </div>
        <div v-if="Object.keys(metadata).length" class="p-4">
            <div v-for="meta in Object.keys(metadata)" :key="meta">
                <div v-if="metadata[meta].value" class="flex items-center mb-2">
                    <div class="w-1/4">{{ metadata[meta].keyDisplayName }}</div>
                    <div class="flex items-center w-3/4 mt-1 ml-4">
                        <img
                            v-if="
                                metadata[meta].connector &&
                                metadata[meta].connector.image
                            "
                            :src="metadata[meta].connector.image"
                            class="w-4 h-4 mr-1 -mt-0.5"
                        />
                        <div
                            class="flex items-center w-full text-gray-500 break-all "
                        >
                            <AtlanIcon
                                v-if="metadata[meta].icon"
                                :icon="`${metadata[meta].icon}`"
                                class="w-1/12 mr-1"
                            />

                            <div>{{ metadata[meta].value }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="durationDetails.executionTimeString" class="border-t">
            <div class="flex p-4">
                <div class="w-1/4">Duration</div>
                <div class="w-full">
                    <div>
                        <a-progress
                            :success="durationObj"
                            :trail-color="'#E6E6EB'"
                            :percent="durationObj.percent"
                        ></a-progress>
                    </div>

                    <div class="mt-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div
                                    class="w-2 h-2 mr-2 rounded-full bg-success"
                                ></div>
                                <div>Source execution time</div>
                            </div>
                            <div class="font-bold">
                                {{ durationDetails.executionTimeString }}
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <div class="flex items-center">
                                <div
                                    class="w-2 h-2 mr-2 bg-gray-300 rounded-full "
                                ></div>
                                <div>Total time</div>
                            </div>
                            <div class="font-bold">
                                {{ durationDetails.totalTimeString }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs, computed } from 'vue'
import { useVModels } from '@vueuse/core'
import { message } from 'ant-design-vue'
import SQLSnippet from '@common/sql/snippet.vue'
import { getQueryMetadata } from '@/governance/queryLogs/composables/useQueryLogs'

export default defineComponent({
    name: 'QueryPreviewDrawer',
    components: { SQLSnippet },
    props: {
        query: {
            type: Object,
            default: () => {},
        },
    },
    emits: ['updateAPIKey', 'closeDrawer'],
    setup(props, { emit }) {
        const { query } = toRefs(props)
        const handleClose = () => {
            emit('closeDrawer')
        }
        const metadata = ref({})
        watch(
            query,
            () => {
                metadata.value = getQueryMetadata(query.value)
            },
            { immediate: true }
        )
        const getDurationPercent = () => {
            if (
                query?.value?._source?.message?.executionTime &&
                query?.value?._source?.message?.totalTime
            ) {
                return (
                    (query.value._source.message.executionTime /
                        query.value._source.message.totalTime) *
                    100
                ).toFixed()
            }
            return 0
        }
        const durationDetails = computed(() => {
            const result = {
                executionTimeString: '',
                totalTimeString: '',
            }
            if (query?.value?._source?.message?.executionTime) {
                const time = query?.value?._source?.message?.executionTime

                if (time < 1000) result.executionTimeString = `${time}ms`
                else if (time / 1000 < 60)
                    result.executionTimeString = `${time / 1000}s`
                else
                    result.executionTimeString = `${time / (1000 * 60)}m${
                        time % (1000 * 60)
                    }s`
            } else result.executionTimeString = ''
            if (query?.value?._source?.message?.totalTime) {
                const time = query?.value?._source?.message?.totalTime
                if (time < 1000) result.totalTimeString = `${time}ms`
                else if (time / 1000 < 60)
                    result.totalTimeString = `${time / 1000}s`
                else
                    result.totalTimeString = `${time / (1000 * 60)}m${
                        time % (1000 * 60)
                    }s`
            } else result.totalTimeString = ''

            return result
        })

        const durationObj = computed(() => ({
            percent: getDurationPercent(),
            strokeColor: '#00A680',
        }))
        return { query, metadata, handleClose, durationObj, durationDetails }
    },
})
</script>
<style lang="less"></style>
<style lang="less" scoped></style>