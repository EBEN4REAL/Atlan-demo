import { ref } from 'vue'

export const tabConfig = [
    { key: 'details', label: 'Overview' },
    { key: 'policies', label: 'Policies' },
]

export const activeTabKey = ref('details')

export function setActiveTab(tabKey: string) {
    activeTabKey.value = tabKey
}
