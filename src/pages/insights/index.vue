<template>
    <DndProvider :backend="HTML5Backend">
        <InsightsComponent v-if="featureEnabledMap[INSIGHT_WORKSPACE_LEVEL_TAB]" />
        <div v-else class="flex items-center justify-around w-full h-full">
            <div class="flex flex-col items-center">
                <AtlanIcon icon="LockedFile" class="h-32" />
                <span class="mt-5 text-2xl font-bold">Insights is disabled</span>
                <span class="text-base text-gray-500"
                    >Insights workspace is disabled by your admin.</span
                >
            </div>
        </div>
    </DndProvider>
</template>

<script lang="ts">
    import {
        defineComponent,
        provide,
        ref,
        computed,
        Ref,
        watch,
        onMounted,
    } from 'vue'
    import { useHead } from '@vueuse/head'
    import { HTML5Backend } from 'react-dnd-html5-backend'
    import { DndProvider } from 'vue3-dnd'
    import { useRoute, useRouter } from 'vue-router'
    import { message } from 'ant-design-vue'
    import InsightsComponent from '~/components/insights/index.vue'
    import { SavedQuery } from '~/types/insights/savedQuery.interface'
    import {
        AssetAttributes,
        SavedQueryAttributes,
        InternalAttributes,
        AssetRelationAttributes,
    } from '~/constant/projection'
    import { useDiscoverList as useAssetData } from '~/composables/discovery/useDiscoverList'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'
    import insightsStore from '~/store/insights/index'
    import {
        featureEnabledMap,
        INSIGHT_WORKSPACE_LEVEL_TAB,
    } from '~/composables/labs/labFeatureList'
    

    export default defineComponent({
        name: 'Insights Page',
        components: { 
            InsightsComponent, 
            DndProvider,
        },
        props: {},
        setup(props) {
            useHead({
                title: 'Insights',
            })
            // insights Store initialization
            const store = insightsStore()
            const route = useRoute()
            const router = useRouter()
            const savedQueryGuidFromURL = computed(() => route.query?.id)
            const collectionGuidFromURL = ref(route.query?.col_id)
            const runQuery = ref(route.query?.runQuery)
            const isVisualQuery = computed(() => route.query?.vqb === 'true')

            let refetchQueryCollection = ref() as Ref<Function>

            let isCollectionCreated = ref(false) as Ref<Boolean>

            const isSavedQueryInfoLoaded = ref(true)
            const queryFolderNamespace: Ref<any> = ref()
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
            const assetGuidFromURL = route.query?.guid
            const openVQB = route.query?.openVQB

            /* --------PROVIDERS---- */
            provide(
                'databaseQualifiedNameFromURL',
                databaseQualifiedNameFromURL
            )
            provide('schemaNameFromURL', schemaNameFromURL)
            provide('tableNameFromURL', tableNameFromURL)
            provide('columnNameFromURL', columnNameFromURL)
            provide('assetGuidFromURL', assetGuidFromURL)
            provide('openVQB', openVQB)

            provide('savedQueryGuidFromURL', savedQueryGuidFromURL)
            provide('runQuery', runQuery)
            provide('savedQueryInfo', savedQueryInfo)
            provide('queryFolderNamespace', queryFolderNamespace)
            provide('refetchQueryCollection', refetchQueryCollection)
            provide('isCollectionCreated', isCollectionCreated)
            provide('permissions', permissions)
            provide('collectionGuidFromURL', collectionGuidFromURL)
            /* --------------------- */
            console.log(savedQueryGuidFromURL.value)

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SavedQueryAttributes,
            ])

            const fetchAndPassSavedQueryInfo = () => {
                const facets = ref({
                    guid: savedQueryGuidFromURL.value,
                })
                // console.log('run query: ', runQuery.value)
                const { list, error, isLoading } = useAssetData({
                    facets,
                    dependentKey: ref('insights_saved_query'),
                    relationAttributes: ref(AssetRelationAttributes),
                    attributes: defaultAttributes,
                    limit: ref(1),
                })
                watch([list, error, isLoading], () => {
                    if (isLoading.value == false) {
                        isSavedQueryInfoLoaded.value = false
                        if (error.value === undefined) {
                            isSavedQueryInfoLoaded.value = false
                            // savedQueryInfo.value = data.value.entit
                            if (list.value && list.value?.length > 0) {
                                savedQueryInfo.value = list.value[0]

                                const queryParams = {
                                    id: list.value[0]?.guid,
                                }
                                router.push({
                                    path: `insights`,
                                    query: queryParams,
                                })
                            } else {
                                message.error({
                                    content: `Saved query not found`,
                                })
                                router.push('/insights')
                                savedQueryInfo.value = {}
                            }
                        } else {
                            message.error({
                                content: `Error in fetching this query!`,
                            })
                        }
                    }
                })
            }

            const sendPageTrack = () => {
                const name = savedQueryGuidFromURL.value
                    ? 'saved_query'
                    : 'home'
                useTrackPage('insights', name, {
                    is_visual_query: isVisualQuery.value,
                })
            }

            watch([savedQueryGuidFromURL, isVisualQuery], () => {
                sendPageTrack()
            })

            onMounted(() => {
                if (savedQueryGuidFromURL.value) {
                    fetchAndPassSavedQueryInfo()
                }
                sendPageTrack()
            })
            return {
                featureEnabledMap,
                INSIGHT_WORKSPACE_LEVEL_TAB,
                HTML5Backend
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
