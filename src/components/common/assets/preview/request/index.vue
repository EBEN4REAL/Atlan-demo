<template>
    <div>
        <div class="p-4">
            <p class="text-lg font-semibold">Requests</p>
        </div>
        <div
            v-if="isLoading"
            class="flex items-center justify-center container-loading"
        >
            <AtlanLoader class="h-10" />
        </div>
        <div
            v-else-if="!requests"
            class="flex items-center justify-center container-loading"
        >
            <div class="text-gray-500">No Data</div>
        </div>
        <VirtualList
            v-else
            :data="requests"
            data-key="id"
            class="container-scroll-request"
        >
            <template #default="{ item }">
                <div class="p-4 border-b">
                    <template
                        v-if="item.requestType === 'attach_classification'"
                    >
                        <p class="text-gray-500">Link Classification</p>
                        <div class="mt-1 w-fit">
                            <ClassificationPill
                                :name="
                                    localClassification(item.payload.typeName)
                                        .name
                                "
                                :display-name="
                                    localClassification(item.payload.typeName)
                                        ?.displayName
                                "
                                :allow-delete="false"
                                :color="
                                    localClassification(item.payload.typeName)
                                        .options?.color
                                "
                                :no-hover="true"
                            />
                        </div>
                        <div class="mt-1">
                            <span class="text-sm text-gray-500">{{
                                item.createdBy
                            }}</span>
                            <span class="sparator" />
                            <span class="text-sm text-gray-500">{{
                                createdTime(item.createdAt)
                            }}</span>
                        </div>
                    </template>
                    <template v-if="item.requestType === 'term_link'">
                        <p class="text-gray-500">Link Term</p>
                        <div class="mt-1">
                            <Pill
                                :label="item?.sourceEntity?.attributes.name"
                                :has-action="false"
                            >
                                <template #prefix>
                                    <AtlanIcon icon="Term" />
                                </template>
                            </Pill>
                        </div>
                        <div class="mt-1">
                            <span class="text-sm text-gray-500">{{
                                item.createdBy
                            }}</span>
                            <span class="sparator" />
                            <span class="text-sm text-gray-500">{{
                                createdTime(item.createdAt)
                            }}</span>
                        </div>
                    </template>
                    <!-- <p class="text-gray-500">Update Description</p>
            <p class="mt-1 text-gray-700">
                {{ '-' }}
            </p>
            <div class="mt-1">
                <span class="text-sm text-gray-500">Shreyas Gupta</span>
                <span class="sparator" />
                <span class="text-sm text-gray-500">{{
                    useTimeAgo(updatedBy.timestamp)
                }}</span>
            </div> -->
                </div>
            </template>
        </VirtualList>

        <!-- <div class="p-4 border-b">
            <p class="text-gray-500">Update Certificate</p>
            <div class="flex items-center mt-1 text-gray-700">
                <AtlanIcon class="mr-1 cross-icon" icon="CrossCircle" />
                Deprecated
            </div>
            <div class="mt-1">
                <span class="text-sm text-gray-500">Shreyas Gupta</span>
                <span class="sparator" />
                <span class="text-sm text-gray-500">5 days ago</span>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { useRequest } from '~/composables/discovery/useRequest'
    import Pill from '~/components/UI/pill/pill.vue'
    import ClassificationPill from '@/common/pills/classification.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'

    export default defineComponent({
        name: 'RequestTab',
        components: { Pill, ClassificationPill, VirtualList },
        props: {
            selectedAsset: {
                type: Object,
                default: () => ({}),
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const { classificationList } = useTypedefData()
            const { data, isLoading } = useRequest(selectedAsset.value.guid)
            const requests = computed(() => data?.value?.records)
            const createdTime = (time) => useTimeAgo(time).value
            const localClassification = (typeName) =>
                classificationList.value.find((clsf) => clsf?.name === typeName)

            return {
                data,
                useTimeAgo,
                requests,
                createdTime,
                localClassification,
                isLoading,
            }
        },
    })
</script>

<style lang="less">
    .container-scroll-request {
        max-height: 555px;
        .classification-pill {
            width: fit-content;
        }
    }
</style>
<style lang="less" scoped>
    .sparator {
        border-right: 1px solid #e6e6eb;
        height: 10px;
        margin: 0 5px;
    }
    .container-loading {
        height: 500px;
    }
</style>
