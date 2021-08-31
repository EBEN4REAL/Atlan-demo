<template>
    <h2 class="mb-6 text-2xl font-bold">Requests {{ [...current.keys()] }}</h2>
    <VirtualList v-if="requestList.length" :data="requestList" data-key="id">
        <template #default="{ item, index }">
            <RequestListItem
                :request="item"
                :selected="isSelected(item.id)"
                @select="selectRequest(item.id, index)"
            />
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, computed, ref } from 'vue'
    import { useMagicKeys, whenever } from '@vueuse/core'

    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import RequestListItem from './requestListItem.vue'
    import { useRequestList } from '~/composables/requests/useRequests'

    export default defineComponent({
        name: 'RequestList',
        components: { VirtualList, RequestListItem },
        setup() {
            // keyboard navigation stuff
            const { current, Shift_ArrowDown, Shift_ArrowUp } = useMagicKeys()
            const selectedList = ref(new Set<string>())
            const selectedIndex = ref(-1)

            const { response } = useRequestList()
            const requestList = computed(() => response.value?.records || [])

            function isSelected(guid: string): boolean {
                return selectedList.value.has(guid)
            }

            function selectRequest(guid: string, index: number) {
                /** Check if the currently pressed key is not this array,
                 * then clear the set, else directly add the new item to the set
                 */
                if (
                    [
                        'MetaRight',
                        'MetaLeft',
                        'ControlLeft',
                        'ControlRight',
                    ].every((key) => !current.has(key))
                )
                    selectedList.value.clear()

                // Remove the request id if already present in the set
                if (selectedList.value.has(guid))
                    selectedList.value.delete(guid)
                else selectedList.value.add(guid)

                // Add the last selected index to the ref variable
                // Set it to -1 if nothing is selected
                if (selectedList.value.size) selectedIndex.value = index
                else selectedIndex.value = -1
            }

            whenever(Shift_ArrowDown, () => {
                if (selectedIndex.value < requestList.value.length - 1)
                    selectedList.value.add(
                        requestList.value[++selectedIndex.value].id
                    )
            })
            whenever(Shift_ArrowUp, () => {
                if (selectedIndex.value > -1)
                    selectedList.value.add(
                        requestList.value[selectedIndex.value--].id
                    )
            })

            return {
                requestList,
                isSelected,
                selectRequest,
                selectedList,
                selectedIndex,
                current,
            }
        },
    })
</script>

<style></style>
