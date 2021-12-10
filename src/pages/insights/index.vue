<template>
    <InsightsComponent />
    <div></div>
</template>

<script lang="ts">
import {
    defineComponent,
    provide,
    ref,
    toRef,
    computed,
    Ref,
    watch,
    onMounted,
} from 'vue'
import { useHead } from '@vueuse/head'
import InsightsComponent from '~/components/insights/index.vue'
// import AssetDiscovery from '@/assets/index.vue'
import { useRoute } from 'vue-router'
import { Insights as InsightsAPI } from '~/services/meta/insights'
import { message } from 'ant-design-vue'
import { SavedQuery } from '~/types/insights/savedQuery.interface'
import useQueryFolderNamespace from '~/components/insights/explorers/queries/composables/useQueryFolderNamespace'
import useQueryCollection from '~/components/insights/explorers/queries/composables/useQueryCollection'
// import { QueryFolderNamespace as QueryFolderNamespaceInterface } from '~/types/insights/savedQuery.interface'
export default defineComponent({
    name: 'Insights Page',
    components: { InsightsComponent },
    props: {},
    setup(props) {
        useHead({
            title: 'Insights',
        })
        const route = useRoute()
        const { getQueryFolderNamespace } = useQueryFolderNamespace()
        const { getQueryCollections } = useQueryCollection()
        const savedQueryGuidFromURL = ref(route.query?.id)

        const isSavedQueryInfoLoaded = ref(true)
        const queryFolderNamespace: Ref<any> = ref()
        const queryCollections: Ref<any> = ref()
        const savedQueryInfo = ref(undefined) as unknown as Ref<
            SavedQuery | undefined
        >
        const permissions = computed(() => ({
            private: {
                readQueries: 'READ_PRIVATE_QUERIES',
                readFolders: 'READ_PRIVATE_FOLDERS',
                createQuery: 'CREATE_PRIVATE_QUERIES',
                createFolder: 'CREATE_PRIVATE_FOLDERS',
                deleteQuery: 'DELETE_PRIVATE_QUERIES',
                deleteFolder: 'DELETE_PRIVATE_FOLDERS',
                updateQuery: 'UPDATE_PRIVATE_QUERIES',
                updateFolder: 'UPDATE_PRIVATE_FOLDERS',
                privateToPublicQuery: 'PRIVATE_QUERY_TO_PUBLIC_QUERY',
                privateToPublicFolder: 'PRIVATE_FOLDER_TO_PUBLIC_FOLDER',
            },
            public: {
                readQueries: 'READ_PUBLIC_QUERIES',
                readFolders: 'READ_PUBLIC_FOLDERS',
                createQuery: 'CREATE_PUBLIC_QUERIES',
                createFolder: 'CREATE_PUBLIC_FOLDERS',
                deleteQuery: 'DELETE_PUBLIC_QUERIES',
                deleteFolder: 'DELETE_PUBLIC_FOLDERS',
                updateQuery: 'UPDATE_PUBLIC_QUERIES',
                updateFolder: 'UPDATE_PUBLIC_FOLDERS',
            },
            runQuery: 'RUN_QUERY',
            // add: accessStore.checkPermission('ADD_USER_GROUP'),
            // remove: accessStore.checkPermission('REMOVE_USER_GROUP'),
            // create: accessStore.checkPermission('CREATE_GROUP'),
            // update: accessStore.checkPermission('UPDATE_GROUP'),
        }))

        const databaseQualifiedNameFromURL =
            route.query?.databaseQualifiedNameFromURL

        const schemaNameFromURL = route.query?.schemaNameFromURL
        const tableNameFromURL = route.query?.tableNameFromURL
        const columnNameFromURL = route.query?.columnNameFromURL

        /* --------PROVIDERS---- */
        provide('databaseQualifiedNameFromURL', databaseQualifiedNameFromURL)
        provide('schemaNameFromURL', schemaNameFromURL)
        provide('tableNameFromURL', tableNameFromURL)
        provide('columnNameFromURL', columnNameFromURL)

        provide('savedQueryGuidFromURL', savedQueryGuidFromURL)
        provide('savedQueryInfo', savedQueryInfo)
        provide('queryFolderNamespace', queryFolderNamespace)
        provide('queryCollections', queryCollections)
        provide('permissions', permissions)
        /* --------------------- */
        console.log(savedQueryGuidFromURL.value)

        let queryBody = ref({})
        const refreshGetQueryBody = () => {
            queryBody.value = {
                dsl: {
                    query: {
                        bool: {
                            must: [
                                {
                                    term: {
                                        '__typeName.keyword': 'Query',
                                    },
                                },
                            ],
                        },
                    },
                },
                attributes: [
                    'name',
                    'displayName',
                    'typeName',
                    'dataType',
                    'description',
                    'userDescription',
                    'certificateStatus',
                    'ownerUsers',
                    'ownerGroups',
                    'classifications',
                    'connectorName',
                    'connectionId',
                    'connectionQualifiedName',
                    'parentFolderQualifiedName',
                    'defaultSchemaQualifiedName',
                    'parentFolder',
                    'columns',
                    'folder',
                    'compiledQuery',
                    'rawQuery',
                    '__timestamp',
                    '__modificationTimestamp',
                    '__modifiedBy',
                    '__createdBy',
                    '__state',
                    '__guid',
                    '__historicalGuids',
                    '__classificationsText',
                    '__classificationNames',
                    '__propagatedClassificationNames',
                    '__customAttributes',
                    '__labels',
                    'anchor',
                    '__timestamp',
                    '__modificationTimestamp',
                    '__modifiedBy',
                    '__createdBy',
                    '__state',
                    '__guid',
                    '__historicalGuids',
                    '__classificationsText',
                    '__classificationNames',
                    '__propagatedClassificationNames',
                    '__customAttributes',
                    '__labels',
                    'name',
                    'displayName',
                    'description',
                    'displayDescription',
                    'userDescription',
                    'tenantId',
                    'certificateStatus',
                    'certificateStatusMessage',
                    'certificateUpdatedAt',
                    'certificateUpdatedBy',
                    'assetStatusMessage',
                    'announcementMessage',
                    'announcementTitle',
                    'announcementType',
                    'announcementUpdatedAt',
                    'announcementUpdatedBy',
                    'connectionLastSyncedAt',
                    'connectionQualifiedName',
                    'rowCount',
                    'columnCount',
                    'sizeBytes',
                    'subType',
                    'image',
                    'sourceRefreshFrequency',
                    'sourceCreatedBy',
                    'sourceCreatedAt',
                    'sourceUpdatedAt',
                    'sourceUpdatedBy',
                    'databaseCount',
                    'databaseCrawledCount',
                    'schemaCount',
                    'schemaCrawledCount',
                    'tableCount',
                    'tableCrawledCount',
                    'dataType',
                    'table',
                    'tableName',
                    'viewName',
                    'lastUpdatedByJob',
                    'category',
                    'host',
                    'botQualifiedName',
                    'schemaName',
                    'databaseName',
                    'logo',
                    'viewDefinition',
                    'popularityScore',
                    'readers',
                    'sourceViewCount',
                    'integrationCredentialQualifiedName',
                    'connectionName',
                    'ownerUsers',
                    'ownerGroups',
                    'databaseQualifiedName',
                    'defaultDatabaseQualifiedName',
                    'isPrimary',
                    'isPartition',
                    'readme',
                    'parent',
                    'connectionLastSyncedJob',
                    'qualifiedName',
                    'connectionName',
                    'isDiscoverable',
                    'alias',
                    'rawQuery',
                    'compiledQuery',
                    'connectionId',
                    'isPrivate',
                    'variablesSchemaBase64',
                    'isSnippet',
                ],
                relationAttributes: ['name'],
            }
        }

        const fetchAndPassSavedQueryInfo = () => {
            refreshGetQueryBody()
            queryBody.value.dsl.query.bool.must.push({
                term: {
                    __guid: savedQueryGuidFromURL.value,
                },
            })
            const { data, error, isLoading } = InsightsAPI.GetSavedQueryIndex(
                queryBody,
                {}
            )

            // const { data, error, isLoading } =
            //     InsightsAPI.GetSavedQuery(
            //         savedQueryGuidFromURL.value as string,
            //         {}
            //     )
            watch([data, error, isLoading], () => {
                if (isLoading.value == false) {
                    isSavedQueryInfoLoaded.value = false
                    if (error.value === undefined) {
                        isSavedQueryInfoLoaded.value = false
                        // savedQueryInfo.value = data.value.entity
                        if (
                            data.value?.entities &&
                            data.value?.entities?.length
                        ) {
                            savedQueryInfo.value = data.value.entities[0]
                        } else {
                            savedQueryInfo.value = {}
                        }

                        console.log('open saved query: ', data.value)
                    } else {
                        message.error({
                            content: `Error in loading this query!`,
                        })
                    }
                }
            })
        }
        const fetchQueryFolderNamespace = () => {
            const { data, error, isLoading } = getQueryFolderNamespace()
            watch([data, error, isLoading], () => {
                if (isLoading.value == false) {
                    if (error.value === undefined) {
                        if (
                            data.value?.entities &&
                            data.value?.entities?.length > 0
                        ) {
                            queryFolderNamespace.value = data.value.entities[0]
                        }
                    } else {
                        message.error({
                            content: `Error in fetching root Info`,
                        })
                    }
                }
            })
        }
        const fetchQueryCollections = () => {
            queryCollections.value = 'hii'
            const { data, error, isLoading } = getQueryCollections()
            watch([data, error, isLoading], () => {
                if (isLoading.value === false) {
                    if (error.value === undefined) {
                        if (
                            data.value?.entities &&
                            data.value?.entities?.length > 0
                        ) {
                            // queryCollections.value = 'data.value.entities'
                            queryCollections.value = data.value.entities
                            console.log(
                                'fetchQueryCollections',
                                data.value.entities
                            )
                        }
                    } else {
                        message.error({
                            content: `Error fetching collections`,
                        })
                    }
                }
            })
        }

        onMounted(() => {
            fetchQueryCollections()
            fetchQueryFolderNamespace()

            if (savedQueryGuidFromURL.value) {
                fetchAndPassSavedQueryInfo()
            }
        })
    },
})
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
