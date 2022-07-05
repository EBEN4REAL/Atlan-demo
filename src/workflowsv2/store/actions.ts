import { until } from '@vueuse/core'
import { ref } from 'vue'
import { usePackageDiscoverList } from '~/workflowsv2/composables/usePackageDiscoverList'
import { useWorkflowDiscoverList } from '~/workflowsv2/composables/useWorkflowDiscoverList'
import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

const actions = {
    async fetchActivePackages(force = false) {
        // Don't refetch if data is already present
        if (Object.keys(this.activePackageMap || {}).length && !force) return

        const {
            isLoading,
            error,
            packageList: pl,
        } = useWorkflowDiscoverList({
            source: ref({
                excludes: ['spec'],
            }),
            facets: ref({
                ui: true,
                verified: true,
            }),
            aggregations: ref(['package']),
        })
        await until(isLoading).toBe(false)

        this.activePackageMap = pl.value
    },

    async fetchActivePackageMeta(force = false) {
        // Don't refetch if data is already present
        if (Object.keys(this.packageMeta || {}).length && !force) return

        const { name } = usePackageInfo()

        const { isLoading, list } = usePackageDiscoverList({
            facets: ref({ packageNames: Object.keys(this.activePackageMap) }),
            limit: ref(100),
            offset: ref(0),
        })
        await until(isLoading).toBe(false)

        this.packageMeta = list.value
            .sort(function (a, b) {
                if (name(a).toUpperCase() < name(b).toUpperCase()) return -1
                if (name(a).toUpperCase() > name(b).toUpperCase()) return 1
                return 0
            })
            .reduce((acc, pkg) => {
                acc[pkg?.metadata?.annotations?.['package.argoproj.io/name']] =
                    pkg
                return acc
            }, {})
    },

    async fetchVerifiedWorkflows(force = false) {
        // Don't refetch if data is already present
        if (Object.keys(this.verifiedWorkflows || {}).length && !force) return

        const { isLoading, error, data } = useWorkflowDiscoverList({
            source: ref({
                includes: [
                    'metadata.name',
                    'metadata.annotations.package.argoproj.io/name',
                    'metadata.annotations.orchestration.atlan.com/schedule',
                    'metadata.annotations.orchestration.atlan.com/timezone',
                    'metadata.annotations.orchestration.atlan.com/atlanName',
                ],
            }),
            facets: ref({
                ui: true,
                verified: true,
            }),
            limit: ref(300),
            preference: ref({
                sort: 'metadata.creationTimestamp-desc',
            }),
        })

        await until(isLoading).toBe(false)

        this.verifiedWorkflows = data.value?.hits.hits.reduce((acc, wf) => {
            acc[wf?._id] = wf._source
            return acc
        }, {})
    },
}
export default actions
