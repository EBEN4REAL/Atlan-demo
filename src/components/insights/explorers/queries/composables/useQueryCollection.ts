import { Ref, ref, watch } from 'vue'

// import { QueryFolderNamespace } from '~/types/insights/savedQuery.interface'
// import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'

import { useAPI } from '~/services/api/useAPI'
// import { map } from '~/services/meta/insights/key'
import { map } from '~/services/meta/search/key'
import { InternalAttributes } from '~/constant/projection'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { QueryCollection } from '~/types/insights/savedQuery.interface'
import { useTenantStore } from '~/store/tenant'
import whoami from '~/composables/user/whoami'
import { Insights } from '~/services/meta/insights/index'
import { message } from 'ant-design-vue'
import { generateUUID } from '~/utils/helper/generator'
import useBody from './useBody'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

const useQueryCollection = () => {
    const { modifyActiveInlineTab } = useInlineTab()
    const { username, groups } = whoami()
    const tenantStore = useTenantStore()
    const uuidv4 = generateUUID()
    const queryCollectionsLoading = ref(true)
    const queryCollections: Ref<QueryCollection[] | undefined> = ref()
    const queryCollectionsError: Ref<QueryCollection[] | undefined> = ref()

    const attributes = [
        'name',
        'displayName',
        'typeName',
        'dataType',
        'description',
        'userDescription',
        'certificateStatus',
        'ownerUsers',
        'ownerGroups',
        'viewerUsers',
        'viewerGroups',
        'classifications',
        'icon',
        'iconType',
        ...InternalAttributes,
    ]
    const body = ref({})

    const refreshBody = () => {
        body.value = {
            dsl: useBody({
                createdBy: username.value,
                groups: groups.value,
            }),
            attributes,
        }
    }

    refreshBody()
    const getQueryCollections = () => {
        refreshBody()
        return useAPI(
            map.INDEX_SEARCH,
            'POST',
            {
                body,
            },
            {}
        )
    }

    const createCollection = ({
        name,
        description,
        ownerUsers,
        ownerGroups,
        viewerUsers,
        viewerGroups,
        icon,
        iconType,
    }) => {
        const qualifiedName = `${tenantStore.tenantRaw.realm}/user/${username.value}/${uuidv4}`
        const tenantId = tenantStore.tenantRaw.realm

        const body = ref<Record<string, any>>({
            entity: {
                typeName: 'QueryCollection',
                attributes: {
                    name,
                    description,
                    qualifiedName,
                    ownerUsers,
                    ownerGroups,
                    viewerUsers,
                    viewerGroups,
                    tenantId,
                    icon,
                    iconType,
                },
            },
        })

        const { data, error, isLoading, isReady, mutate } =
            Insights.CreateQueryCollection(body.value, {})

        watch([data, error, isLoading], () => {
            if (isLoading.value == false) {
                if (error.value === undefined) {
                    message.success({
                        content: `Collection ${name} created!`,
                    })
                    useAddEvent('insights', 'collection', 'created')
                } else {
                    // console.log(error.value.toString())
                    message.error({
                        content: `Error in creating collection!`,
                    })
                }
            }
        })

        return { data, error, isLoading, isReady, mutate }
    }

    const updateCollection = (entity) => {
        const body = ref<Record<string, any>>({
            entity: {
                ...entity,
            },
        })

        const { data, error, isLoading, isReady } =
            Insights.CreateQueryCollection(body.value, {})

        watch([data, error, isLoading], () => {
            if (isLoading.value == false) {
                if (error.value === undefined) {
                    message.success({
                        content: `Collection updated`,
                    })
                } else {
                    // console.log(error.value.toString())
                    message.error({
                        content: `Error in updating collection!`,
                    })
                }
            }
        })

        return { data, error, isLoading, isReady }
    }

    const setCollectionsDataInInlineTab = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>,
        qualifiedName: string,
        guid: string
    ) => {
        console.log('setCollectionsDataInInlineTab', qualifiedName, guid)
        // eslint-disable-next-line prefer-object-spread
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        activeInlineTabCopy.explorer.queries.collection = {
            qualifiedName,
            guid,
        }
        modifyActiveInlineTab(
            activeInlineTabCopy,
            tabs,
            activeInlineTabCopy.isSaved
        )
    }

    const selectFirstCollectionByDefault = (
        collection: QueryCollection[],
        activeInlineTab: Ref<activeInlineTabInterface>,
        tabs: Ref<activeInlineTabInterface[]>
    ) => {
        if (collection?.length > 0) {
            const col = collection[0]
            if (activeInlineTab.value?.key) {
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                activeInlineTabCopy.explorer.queries.collection.guid = col.guid
                activeInlineTabCopy.explorer.queries.collection.qualifiedName =
                    col?.attributes?.qualifiedName
                modifyActiveInlineTab(
                    activeInlineTabCopy,
                    tabs,
                    activeInlineTabCopy.isSaved
                )
            }
        }
    }

    return {
        queryCollectionsError,
        queryCollections,
        queryCollectionsLoading,
        selectFirstCollectionByDefault,
        refetchQueryCollection: refreshBody,
        getQueryCollections,
        setCollectionsDataInInlineTab,
        createCollection,
        updateCollection,
    }
}

export const isCollectionPrivate = (
    collection: QueryCollection,
    username: string
) => {
    // created by user
    // owner/viewer are empty
    // eslint-disable-next-line no-underscore-dangle
    const isCreatedByCurrentUser =
        collection?.attributes?.__createdBy === username
    const hasNoViewers =
        collection?.attributes?.viewerUsers.length === 0 &&
        collection?.attributes?.viewerGroups.length === 0
    const hasNoUsers =
        collection?.attributes?.ownerUsers.length === 0 &&
        collection?.attributes?.ownerGroups.length === 0
    return isCreatedByCurrentUser && hasNoUsers && hasNoViewers
}

export default useQueryCollection
