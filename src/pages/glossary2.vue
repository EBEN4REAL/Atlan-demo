<template>
    <div class="flex w-full h-full bg-white">
        <div class="flex-1 border-r border-gray-300 item-stretch">
            <div class="flex w-full h-full">
                <transition name="fade" v-if="isItem">
                    <router-view :selected-asset="selectedGlossary" />
                </transition>
                <keep-alive>
                    <GlossaryDiscovery
                        :style="isItem ? 'display: none !important;' : ''"
                    ></GlossaryDiscovery>
                </keep-alive>
            </div>
        </div>

        <div
            class="relative bg-white  asset-preview-container xs:hidden sm:hidden md:block lg:block"
        >
            <!-- <AssetPreview :selected-asset="selectedGlossary"></AssetPreview> -->
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, watch } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'
    import GlossaryDiscovery from '@/glossary/index.vue'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'

    export default defineComponent({
        components: {
            GlossaryDiscovery,
        },
        setup(props, { emit }) {
            useHead({
                title: 'Glossary',
            })
            const route = useRoute()
            const isItem = computed(() => !!route.params.id)

            const { selectedGlossary } = useGlossaryData()
            return {
                isItem,
                selectedGlossary,
            }
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        width: 420px !important;
        max-width: 420px !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
