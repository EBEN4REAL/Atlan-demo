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
            v-else-if="!list.length && !isLoading"
            class="flex items-center justify-center container-loading"
        >
            <div class="text-gray-500">No Data</div>
        </div>
        <VirtualList
            v-else
            :data="list"
            data-key="id"
            class="container-scroll-request"
        >
            <template #default="{ item }">
                <RequestItem
                    :item="item"
                    @handleUpdateData="handleUpdateData"
                />
            </template>
        </VirtualList>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs, ref, watch } from 'vue'
    import { useRequest } from '~/composables/discovery/useRequest'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import RequestItem from './requestItem.vue'

    export default defineComponent({
        name: 'RequestTab',
        components: { VirtualList, RequestItem },
        props: {
            selectedAsset: {
                type: Object,
                default: () => ({}),
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const list = ref([])
            const { data, isLoading } = useRequest(selectedAsset.value.guid)
            watch(data, () => {
                if (data?.value?.records) {
                    list.value = [...list.value, ...data?.value?.records]
                }
            })
            const handleUpdateData = (item) => {
                list.value = list.value.filter((el) => el.id !== item.id)
            }
            return {
                data,
                isLoading,
                list,
                handleUpdateData,
            }
        },
    })
</script>

<style lang="less">
    .container-scroll-request {
        max-height: 555px;
    }
</style>
<style lang="less" scoped>
    .container-loading {
        height: 500px;
    }
</style>
