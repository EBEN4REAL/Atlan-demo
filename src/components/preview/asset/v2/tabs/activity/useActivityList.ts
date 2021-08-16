// Always match the exclude fields with these assettypes
// import { AssetTypeList } from '~/constant/assetType'
import { ref, computed } from 'vue'
type activityList = {
    name: string
    component: string
}
export default function useAssetAuditActivityList() {
    const activityType = ref('')
    const activityList: activityList[] = [
        {
            name: 'Owners',
            component: 'owners',
        },
        {
            name: 'Experts',
            component: 'experts',
        },
        {
            name: 'Status',
            component: 'status',
        },
        {
            name: 'UserDescription',
            component: 'userDescription',
        },
        {
            name: 'Classifications',
            component: 'classifications',
        },
        {
            name: 'Terms',
            component: 'terms',
        },
        {
            name: 'Label',
            component: 'label',
        },
    ]

    const filteredActivities = computed(() => {
        if (activityType.value)
            return activityList.filter(
                (tab) => !tab.exclude?.includes(activityType.value)
            )
        return activityList
    })

    return { allActivities: activityList, filteredActivities, activityType }
}
