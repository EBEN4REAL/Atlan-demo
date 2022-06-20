<template>
    <div class="p-6 py-6 rounded-lg bg-white flex flex-col">
        <span class="font-bold text-base">
            <span class="bg-primary-light rounded-md p-2 mr-2"
                ><atlan-icon icon="AssociatedTerm" class="h-5 w-4" /></span
            >Associated Terms</span
        >
        <div
            v-if="showSynonyms && synonyms(asset)?.length"
            class="flex items-center py-4"
            :class="{ 'border-b': seeAlso(asset)?.length }"
        >
            <span class="w-40">Synonyms ({{ synonyms(asset)?.length }})</span>
            <div
                v-if="synonyms(asset)?.length"
                class="flex flex-wrap items-center gap-1 text-sm text-gray-500"
            >
                <template v-for="term in synonyms(asset)" :key="term.guid">
                    <TermPopover
                        :term="term"
                        trigger="hover"
                        :passing-fetched-term="true"
                        :mouse-enter-delay="termMouseEnterDelay"
                        :fetched-term="getFetchedTerm(term.guid)"
                        :is-fetched-term-loading="termLoading"
                        @visible="
                            () => {
                                handleTermPopoverVisibility(true, term)
                            }
                        "
                    >
                        <TermPill
                            :term="term"
                            :allow-delete="false"
                            @mouseleave="termLeftPill"
                            @mouseenter="termEnteredPill"
                        />
                    </TermPopover>
                </template>
            </div>
        </div>
        <div
            v-if="showAntonyms && antonyms(asset)?.length"
            class="flex items-center py-4"
            :class="{
                'border-b':
                    (showSynonyms && synonyms(asset)?.length) ||
                    seeAlso(asset)?.length,
            }"
        >
            <span class="w-40">Antonyms ({{ antonyms(asset)?.length }})</span>
            <div
                v-if="antonyms(asset)?.length"
                class="flex flex-wrap items-center gap-1 text-sm text-gray-500 mt-2"
            >
                <template v-for="term in antonyms(asset)" :key="term.guid">
                    <TermPopover
                        :term="term"
                        trigger="hover"
                        :passing-fetched-term="true"
                        :mouse-enter-delay="termMouseEnterDelay"
                        :fetched-term="getFetchedTerm(term.guid)"
                        :is-fetched-term-loading="termLoading"
                        @visible="
                            () => {
                                handleTermPopoverVisibility(true, term)
                            }
                        "
                    >
                        <TermPill
                            :term="term"
                            :allow-delete="false"
                            @mouseleave="termLeftPill"
                            @mouseenter="termEnteredPill"
                        />
                    </TermPopover>
                </template>
            </div>
        </div>

        <div v-if="seeAlso(asset)?.length" class="flex items-center pt-4">
            <span class="w-40"
                >Related Terms ({{ seeAlso(asset)?.length }})</span
            >
            <div
                v-if="seeAlso(asset)?.length"
                class="flex flex-wrap items-center gap-1 text-sm text-gray-500"
            >
                <template v-for="term in seeAlso(asset)" :key="term.guid">
                    <TermPopover
                        :term="term"
                        trigger="hover"
                        :passing-fetched-term="true"
                        :mouse-enter-delay="termMouseEnterDelay"
                        :fetched-term="getFetchedTerm(term.guid)"
                        :is-fetched-term-loading="termLoading"
                        @visible="
                            () => {
                                handleTermPopoverVisibility(true, term)
                            }
                        "
                    >
                        <TermPill
                            :term="term"
                            :allow-delete="false"
                            @mouseleave="termLeftPill"
                            @mouseenter="termEnteredPill"
                        />
                    </TermPopover>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed } from 'vue'
    // composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTermPopover from '@/common/popover/term/useTermPopover'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'
    import {
        featureEnabledMap,
        ANTONYMS,
        SYNONYMS,
    } from '~/composables/labs/labFeatureList'

    // components
    import TermPill from '@/common/pills/term.vue'
    import TermPopover from '@/common/popover/glossary/index.vue'

    export default defineComponent({
        name: 'RelatedTermsWidget',
        components: { TermPopover, TermPill },
        props: {
            asset: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const {
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
            } = useTermPopover()
            const {
                mouseEnterDelay: termMouseEnterDelay,
                enteredPill: termEnteredPill,
                leftPill: termLeftPill,
            } = useMouseEnterDelay()
            const { seeAlso, antonyms, synonyms } = useAssetInfo()
            const showAntonyms = computed(
                () => featureEnabledMap.value[ANTONYMS]
            )
            const showSynonyms = computed(
                () => featureEnabledMap.value[SYNONYMS]
            )

            return {
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
                termMouseEnterDelay,
                termEnteredPill,
                termLeftPill,
                seeAlso,
                antonyms,
                showAntonyms,
                showSynonyms,
                synonyms,
            }
        },
    })
</script>
<style lang="less"></style>
