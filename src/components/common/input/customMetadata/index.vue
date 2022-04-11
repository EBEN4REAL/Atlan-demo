<template>
    <div
        v-if="cmList(assetType(selectedAsset), false, true).length > 0"
        class="flex flex-col"
    >
        <div
            class="flex items-center justify-between mb-1 text-sm text-gray-500"
        >
            Custom Metadata
            <router-link
                v-if="checkAccess(page.PAGE_GOVERNANCE)"
                class="font-semibold text-primary hover:underline"
                to="/governance/custom-metadata"
                target="_blank"
                >Manage all</router-link
            >
        </div>
        <!--  Checking for overview flag -->
        <div
            v-for="(tab, index) in cmList(
                assetType(selectedAsset),
                false,
                true,
                denyCustomMetadata
            )"
            :key="index"
        >
            <SingleTab
                :selected-asset="asset"
                :data="tab"
                :is-drawer="isDrawer"
                :loading="isCmLoading"
                :is-cm-ready="isCmReady"
                :tab="{
                    image: tab.options?.imageId || tab.options?.logoUrl,
                    emoji: tab.options?.emoji,
                    name: tab.label,
                    tooltip: tab.label,
                }"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        toRefs,
        ref,
        watch,
    } from 'vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'
    import SingleTab from './singleTab.vue'
    import { useTypedefStore } from '~/store/typedef'
    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'
    import { usePersonaStore } from '~/store/persona'
    import useAssetStore from '~/store/asset'
    import page from '~/constant/accessControl/page'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        name: 'CustomMetadata',
        components: { SingleTab },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const { assetType } = useAssetInfo()
            const guid = ref()

            const { getList: cmList } = useCustomMetadataFacet()

            const { checkAccess } = useAuth()

            const discoveryStore = useAssetStore()

            const typedefStore = useTypedefStore()

            const personaStore = usePersonaStore()
            const { globalState } = toRefs(discoveryStore)

            const denyCustomMetadata = computed(
                () =>
                    personaStore.list.find(
                        (persona) => persona.id === globalState?.value[1]
                    )?.attributes?.preferences?.customMetadataDenyList || []
            )

            const tabList = computed(() =>
                cmList(
                    assetType(selectedAsset.value),
                    false,
                    true,
                    denyCustomMetadata.value
                )
            )

            const customMetadataListProjections = computed(() => {
                const projections = []

                tabList.value.map((tab) =>
                    projections.push(
                        ...typedefStore.getCustomMetadataListProjectionsByName(
                            tab?.id
                        )
                    )
                )

                return projections
            })

            const {
                asset,
                mutate: mutateCM,
                isReady: isCmReady,
                isLoading: isCmLoading,
            } = useAssetAttributes({
                id: guid,
                attributes: customMetadataListProjections,
            })

            watch(
                () => selectedAsset.value.guid,
                () => {
                    guid.value = selectedAsset.value?.guid
                    mutateCM()
                },
                {
                    immediate: true,
                }
            )

            return {
                cmList,
                assetType,
                isCmLoading,
                isCmReady,
                asset,
                denyCustomMetadata,
                page,
                checkAccess,
            }
        },
    })
</script>
