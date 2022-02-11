<template>
    <div
        class="flex w-full h-full bg-white"
        :class="$style.splitpane__glossary"
    >
        <splitpanes v-if="isItem" class="w-full h-full bg-white">
            <pane
                min-size="20"
                max-size="50"
                :size="22"
                style="min-width: 264px"
            >
                <div class="h-full">
                    <GlossaryDiscovery
                        ref="glossaryDiscovery"
                        class="h-full"
                    ></GlossaryDiscovery>
                </div>
            </pane>
            <pane :size="78" class="flex bg-white">
                <div class="flex w-full h-full">
                    <router-view
                        v-if="isItem"
                        :selected-asset="selectedGlossary"
                    />
                </div>
                <div class="h-full bg-white border-l asset-preview-container">
                    <GlossaryPreview
                        :selected-asset="localSelected"
                    ></GlossaryPreview>
                </div>
            </pane>
        </splitpanes>
        <div
            v-else
            class="flex flex-col items-center justify-center w-full h-full"
        >
            <template v-if="!glossaryList?.length">
                <atlan-icon
                    icon="GlossaryGettingStarted"
                    class="mb-10 mr-2 h-36"
                />
                <span class="mb-5 text-2xl font-bold">
                    Start building your Business Glossary!</span
                >
                <span class="w-1/2 mb-16 text-base text-center"
                    >Create a searchable source of truth for all your business
                    terms & metrics for your organization. Link these terms to
                    all your data assets.</span
                >
                <AddGTCModal
                    entityType="AtlasGlossary"
                    @add="handleAddGlossary"
                >
                    <template #trigger>
                        <a-button
                            class="flex items-center px-8 py-2 space-x-2"
                            type="primary"
                            >Get Started <atlan-icon icon="ArrowRight"
                        /></a-button>
                    </template>
                </AddGTCModal>
            </template>
            <template v-else>
                <AtlanLoader class="h-12" />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        provide,
        watch,
        ref,
        onMounted,
    } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute, useRouter } from 'vue-router'

    import GlossaryDiscovery from '@/glossary/index.vue'
    import GlossaryPreview from '@/common/assets/preview/index.vue'
    import AddGTCModal from '@/glossary/modal/addGtcModal.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryStore from '~/store/glossary'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'

    export default defineComponent({
        components: {
            GlossaryDiscovery,
            GlossaryPreview,
            AddGTCModal,
        },
        setup() {
            useHead({
                title: 'Glossary',
            })
            const route = useRoute()
            const router = useRouter()
            const id = computed(() => route?.params?.id || null)
            const isItem = computed(() => !!route.params.id)
            const { selectedGlossary } = useAssetInfo()
            const { getGlossaryByQF, getFirstGlossaryQF } = useGlossaryData()
            const localSelected = ref()
            const glossaryStore = useGlossaryStore()
            const glossaryDiscovery = ref(null)
            const selectedGlossaryQf = ref(
                glossaryStore.activeGlossaryQualifiedName
            )

            if (selectedGlossary.value?.guid === id.value) {
                localSelected.value = selectedGlossary.value
            }
            const handlePreview = (asset) => {
                if (id?.value === asset?.guid) {
                    localSelected.value = asset
                    glossaryStore.setSelectedGTC(asset)
                }
            }

            watch(selectedGlossary, () => {
                localSelected.value = selectedGlossary.value
            })
            const reInitTree = () => {
                glossaryDiscovery?.value?.reInitTree()
            }
            const updateTreeNode = (asset) => {
                glossaryDiscovery?.value?.updateTreeNode(asset)
            }
            const handleSelectGlossary = (val) => {
                glossaryDiscovery?.value?.changeSelectedGlossary(val)
            }
            const handleAddGlossary = (asset) => {
                glossaryStore.addGlossary(asset)
                glossaryStore.setSelectedGTC(asset)
                router.push(
                    `/glossary/${getGlossaryByQF(getFirstGlossaryQF())?.guid}`
                )
            }

            const updateList = (asset) => {
                console.log(asset)
                handlePreview(asset)
                if (asset?.typeName === 'AtlasGlossary') {
                    glossaryStore.updateGlossary(asset)
                }
                updateTreeNode(asset)
            }

            // re-route on no id present in params
            const reRoute = () => {
                if (
                    selectedGlossaryQf.value?.length &&
                    getGlossaryByQF(selectedGlossaryQf.value)
                ) {
                    updateList(getGlossaryByQF(selectedGlossaryQf.value))
                    router.replace(
                        `/glossary/${
                            getGlossaryByQF(selectedGlossaryQf.value)?.guid
                        }/overview`
                    )
                } else if (
                    getFirstGlossaryQF() &&
                    getGlossaryByQF(getFirstGlossaryQF())
                ) {
                    updateList(getGlossaryByQF(getFirstGlossaryQF()))
                    router.replace(
                        `/glossary/${
                            getGlossaryByQF(getFirstGlossaryQF())?.guid
                        }/overview`
                    )
                } else router.push('/glossary')
            }
            onMounted(() => {
                if (!id.value) {
                    reRoute()
                }
            })
            watch(id, () => {
                if (!id.value && route.path === '/glossary') {
                    reRoute()
                }
            })
            provide('updateList', updateList)
            provide('preview', handlePreview)
            provide('reInitTree', reInitTree)
            provide('handleSelectGlossary', handleSelectGlossary)
            return {
                isItem,
                selectedGlossary,
                localSelected,
                glossaryDiscovery,
                selectedGlossaryQf,
                getGlossaryByQF,
                handleAddGlossary,
                glossaryList: glossaryStore.list,
            }
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        width: 420px !important;
        max-width: 420px !important;
        min-width: 420px !important;
    }
</style>
<style lang="less" module>
    .splitpane__glossary {
        :global(.splitpanes__splitter) {
            background-color: #fff;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            position: relative;
            -ms-flex-negative: 0;
            z-index: 3 !important;
            flex-shrink: 0;
        }

        :global(.splitpanes--vertical > .splitpanes__splitter) {
            position: relative;
            touch-action: none;
            border-width: 0.5px !important;
            &:before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                transition: opacity 0.4s;
                @apply bg-primary;
                opacity: 0;
                z-index: 1;
                left: -1px;
                right: -1px;
                height: 100%;
            }

            &:hover {
                &:before {
                    opacity: 1;
                    width: 2.5px !important;
                }
            }
            &:after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
                z-index: 1;
                left: -8px;
                right: -8px;
                height: 100%;
            }
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
