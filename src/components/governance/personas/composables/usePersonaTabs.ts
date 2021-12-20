import { ref } from 'vue'

export const tabConfig = [
    { key: 'details', label: 'Overview' },
    { key: 'policies', label: 'Policies' },
    // { key: 'users', label: 'Users & Groups' },
]

export const activeTabKey = ref('details')

export function setActiveTab(tabKey: string) {
    activeTabKey.value = tabKey
}
