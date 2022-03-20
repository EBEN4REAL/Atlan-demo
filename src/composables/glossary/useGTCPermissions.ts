import { computed, ref } from "vue"
import { debouncedWatch } from "@vueuse/core"
import useAssetInfo from '~/composables/discovery/useAssetInfo'
import useEvaluate from '~/composables/auth/useEvaluate'
import { useAuthStore } from "~/store/auth"
import useAssetEvaluate from "../discovery/useAssetEvaluation"

const useGTCPermissions = (GTC) => {
    // ? use this if you think evaluations are already fetches
    const {
        selectedAssetUpdatePermission,
    } = useAssetInfo()


    const termAddPermission = computed(
        () => {
            if (!GTC.value) return false
            return selectedAssetUpdatePermission(
                GTC.value,
                false,
                'RELATIONSHIP_ADD',
                'AtlasGlossaryTerm'
            )
        }

    )

    const categoryAddPermission = computed(
        () => {
            if (!GTC.value) return false
            return selectedAssetUpdatePermission(
                GTC.value,
                false,
                'RELATIONSHIP_ADD',
                'AtlasGlossaryCategory'
            )
        }
    )

    const entityUpdatePermission = computed(
        () => {
            if (!GTC.value) return false
            return selectedAssetUpdatePermission(
                GTC.value,
                false,
                'ENTITY_UPDATE'
            )
        }
    )

    const entityDeletePermission = computed(
        () => {
            if (!GTC.value) return false
            return selectedAssetUpdatePermission(
                GTC.value,
                false,
                'ENTITY_DELETE'
            )
        }

    )

    const createPermission = computed(() => termAddPermission.value && categoryAddPermission.value)


    return { termAddPermission, categoryAddPermission, entityUpdatePermission, entityDeletePermission, createPermission }
}


export const fetchGlossaryPermission = (glossary, immediate = false) => {
    // ? use this if you want to fetch evaluations if not fetched already
    const body = ref({})
    const authStore = useAuthStore()
    const { getAssetEvaluationsBody } = useAssetEvaluate()

    const { refresh, isLoading: isEvaluating } = useEvaluate(
        body,
        false,
        false
    )

    const fetch = () => {
        body.value = {
            entities: getAssetEvaluationsBody(
                glossary.value
            ),
        }
        const permissionsAlreadyFetched = authStore?.evaluations?.some((ev) => ev?.entityGuid === glossary.value?.guid)
        if (permissionsAlreadyFetched) return
        refresh()
    }

    if (immediate) fetch()

    const allPermissions = useGTCPermissions(glossary)

    return { ...allPermissions, isEvaluating, fetch }

}

export default useGTCPermissions