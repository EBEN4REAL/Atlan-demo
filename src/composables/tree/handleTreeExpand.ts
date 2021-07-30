import { Ref, ref, toRaw, watch } from 'vue'
import store from '~/utils/storage'

export default function handleTreeExpand(
    emit: any,
    cacheKey?: string,
    isAccordion?: boolean
): any {
    const selectedCacheKey = `${cacheKey}_selected`
    const expandedCacheKey = `${cacheKey}_expanded`
    const selectedKeys = ref([]) as Ref<string[]>
    const expandedKeys = ref(store.get(expandedCacheKey)) as Ref<string[]>

    const selectedCache = store.get(selectedCacheKey)
    const expandedCache = store.get(expandedCacheKey)

    const expandNode = (expanded: string[], event: any) => {
        // triggered by select
        if (!event.node.isLeaf && event.event === 'select') {
            const key: string = event.node.eventKey
            const isExpanded = expandedKeys.value.includes(key)
            if (!isExpanded) {
                if (isAccordion && event.node.dataRef.isRoot) {
                    expandedKeys.value = []
                }
                expandedKeys.value.push(key)
            } else if (isExpanded) {
                const index = expandedKeys.value.indexOf(key)
                expandedKeys.value.splice(index, 1)
            }
            expandedKeys.value = [...expandedKeys.value]
        }
        store.set(expandedCacheKey, expandedKeys.value)
        return
    }
    const selectNode = (selected: any, event: any) => {
        if (!event.node.isLeaf) {
            expandNode([], event)
            selectedKeys.value = []
        } else {
            if (selectedKeys.value.includes(selected)) {
                selectedKeys.value = []
            } else {
                selectedKeys.value = selected
            }
            emit('select', event.node.eventKey)
        }
        store.set(selectedCacheKey, selectedKeys.value)
        return
    }

    const classificationSelectNode = (selected: any, node) => {
        if (selectedKeys.value.includes(selected)) {
            selectedKeys.value = []
        } else {
            selectedKeys.value = selected
        }
        if (node.node.dataRef?.isRoot) {
            expandNode([], node)
        } else {
            emit('nodeEmit', toRaw(node.node.dataRef))
        }
        return
    }

    return {
        selectedKeys,
        expandedKeys,
        selectedCache,
        expandedCache,
        expandNode,
        selectNode,
        classificationSelectNode,
    }
}
