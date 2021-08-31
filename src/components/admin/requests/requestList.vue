<template>
    <h2 class="mb-6 text-2xl font-bold">Requests {{ [...current.keys()] }}</h2>
    <VirtualList v-if="requestList.length" :data="requestList" data-key="id">
        <template #default="{ item }">
            <RequestListItem
                :request="item"
                :selected="isSelected(item.id)"
                @select="selectRequest"
            />
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue'
    import { useMagicKeys } from '@vueuse/core'

    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import RequestListItem from './requestListItem.vue'
    import { useRequestList } from '~/composables/requests/useRequests'

    export default defineComponent({
        name: 'RequestList',
        components: { VirtualList, RequestListItem },
        setup() {
            const { current } = useMagicKeys()
            const selectedList = ref(new Set<string>())
            const { response } = useRequestList()
            const requestList = computed(() => response.value?.records || [])

            function isSelected(guid: string): boolean {
                return selectedList.value.has(guid)
            }

            function selectRequest(guid: string) {
                if (
                    [
                        'MetaRight',
                        'MetaLeft',
                        'ControlLeft',
                        'ControlRight',
                    ].every((key) => !current.has(key))
                )
                    selectedList.value.clear()

                if (selectedList.value.has(guid))
                    selectedList.value.delete(guid)
                else selectedList.value.add(guid)
            }

            return {
                requestList,
                isSelected,
                selectRequest,
                selectedList,
                current,
            }
        },
    })
</script>

<style></style>
