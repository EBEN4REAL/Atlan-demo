<template>
    <div class="flex w-full h-full bg-white">
        <splitpanes
            class="w-full h-full bg-white"
            :class="$style.splitpane__styles"
        >
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
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryStore from '~/store/glossary'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'

    export default defineComponent({
        components: {
            GlossaryDiscovery,
            GlossaryPreview,
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
                localSelected.value = asset
                glossaryStore.setSelectedGTC(asset)
            }

            const updateList = (asset) => {
                localSelected.value = asset
                handlePreview(asset)
                glossaryStore.setSelectedGTC(asset)
                updateTreeNode(asset)
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
            onMounted(() => {
                if (selectedGlossary.value?.guid) {
                    router.push(`/glossary/${selectedGlossary.value?.guid}`)
                }
                if (!id.value) {
                    if (selectedGlossaryQf.value?.length) {
                        router.push(
                            `/glossary/${
                                getGlossaryByQF(selectedGlossaryQf.value)?.guid
                            }`
                        )
                    } else {
                        router.push(
                            `/glossary/${
                                getGlossaryByQF(getFirstGlossaryQF())?.guid
                            }`
                        )
                    }
                }
            })
            provide('updateList', updateList)
            provide('preview', handlePreview)
            provide('reInitTree', reInitTree)
            return {
                isItem,
                selectedGlossary,
                localSelected,
                glossaryDiscovery,
                selectedGlossaryQf,
                getGlossaryByQF,
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
    :global(.splitpanes) {
        &__splitter {
            @apply bg-gray-200 !important;
            position: relative;
        }

        &__splitter:before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            transition: 0.4s;
        }
        &--vertical > &__splitter:before {
            left: -1px;
            right: -1px;
        }
        &--horizontal > &__splitter:before {
            top: -1px;
            bottom: -1px;
        }
        &__splitter:hover:before {
            background-color: #5277d7;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
