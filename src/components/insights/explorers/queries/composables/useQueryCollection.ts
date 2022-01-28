import { Ref, ref, watch, toRaw } from 'vue'

import { useAPI } from '~/services/api/useAPI'
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
        'adminUsers',
        'adminGroups',
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
        adminUsers,
        adminGroups,
        viewerUsers,
        viewerGroups,
        icon,
        iconType,
        createdBy,
    }) => {
        const qualifiedName = `${tenantStore.tenantRaw.realm}/user/${username.value}/${uuidv4}`
        const tenantId = tenantStore.tenantRaw.realm

        const body = ref<Record<string, any>>({
            entity: {
                typeName: 'Collection',
                attributes: {
                    name,
                    description,
                    qualifiedName,
                    adminUsers,
                    adminGroups,
                    viewerUsers,
                    viewerGroups,
                    tenantId,
                    icon,
                    iconType,
                    createdBy,
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
        tabs: Ref<activeInlineTabInterface[]>,
        isCollectionCreated: Ref<Boolean>,
        collectionGuid: Ref
    ) => {
        //cases taken under consideration:
        // 1. when collection is created, select that
        // 2. if url has a collection guid, look for it, if found, select. else select another
        // 3. if a saved query is created/opened from tab, select corresponding collection
        // 4. for unsaved query opened in tab, select the collection corresponding to that

        if (collection?.length > 0) {
            if (activeInlineTab.value?.key) {
                // console.log('activeInlineTab in if: ', activeInlineTab)

                let col = collection[0]

                const activeInlineTabCopy: activeInlineTabInterface =
                    JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))

                if (isCollectionCreated.value) {
                    let l = collection.length
                    col = collection[l - 1]
                    isCollectionCreated.value = false

                    console.log('set collection create :')
                } else {
                    if (collectionGuid?.value) {
                        console.log('set collection guid collection:')
                        col = collection.find(
                            (col) => col?.guid == collectionGuid.value
                        )

                        if (col) {
                        } else {
                            col = collection[0]
                        }
                    } else if (activeInlineTabCopy?.queryId) {
                        col = collection.find(
                            (col) =>
                                col?.attributes?.qualifiedName ===
                                activeInlineTabCopy.explorer.queries.collection
                                    .qualifiedName
                        )

                        if (col) {
                        } else {
                            col = collection[0]
                        }
                    } else if (
                        activeInlineTabCopy.explorer.queries.collection
                            .qualifiedName
                    ) {
                        col = collection.find(
                            (col) =>
                                col?.attributes?.qualifiedName ===
                                activeInlineTabCopy.explorer.queries.collection
                                    .qualifiedName
                        )

                        if (!col) {
                            col = collection[0]
                        }
                    }
                }

                if (!col) {
                    col = collection[0]
                }

                activeInlineTabCopy.explorer.queries.collection = {
                    guid: col?.guid,
                    qualifiedName: col?.attributes?.qualifiedName,
                }

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

    // console.log('isCollectionPrivate: ', {collection, username})
    const isCreatedByCurrentUser =
        collection?.attributes?.__createdBy === username
    const hasNoViewers =
        collection?.attributes?.viewerUsers?.length === 0 &&
        collection?.attributes?.viewerGroups?.length === 0
    const hasNoUsers =
        collection?.attributes?.adminUsers?.length === 0 &&
        collection?.attributes?.adminGroups?.length === 0
    return isCreatedByCurrentUser && hasNoUsers && hasNoViewers
}

export default useQueryCollection
