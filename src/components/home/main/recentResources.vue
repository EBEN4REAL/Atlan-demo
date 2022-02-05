<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <div v-if="isLoading">
        <AtlanLoader class="h-10" />
    </div>
    <div v-else class="overflow-y-auto resources-container">
        <div v-for="(item, index) in list" :key="index" class="mb-3">
            <!-- :selected-asset="selectedAsset" -->
            <component
                :is="getPreviewComponent(item?.attributes?.link)"
                :edit-permission="false"
                :item="item"
                class=""
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        computed,
        defineAsyncComponent,
    } from 'vue'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        InternalAttributes,
        AssetRelationAttributes,
    } from '~/constant/projection'
    import {
        isSlackLink,
        getChannelAndMessageIdFromSlackLink,
    } from '~/composables/integrations/useSlack'
    import integrationStore from '~/store/integrations/index'

    export default defineComponent({
        name: 'RecentResources',
        components: {
            slackLinkPreview: defineAsyncComponent(
                () =>
                    import(
                        '@/common/widgets/resources/previews/slackLinkPreviewCard.vue'
                    )
            ),
            linkPreview: defineAsyncComponent(
                () =>
                    import(
                        '@/common/widgets/resources/previews/linkPreviewCard.vue'
                    )
            ),
        },
        setup() {
            const dependentKey = ref('HOME_RECENTS_ASSETS')
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                typeNames: ['Link'],
            })
            const postFacets = ref({
                typeName: 'Link',
            })
            const aggregations = ref(['typeName'])
            const preference = ref({
                // sort: 'name.keyword-desc',
                sort: '__timestamp-desc',
                display: [],
            })
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
            ])
            const store = integrationStore()
            const hasAtleastOneSlackLink = computed(() => {
                const linkArr = links(selectedAsset.value)
                const slackLink = linkArr.some((link) =>
                    isSlackLink(link?.attributes?.link)
                )
                return slackLink
            })
            const { tenantSlackStatus, userSlackStatus } = toRefs(store)
            const relationAttributes = ref([...AssetRelationAttributes])
            function getPreviewComponent(url) {
                if (
                    isSlackLink(url) &&
                    tenantSlackStatus.value.configured &&
                    userSlackStatus.value.configured
                ) {
                    return 'slackLinkPreview'
                }
                return 'linkPreview'
            }

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                isValidating,
                fetch,
                error,
                quickChange,
                updateList,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                suppressLogs: true,
            })
            return {
                isLoading,
                list,
                getPreviewComponent,
                hasAtleastOneSlackLink,
                userSlackStatus,
                tenantSlackStatus,
            }
        },
    })
</script>

<style lang="less" scoped>
    .resources-container {
        height: 390px;
    }
</style>
